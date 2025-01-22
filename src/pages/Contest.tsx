import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Share2, ThumbsUp, Trophy } from "lucide-react";

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
  const [caption, setCaption] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [votingClosed, setVotingClosed] = useState(false);
  const [winner, setWinner] = useState<Submission | null>(null);

  const imageUrl = location.state?.imageUrl || "https://placekitten.com/400/300";

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Totally Rad",
      description: "URL copied to clipboard",
      className: "bg-[#F97316] text-white",
    });
  };

  const handleVote = (submissionId: string) => {
    const userId = localStorage.getItem('userId') || Math.random().toString(36).substring(7);
    localStorage.setItem('userId', userId);

    setSubmissions(prev => {
      const submission = prev.find(sub => sub.id === submissionId);
      if (submission?.voters.includes(userId)) {
        toast({
          title: "No Way",
          description: "You already voted for this caption",
          className: "bg-[#F97316] text-white",
        });
        return prev;
      }

      return prev.map(sub =>
        sub.id === submissionId
          ? { ...sub, votes: sub.votes + 1, voters: [...sub.voters, userId] }
          : sub
      );
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !name.trim()) {
      toast({
        title: "Bogus",
        description: "You need to fill out both fields",
        className: "bg-[#F97316] text-white",
      });
      return;
    }

    const newSubmission = {
      name,
      caption,
      votes: 0,
      id: Math.random().toString(36).substring(7),
      voters: [],
    };

    setSubmissions(prev => [...prev, newSubmission]);
    setCaption("");
    setName("");
    toast({
      title: "Word Up",
      description: "Your caption is in the mix",
      className: "bg-[#F97316] text-white",
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
            onClick={() => navigate('/')}
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

          <div className="flex items-center gap-4 mb-6">
            <Input
              value={window.location.href}
              readOnly
              className="flex-1 border-2 border-[#1EAEDB] bg-white text-black font-bold"
            />
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold whitespace-nowrap"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          </div>

          {!votingClosed && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-black mb-1">
                  Your Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-[#1EAEDB] bg-white text-black font-bold"
                  placeholder="What's your 411"
                />
              </div>

              <div>
                <label htmlFor="caption" className="block text-sm font-bold text-black mb-1">
                  Your Caption
                </label>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="border-2 border-[#1EAEDB] bg-white text-black font-bold"
                  placeholder="Drop your caption here"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#F97316] hover:bg-[#FEC6A1] text-white font-bold"
              >
                Submit Caption
              </Button>
            </form>
          )}
        </div>

        <div className="bg-white border-4 border-[#1EAEDB] rounded-lg p-8 shadow-[8px_8px_0_0_rgba(30,174,219,0.5)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#F97316]">
              {votingClosed ? "Final Results" : "Current Captions"}
            </h2>
            {!votingClosed && submissions.length > 0 && (
              <Button
                onClick={handleCloseVoting}
                className="bg-[#F97316] hover:bg-[#FEC6A1] text-white font-bold"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Close Voting
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className={`caption-card flex justify-between items-center ${
                  winner?.id === submission.id ? "border-[#F97316] bg-[#FEF7CD]" : ""
                }`}
              >
                <div>
                  <p className="font-bold text-black">
                    <strong>{submission.name}</strong> - {submission.caption}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-black font-bold">{submission.votes}</span>
                  {!votingClosed && (
                    <Button
                      onClick
                      variant="outline"
                      className="border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {submissions.length === 0 && (
              <p className="text-center text-gray-600">
                No captions yet. Be the first to add one
              </p>
            )}
            {winner && (
              <div className="text-center mt-6">
                <h3 className="text-2xl font-bold text-[#F97316]">
                  Winner: <strong>{winner.name}</strong>
                </h3>
                <p className="text-lg">{winner.caption}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;