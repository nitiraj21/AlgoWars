import { type NextAuthOptions, type Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { prisma } from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
      
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("No user found with this email");
        }
      
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }
      
        return { id: user.id, email: user.email, name: user.username };
      },
    }),

    // ✅ Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {

    async signIn({ user, account, profile }) {
      // ✅ Credentials login: just return true
      if (account?.provider === "credentials") {
        return true;
      }
    
      // ✅ Google/GitHub login logic
      if (account?.provider === "google" || account?.provider === "github") {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
    
        const emailUsername = user.email!.split('@')[0].replace(/\s+/g, "_");
        if (!existingUser) {
          const googleProfile = profile as { picture?: string };
          existingUser = await prisma.user.create({
            data: {
              email: user.email!,
              username: user.name || emailUsername,
              password: '', // no password for oauth users
              isAdmin: false,
              ProfilePic: googleProfile.picture,
            },
          });
        }
        return true;
      }
    
      return false; // block anything else
    }
    ,

    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id ?? token.id
        token.email = user.email ?? token.email
        token.name = user.name ?? token.name
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email
        session.user.name = token.name
      }
      return session
    },
  },
  pages: {
    signIn: '/signin', 
    newUser: '/signup', // optional: after first login redirect
  },
}
