"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  approveApprovalAction,
  rejectApprovalAction,
} from "../../../../../../features/approvals/actions";

type ApprovalResponseFormProps = {
  approvalId: string;
};

export function ApprovalResponseForm({ approvalId }: ApprovalResponseFormProps) {
  const router = useRouter();
  const [responseNotes, setResponseNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function respond(action: "approve" | "reject") {
    setIsSubmitting(true);
    setMessage(null);

    const input = {
      id: approvalId,
      responseNotes,
    };
    const result =
      action === "approve"
        ? await approveApprovalAction(input)
        : await rejectApprovalAction(input);

    if (result.success) {
      router.refresh();
      return;
    }

    setMessage(result.message);
    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="responseNotes" className="text-sm font-medium">
          Notas de respuesta
        </label>
        <Textarea
          id="responseNotes"
          value={responseNotes}
          onChange={(event) => setResponseNotes(event.target.value)}
          placeholder="Observaciones internas sobre la respuesta"
        />
      </div>

      {message ? <p className="text-sm text-destructive">{message}</p> : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => void respond("reject")}
        >
          <X data-icon="inline-start" aria-hidden="true" />
          Rechazar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => void respond("approve")}
        >
          <Check data-icon="inline-start" aria-hidden="true" />
          Aprobar
        </Button>
      </div>
    </div>
  );
}
