"use client";

import { Suspense } from "react";
import { BlockchainExplorer } from "../components/BlockchainExplorer";

export default function ExplorerPage() {
  return (
    <div className="h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <BlockchainExplorer />
      </Suspense>
    </div>
  );
}
