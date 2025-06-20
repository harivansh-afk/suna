'use client';

import { initiateAgent, InitiateAgentResponse } from "@/lib/api";
import { createMutationHook } from "@/hooks/use-query";
import { handleApiSuccess, handleApiError } from "@/lib/error-handler";
import { dashboardKeys } from "./keys";
import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/hooks/use-modal-store";
import { projectKeys, threadKeys } from "../sidebar/keys";
import { subscriptionKeys } from "../subscriptions/keys";

export const useInitiateAgentMutation = createMutationHook<
  InitiateAgentResponse,
  FormData
>(
  initiateAgent,
  {
    errorContext: { operation: 'initiate agent', resource: 'AI assistant' },
    onSuccess: (data) => {
      handleApiSuccess("Agent initiated successfully", "Your AI assistant is ready to help");
    },
    onError: (error) => {
      if (error instanceof Error && error.message.toLowerCase().includes("payment required")) {
        return;
      }
      handleApiError(error, { operation: 'initiate agent', resource: 'AI assistant' });
    }
  }
);

export const useInitiateAgentWithInvalidation = () => {
  const queryClient = useQueryClient();
  const { onOpen } = useModal();
  return useInitiateAgentMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: threadKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.agents });
      // Invalidate subscription data to update usage count
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
      queryClient.invalidateQueries({ queryKey: ['billing', 'status'] });
    },
    onError: (error) => {
      console.log('Mutation error:', error);
      if (error instanceof Error) {
        const errorMessage = error.message;
        if (errorMessage.toLowerCase().includes("payment required")) {
          console.log('Opening payment required modal');
          onOpen("paymentRequiredDialog");
          return;
        }
      }
    }
  });
};
