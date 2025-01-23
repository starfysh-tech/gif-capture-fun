import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { ShareLink } from "@/components/contest/ShareLink";
import { CaptionSubmission } from "@/components/contest/CaptionSubmission";
import { CaptionList } from "@/components/contest/CaptionList";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Contest = Database['public']['Tables']['contests']['Row'];
type Submission = {
  name: string;
  caption: string;
  votes: number;
  id: string;
  voters: string[];
};

const Contest = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [votingClosed, setVotingClosed] = useState(false);
  const [winner, setWinner] = useState<Submission | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();

  const userId = localStorage.getItem("userId") || Math.random().toString(36).substring(7);

  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  // Fetch initial contest data and set up real-time subscription
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

    // Set up real-time subscription for contest updates
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
        (payload: { new: Contest }) => {
          if (payload.new) {
            setVotingClosed(payload.new.is_voting_closed ?? false);
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
  };

  const handleSubmit = async (name: string, caption: string) => {
    if (!id) return;

    const { error } = await supabase
      .from("captions")
      .insert([{ contest_id: id, name, caption }]);

    if (error) {
      toast({
        title: "Not Cool!",
        description: "Couldn't add your caption!",
        className: "bg-[#FEC6A1] text-black border-2 border-[#1EAEDB]",
      });
      return;
    }

    toast({
      title: "Word Up",
      description: "Your caption is in the mix",
      className: "bg-[#FEC6A1] text-black border-2 border-[#1EAEDB]",
    });
  };

  const handleVote = async (submissionId: string) => {
    if (!id) return;

    const submission = submissions.find((sub) => sub.id === submissionId);
    if (submission?.voters.includes(userId)) {
      // Remove vote
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("caption_id", submissionId)
        .eq("voter_id", userId);

      if (error) {
        toast({
          title: "Bogus!",
          description: "Couldn't remove your vote!",
          className: "bg-[#FEC6A1] text-black border-2 border-[#1EAEDB]",
        });
      }
    } else {
      // Add vote
      const { error } = await supabase
        .from("votes")
        .insert([{ caption_id: submissionId, voter_id: userId }]);

      if (error) {
        toast({
          title: "Not Cool!",
          description: "Couldn't add your vote!",
          className: "bg-[#FEC6A1] text-black border-2 border-[#1EAEDB]",
        });
      }
    }
  };

  const handleCloseVoting = async () => {
    if (!id) return;

    const { error } = await supabase
      .from("contests")
      .update({ is_voting_closed: true })
      .eq("id", id);

    if (error) {
      toast({
        title: "Bogus!",
        description: "Couldn't close voting!",
        className: "bg-[#FEC6A1] text-black border-2 border-[#1EAEDB]",
      });
      return;
    }

    setVotingClosed(true);
    const winningSubmission = submissions.reduce((prev, current) => 
      (current.votes > prev.votes) ? current : prev
    );
    setWinner(winningSubmission);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Totally Rad",
      description: "URL copied to clipboard",
      className: "bg-[#FEC6A1] text-black border-2 border-[#1EAEDB]",
    });
  };

  return (
    <div className="min-h-screen p-4 bg-[#FEF7CD]">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home Base
          </Button>
        </div>

        <div className="bg-white border-4 border-[#1EAEDB] rounded-lg p-8 shadow-[8px_8px_0_0_rgba(30,174,219,0.5)]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-[#F97316]">
              Caption This Pic
            </h1>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          </div>

          <div className="gif-container mb-8">
            <img 
              src={imageUrl} 
              alt="Contest" 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {!votingClosed && (
            <div className="mt-8">
              <CaptionSubmission
                onSubmit={handleSubmit}
                isVotingClosed={votingClosed}
              />
            </div>
          )}
        </div>

        <div className="bg-white border-4 border-[#1EAEDB] rounded-lg p-8 shadow-[8px_8px_0_0_rgba(30,174,219,0.5)]">
          <CaptionList
            submissions={submissions}
            onVote={handleVote}
            onCloseVoting={handleCloseVoting}
            isVotingClosed={votingClosed}
            winner={winner}
            currentUserId={userId}
          />
        </div>
      </div>
    </div>
  );
};

export default Contest;