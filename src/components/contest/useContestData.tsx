import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type Contest = Database['public']['Tables']['contests']['Row'];
type Submission = {
  name: string;
  caption: string;
  votes: number;
  id: string;
  voters: string[];
};

export const useContestData = (id: string | undefined) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [votingClosed, setVotingClosed] = useState(false);
  const [winner, setWinner] = useState<Submission | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();

  const fetchCaptions = async () => {
    if (!id) return;

    const { data: captions, error } = await supabase
      .from("captions")
      .select(`
        id,
        name,
        caption,
        votes (
          voter_id
        )
      `)
      .eq("contest_id", id);

    if (error) {
      console.error("Error fetching captions:", error);
      return;
    }

    const formattedSubmissions = captions.map((caption) => ({
      id: caption.id,
      name: caption.name,
      caption: caption.caption,
      votes: caption.votes?.length || 0,
      voters: caption.votes?.map((vote: any) => vote.voter_id) || [],
    }));

    setSubmissions(formattedSubmissions);

    // If voting is closed, determine the winner
    if (votingClosed) {
      const winningSubmission = formattedSubmissions.reduce((prev, current) => 
        (current.votes > prev.votes) ? current : prev,
        formattedSubmissions[0]
      );
      setWinner(winningSubmission);
    }
  };

  useEffect(() => {
    const fetchContest = async () => {
      if (!id) return;

      const { data: contest, error } = await supabase
        .from("contests")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          title: "Bogus!",
          description: "Contest not found!",
          className: "bg-[#FEC6A1] text-black border-2 border-[#1EAEDB]",
        });
        return;
      }

      setImageUrl(contest.image_url);
      setVotingClosed(contest.is_voting_closed ?? false);
    };

    fetchContest();

    const channel = supabase
      .channel("contest_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contests",
          filter: `id=eq.${id}`,
        },
        (payload: RealtimePostgresChangesPayload<Contest>) => {
          if (payload.new && 'is_voting_closed' in payload.new) {
            setVotingClosed(payload.new.is_voting_closed ?? false);
            fetchCaptions(); // Fetch captions to update winner when voting closes
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "captions",
          filter: `contest_id=eq.${id}`,
        },
        () => {
          fetchCaptions();
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
          fetchCaptions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, toast]);

  return {
    submissions,
    votingClosed,
    winner,
    imageUrl,
    fetchCaptions,
    setVotingClosed,
    setWinner
  };
};