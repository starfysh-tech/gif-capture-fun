import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Contest } from "@/types/contest";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const useContestSubscription = (
  contestId: string | undefined,
  onVotingClosed: (closed: boolean) => void,
  onDataChange: () => void
) => {
  useEffect(() => {
    if (!contestId) return;

    const channel = supabase
      .channel("contest_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contests",
          filter: `id=eq.${contestId}`,
        },
        (payload: RealtimePostgresChangesPayload<Contest>) => {
          if (payload.new && 'is_voting_closed' in payload.new) {
            onVotingClosed(payload.new.is_voting_closed ?? false);
            onDataChange();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "captions",
          filter: `contest_id=eq.${contestId}`,
        },
        () => {
          onDataChange();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
        },
        () => {
          onDataChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contestId, onVotingClosed, onDataChange]);
};