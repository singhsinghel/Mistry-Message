"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const LogOut = () => {
    toast({
      title: "SignedOut",
    });
     signOut();
  };
  return (
    <nav className="p-4  md:p-6 shadow-md w-full inset-0 bg-white">
      <div className="container px-4 h-10 md:h-auto sm:px-6 md:px-8 lg:px-48 mx-auto flex justify-between items-center">
        <Link className="text-xl font-bold md:mb-0" href="/">
          MistryMessage
        </Link>
        <div className="left">
          {session ? (
            <>
              <span className="mr-4 hidden md:inline">
                <Link href="/dashboard">
                  Welcome {user?.username || user?.email}
                </Link>
              </span>
              {/* alert dialog to logout */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="w-full md:w-auto  tracking-wide font-semibold">
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Do you really want to logout?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600" onClick={LogOut}>
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Button variant="ghostDelete">
              {" "}
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
