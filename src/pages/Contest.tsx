import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ShareLink } from "@/components/contest/ShareLink";
import { CaptionSubmission } from "@/components/contest/CaptionSubmission";
import { CaptionList } from "@/components/contest/CaptionList";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const imageUrl = location.state?.imageUrl || "https://placekitten.com/400/300";
  const userId = localStorage.getItem("userId") || Math.random().toString(36).substring(7);

  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  const handleSubmit = (name: string, caption: string) => {
    const newSubmission = {
      name,
      caption,
      votes: 0,
      id: Math.random().toString(36).substring(7),
      voters: [],
    };

    setSubmissions(prev => [...prev, newSubmission]);
    toast({
      title: "Word Up",
      description: "Your caption is in the mix",
      className: "bg-[#FEC6A1] text-black border-2 border-[#1EAEDB]",
    });
  };

  const handleVote = (submissionId: string) => {
    setSubmissions(prev => {
      const submission = prev.find(sub => sub.id === submissionId);
      if (submission?.voters.includes(userId)) {
        // Remove vote
        return prev.map(sub =>
          sub.id === submissionId
            ? {
                ...sub,
                votes: sub.votes - 1,
                voters: sub.voters.filter(v => v !== userId),
              }
            : sub
        );
      }
      // Add vote
      return prev.map(sub =>
        sub.id === submissionId
          ? { ...sub, votes: sub.votes + 1, voters: [...sub.voters, userId] }
          : sub
      );
    });
  };

  const handleCloseVoting = () => {
    setVotingClosed(true);
    const winningSubmission = submissions.reduce((prev, current) => 
      (current.votes > prev.votes) ? current : prev
    );
    setWinner(winningSubmission);
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
          <h1 className="text-4xl font-bold text-[#F97316] mb-6">
            Caption This Pic
          </h1>

          <div className="gif-container mb-8">
            <img src={imageUrl} alt="Contest" className="rounded-lg" />
          </div>

          <ShareLink />

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