"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem } from "@radix-ui/react-select";
import { SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const blockchains = [
  { id: "57054", name: "Sonic Blaze Testnet" }, 
];

export function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    console.log("Searching:", searchTerm, "on chain:", selectedChain);
    router.push(
      `/explorer?chainId=${selectedChain}&searchTerm=${encodeURIComponent(
        searchTerm
      )}`
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-8">
          <span className="block">AI Blockchain Explorer</span>
          <span className="block text-indigo-600">Powered by Sonic </span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl mb-8">
          Enter any contract address
        </p>
        <div className="max-w-3xl mx-auto mt-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Enter contract address or transaction hash"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Select value={selectedChain} onValueChange={setSelectedChain}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                {blockchains.map((chain) => (
                  <SelectItem key={chain.id} value={chain.id}>
                    {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="w-full sm:w-auto">
              <Link
                href="/explorer"
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <SearchIcon />
                <span>Search</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}