"use client";

import { AgentPreview } from "./agents/AgentPreview";

const App: React.FC = () => {
  const agentDetails = {
    id: "chatbot",
    object: "chatbot",
    created_at: Date.now(),
    name: "Chatbot",
    description: "This is a sample chatbot.",
    model: "default",
    metadata: {
      logo: "Avatar_Default.svg",
    },
  };

  return (
    <div className="app-container">
      <AgentPreview resourceId="sample-resource-id" agentDetails={agentDetails} />
    </div>
  );
};

export default App;
