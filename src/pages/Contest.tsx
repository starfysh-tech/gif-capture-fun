import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Share2, ThumbsUp } from "lucide-react";

const Contest = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Array<{ 
    name: string; 
    caption: string;
    votes: number;
    id: string;
  }>>([]);

  const imageUrl = location.state?.imageUrl || "https://placekitten.com/400/300";

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Totally Rad!",
      description: "URL copied to clipboard! Share it with your homies!",
    });
  };

  const handleVote = (submissionId: string) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, votes: (sub.votes || 0) + 1 }
          : sub
      )
    );
    toast({
      title: "Cowabunga!",
      description: "Your vote has been counted! That caption is all that!",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !name.trim()) {
      toast({
        title: "Bogus!",
        description: "Don't have a cow! You need to fill out both fields!",
        variant: "destructive",
      });
      return;
    }

    const newSubmission = {
      name,
      caption,
      votes: 0,
      id: Math.random().toString(36).substring(7),
    };

    setSubmissions(prev => [...prev, newSubmission]);
    setCaption("");
    setName("");
    toast({
      title: "Word Up!",
      description: "Your caption is da bomb! Thanks for participating!",
    });
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
            Back to the Crib
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share This Jam
          </Button>
        </div>

        <div className="bg-white border-4 border-[#1EAEDB] rounded-lg p-8 shadow-[8px_8px_0_0_rgba(30,174,219,0.5)]">
          <h1 className="text-4xl font-bold text-[#F97316] mb-6 animate-pulse">
            Yo! Caption This Radical Pic!
          </h1>

          <div className="gif-container mb-8">
            <img src={imageUrl} alt="Contest" className="rounded-lg" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-black mb-1">
                Your Name (for real!)
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-[#1EAEDB] bg-white text-black font-bold"
                placeholder="What's your 411?"
              />
            </div>

            <div>
              <label htmlFor="caption" className="block text-sm font-bold text-black mb-1">
                Your Fresh Caption
              </label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="border-2 border-[#1EAEDB] bg-white text-black font-bold"
                placeholder="Drop your dopest caption here!"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#F97316] hover:bg-[#FEC6A1] text-white font-bold"
            >
              Submit Your Rad Caption!
            </Button>
          </form>
        </div>

        <div className="bg-white border-4 border-[#1EAEDB] rounded-lg p-8 shadow-[8px_8px_0_0_rgba(30,174,219,0.5)]">
          <h2 className="text-3xl font-bold text-[#F97316] mb-6">
            Totally Awesome Captions!
          </h2>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="caption-card flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-black">{submission.caption}</p>
                  <p className="text-sm text-gray-600">- {submission.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-black font-bold">{submission.votes || 0}</span>
                  <Button
                    onClick={() => handleVote(submission.id)}
                    variant="outline"
                    className="border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {submissions.length === 0 && (
              <p className="text-center text-gray-600">
                No captions yet... Don't have a cow! Be the first to add one!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;