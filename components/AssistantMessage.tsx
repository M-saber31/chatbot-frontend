"use client";

import { CopilotChatAssistantMessage, CopilotChatAssistantMessageProps } from "@copilotkit/react-core/v2";

export function CustomAssistantMessage(props: CopilotChatAssistantMessageProps) {
  return (
    <div className="pb-2">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <CopilotChatAssistantMessage {...props} />
      </div>
    </div>
  );
}
