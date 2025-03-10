"use client";

import { useState, useEffect } from "react";
import { Search, Send, Terminal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

import {
  createSession,
  queryContract,
  handleUserMessage,
  executeCommand,
} from "@/app/scripts/QueryNebula.mjs";

import { useActiveAccount } from "thirdweb/react";

import {
  sendAndConfirmTransaction,
  prepareTransaction,
  defineChain,
} from "thirdweb";
import { client } from "../client";
import Link from "next/link";

export function BlockchainExplorer() {
  const searchParams = useSearchParams();
  const chainId = searchParams.get("chainId");
  const contractAddress = searchParams.get("searchTerm");

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const account = useActiveAccount();
  const walletAddress = account?.address;

  useEffect(() => {
    const initSession = async () => {
      try {
        const newSessionId = await createSession("Blockchain Explorer Session");
        setSessionId(newSessionId);
        setIsTyping(true);

        const contractDetails = await queryContract(
          contractAddress!,
          chainId!,
          newSessionId
        );
        setMessages([
          { role: "system", content: "Welcome to the Blockchain Explorer." },
          {
            role: "system",
            content:
              contractDetails || "No details available for this contract.",
          },
        ]);

        setIsTyping(false);
      } catch (error) {
        console.error("Error creating session or querying contract:", error);
        setMessages([
          {
            role: "system",
            content: "Failed to load contract details. Please try again.",
          },
        ]);
        setIsTyping(false);
      }
    };

    initSession();
  }, [contractAddress, chainId]);

  const handleSend = async () => {
    if (!input.trim() || !sessionId || !chainId || !contractAddress) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");

    try {
      setIsTyping(true);
      const response = await handleUserMessage(
        userMessage,
        sessionId,
        chainId,
        contractAddress
      );
      setMessages((prev) => [...prev, { role: "system", content: response }]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error handling user message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Failed to process your query. Please try again.",
        },
      ]);
      setIsTyping(false);
    }
  };

  const handleExecute = async () => {
    if (!account?.address || !input.includes("execute")) return;

    const executeMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: executeMessage }]);
    setInput("");

    try {
      setIsTyping(true);

      const executeResponse = await executeCommand(
        executeMessage,
        account.address,
        "default-user", // Optional user ID
        false, // Stream option
        chainId,
        contractAddress,
        sessionId
      );

      const action = executeResponse.actions?.find(
        (a: { type: string; data: string }) => a.type === "sign_transaction"
      );

      if (action) {
        const transactionData = JSON.parse(action.data); // Parse the transaction data
        const preparedTransaction = prepareTransaction({
          to: transactionData.to,
          value: transactionData.value,
          data: transactionData.data,
          chain: defineChain(transactionData.chainId),
          client,
        });

        // Send and confirm the transaction using thirdweb
        const receipt = await sendAndConfirmTransaction({
          transaction: preparedTransaction,
          account,
        });

        // Add the transaction receipt hash to the chat
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: `Transaction sent successfully! Hash: ${receipt.transactionHash}`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: "No transaction to sign in the response.",
          },
        ]);
      }

      setIsTyping(false);
    } catch (error) {
      console.error("Error executing transaction:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Failed to execute the command. Please try again.",
        },
      ]);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side - Chat interface */}
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center mb-4">
          <Search className="w-6 h-6 text-gray-500 mr-2" />
          <h1 className="text-xl font-bold">
            <Link href="/">OCTO</Link>
          </h1>
        </div>
        <div className="flex-grow bg-white rounded-lg shadow-md p-4 mb-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              {message.role === "system" ? (
                <div className="bg-gray-200 text-gray-800 rounded-lg p-2">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <span className="inline-block bg-blue-500 text-white rounded-lg p-2">
                  {message.content}
                </span>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="text-left mb-2">
              <span className="inline-block p-2 rounded-lg bg-gray-200 text-gray-800 animate-pulse">
                Typing...
              </span>
            </div>
          )}
        </div>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this contract or execute a command..."
            className="flex-grow p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="w-6 h-6" />
          </button>
          {input.includes("execute") && (
            <button
              onClick={handleExecute}
              className="ml-2 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Terminal className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
