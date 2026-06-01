"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { createApprovalAction } from "../../../../../../features/approvals/actions";

type RequestApprovalButtonProps = {
  quoteId: string;
};

export function RequestApprovalButton({ quoteId }: RequestApprovalButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    setIsSubmitting(true);
    setMessage(null);

    const result = await createApprovalAction({ quoteId });

    if (result.success) {
      router.push(`/approvals/${result.approval.id}`);
      router.refresh();
      return;
    }

    setMessage(result.message);
    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button type="button" onClick={handleClick} disabled={isSubmitting}>
        <Send data-icon="inline-start" aria-hidden="true" />
        {isSubmitting ? "Solicitando..." : "Solicitar aprobación"}
      </Button>
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
    </div>
  );
}
