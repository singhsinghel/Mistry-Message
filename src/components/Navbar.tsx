'use client'
import React from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react'
import {User} from 'next-auth'

const Navbar = () => {
    const {data:sesion}=useSession()
    
  return (
    <div>
      Navbar
    </div>
  )
}

export default Navbar
