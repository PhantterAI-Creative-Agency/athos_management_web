"use client";

import { useAuth } from "@/hooks/useAuth";
import { ChatWidget } from "@/components/ChatWidget";

const CHURCH_SLUG = process.env.NEXT_PUBLIC_CHURCH_SLUG ?? "principios-de-vida";

export function AuthenticatedChatWidget() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) return <ChatWidget mode="authenticated" />;

  return <ChatWidget mode="guest" churchSlug={CHURCH_SLUG} />;
}
