"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const LogOut = () => {
    toast({
      title: "SognedOut",
    });
     signOut();
  };
  return (
    <nav className="p-4  md:p-6 shadow-md w-full inset-0 bg-white ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-xl font-bold mb-4 md:mb-0" href="#">
          MistryMessage
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome {user?.username || user?.email}
            </span>
            <button className="w-full md:w-auto" onClick={LogOut}>
              Logout
            </button>
          </>
        ) : (
          <Button variant="ghost">
            {" "}
            <Link href="/sign-in">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
