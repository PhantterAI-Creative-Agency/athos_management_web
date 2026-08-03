"use client";

import { useAuth } from "@/hooks/useAuth";
import { ChatWidget } from "@/components/ChatWidget";

export function AuthenticatedChatWidget() {
  const { user } = useAuth();

  if (!user) return null;

  return <ChatWidget mode="authenticated" />;
}
