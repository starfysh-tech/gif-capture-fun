import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const Contest = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Array<{ name: string; caption: string }>>([]);

  const imageUrl = location.state?.imageUrl || "https://placekitten.com/400/300";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caption.trim() || !name.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setSubmissions([...submissions, { name, caption }]);
    toast({
      title: "Caption submitted!",
      description: "Your caption has been added to the contest.",
    });
    setCaption("");
  };

  return (
    <div className="min-h-screen p-4 bg-[#FEF7CD]">
      <div className="max-w-3xl mx-auto space-y-8">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-4 border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="bg-white border-4 border-[#1EAEDB] rounded-lg p-8 shadow-[8px_8px_0_0_rgba(30,174,219,0.5)]">
          <h1 className="text-4xl font-bold text-[#F97316] mb-6 animate-pulse">
            Caption This Image!
          </h1>
          
          <div className="border-4 border-[#F97316] p-2 mb-8">
            <img
              src={imageUrl}
              alt="Contest image"
              className="max-w-full h-auto mx-auto"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-black mb-1 uppercase">
                Your Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-[#1EAEDB] bg-white text-black font-bold"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="caption" className="block text-sm font-bold text-black mb-1 uppercase">
                Your Caption
              </label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="border-2 border-[#1EAEDB] bg-white text-black font-bold"
                placeholder="Enter your funny caption"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#F97316] hover:bg-[#F97316]/90 text-white font-bold py-2 px-4 border-b-4 border-[#EA580C] hover:border-[#EA580C]/90 rounded"
            >
              Submit Caption
            </Button>
          </form>
        </div>

        <div className="bg-white border-4 border-[#1EAEDB] rounded-lg p-8 shadow-[8px_8px_0_0_rgba(30,174,219,0.5)]">
          <h2 className="text-2xl font-bold text-[#F97316] mb-4">
            Submitted Captions
          </h2>
          
          {submissions.length === 0 ? (
            <p className="text-black font-bold text-center py-4">
              No captions yet! Be the first to submit one! 🎉
            </p>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub, index) => (
                <div
                  key={index}
                  className="p-4 border-2 border-[#FEC6A1] rounded bg-white"
                >
                  <p className="font-bold text-[#F97316]">{sub.caption}</p>
                  <p className="text-sm text-black">- {sub.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-black">
          🌟 Best viewed with Netscape Navigator 🌟
        </p>
      </div>
    </div>
  );
};

export default Contest;