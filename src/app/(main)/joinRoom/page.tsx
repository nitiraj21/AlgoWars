import JoinRoom from '@/src/components/JoinRoom/JoinRoom'
import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
export default async function page() {
  
  const session = await getServerSession()
  if (!session) redirect("/api/auth/signin/1");


  return (
    <JoinRoom/>
  )
}
