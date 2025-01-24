import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CaptionSubmission } from "@/components/contest/CaptionSubmission";
import { CaptionList } from "@/components/contest/CaptionList";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContestHeader } from "@/components/contest/ContestHeader";
import { ContestImage } from "@/components/contest/ContestImage";
import { useContestData } from "@/components/contest/useContestData";
import { Home } from "lucide-react";

const Contest = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const {
    submissions,
    votingClosed,
    winner,
    imageUrl,
    fetchCaptions,
    setVotingClosed,
    setWinner
  } = useContestData(id);

  const userId = localStorage.getItem("userId") || Math.random().toString(36).substring(7);

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
    
    // Fetch captions immediately after submitting to show the first caption
    fetchCaptions();
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
      (current.votes > prev.votes) ? current : prev,
      submissions[0]
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
          <Link to="/">
            <Button
              variant="outline"
              className="border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <ContestHeader 
          votingClosed={votingClosed} 
          winnerName={winner?.name}
        />

        <div className="bg-white border-4 border-[#1EAEDB] rounded-lg p-8 shadow-[8px_8px_0_0_rgba(30,174,219,0.5)]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-[#F97316]">
              Caption This Pic
            </h1>
            <Button
              onClick={handleShare}
              className="bg-[#F97316] hover:bg-[#FEC6A1] text-white"
            >
              Share Contest
            </Button>
          </div>

          <ContestImage imageUrl={imageUrl} />

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