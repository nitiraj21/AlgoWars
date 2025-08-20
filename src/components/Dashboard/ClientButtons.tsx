
"use client";
import { useRouter } from "next/navigation";
import Button from "@/src/components/button";

export default function ClientButtons() {
  const router = useRouter();
  return (
    <>
      <Button
        text="Create Room"
        onClick={() => router.push("/CreateRoom")}
        Class="bg-gradient-to-r from-gray-500/15 to-gray-500/15 backdrop-blur-xl mt-3 mr-3"
      />
      <Button
        text="Join Room"
        onClick={() => router.push("/joinRoom")}
        Class="bg-gradient-to-r from-gray-500/15 to-gray-500/15 backdrop-blur-xl mt-3 mr-3"
      />
    </>
  );
}
