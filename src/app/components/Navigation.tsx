'use client';

import Link from 'next/link'

import { ConnectButton } from "thirdweb/react";
import { client } from "../client"


export function Navigation() {


  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Chain Explorer
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
            </div>
          </div>
          <ConnectButton
            client={client}
            connectModal={{ size: "compact" }}
          />
        </div>
      </div>
    </nav>
  )
}