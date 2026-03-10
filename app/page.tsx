"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";
import { useCopilotAdditionalInstructions } from "@copilotkit/react-core";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { prompt } from "../lib/prompt";
import { Suspense } from "react";

function HomeContent() {
  useCopilotAdditionalInstructions({ instructions: prompt });

  return (
    <CopilotSidebar
      defaultOpen
      messageView={{ assistantMessage: { className: "copilot-assistant-message" } }}
      labels={{
        modalHeaderTitle: "Your Assistant",
        welcomeMessageText: "Hi! How can I help you today?",
        chatInputPlaceholder: "Ask me anything...",
      }}
    >
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 grow">
          {/* Your app content goes here */}
        </main>
        <Footer />
      </div>
    </CopilotSidebar>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
