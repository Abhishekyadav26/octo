"use client";

import { ConnectButton, ConnectEmbed, lightTheme } from "thirdweb/react";
import { Hero } from "./components/Hero";
import { client } from "./client";
import { defineChain } from "thirdweb";


export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}