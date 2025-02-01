import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type CaptionSubmissionProps = {
  onSubmit: (name: string, caption: string) => void;
  isVotingClosed: boolean;
};

export const CaptionSubmission = ({ onSubmit, isVotingClosed }: CaptionSubmissionProps) => {
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !name.trim()) {
      toast({
        title: "Bogus",
        description: "You need to fill out both fields",
        className: "bg-[#FEC6A1] text-black border-2 border-[#1EAEDB]",
      });
      return;
    }

    onSubmit(name, caption);
    setCaption("");
    setName("");
  };

  if (isVotingClosed) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-bold text-black mb-1">
          Your Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-2 border-[#1EAEDB] bg-white text-black"
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
          className="border-2 border-[#1EAEDB] bg-white text-black"
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
  );
};