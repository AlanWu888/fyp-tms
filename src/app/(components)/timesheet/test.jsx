"use client";

import { useSession } from "next-auth/react";



const TestComponent = () => {
  const { data: session } = useSession()
  const userEmail = session?.user?.email

  return (
    <div className="grid place-items-center h-screen">
      {userEmail}
    </div>
  )
}

export default TestComponent