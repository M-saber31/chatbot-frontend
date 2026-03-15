"use client";

import { CopilotSidebar,useConfigureSuggestions } from "@copilotkit/react-core/v2";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Suspense } from "react";

function HomeContent() {
  useConfigureSuggestions({
    suggestions: [
      { title: "Explain a concept", message: "Can you explain a concept I'm struggling with?" },
      { title: "Summarize", message: "Summarize the current topic for me." },
      { title: "Quiz me", message: "Quiz me on what we've discussed." },
      { title: "Help", message: "What can you help me with?" },
    ],
    available: "always",
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 grow">
        {/* Your app content goes here */}
      </main>
      <Footer />
      <CopilotSidebar
        defaultOpen
        labels={{
          modalHeaderTitle: "Your Assistant",
          welcomeMessageText: "Hi! How can I help you today?",
          chatInputPlaceholder: "Ask me anything...",
        }}
      />
    </div>
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
