"use client";

import { ConnectEmbed, lightTheme, useActiveAccount } from "thirdweb/react";
import { Hero } from "./components/Hero";
import { client } from "./client";
import { defineChain } from "thirdweb";

export default function Home() {
  const account = useActiveAccount();
  return (
    <main>
      <div className="flex items-center content-center h-screen justify-center">
        <ConnectEmbed
          client={client}
          theme={lightTheme()}
          chain={defineChain(57054)}
        />
        {account?.address ? <Hero /> : ""}
      </div>
    </main>
  );
}
