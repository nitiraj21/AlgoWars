
import { get } from "http";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "../lib/auth";
import Container from "../components/LandingPage/Container";
import MainPage from "../components/LandingPage/MainPage";
import { redirect } from "next/navigation";


export default async function Home() {
  const session  = await getServerSession();
  return (
    <> 
      <MainPage/>
    </>
  );
}
