'use client'
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button className="bg-teal-400" onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button className ="bg-teal-500 p-1 px-3 m-4 rounded" onClick={() => signIn()}>Sign in</button>
    </>
  );
}
