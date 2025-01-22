import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import GifUploader from "@/components/GifUploader";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [name, setName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (gifUrl: string) => {
    if (!name.trim()) {
      toast({
        title: "Not Cool!",
        description: "Yo dawg, we need your name!",
        variant: "destructive",
      });
      return;
    }

    const contestId = Math.random().toString(36).substring(7);
    navigate(`/contest/${contestId}`, { state: { imageUrl: gifUrl } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FEF7CD]">
      <div className="max-w-md w-full space-y-8 bg-white border-4 border-[#1EAEDB] rounded-lg p-8 shadow-[8px_8px_0_0_rgba(30,174,219,0.5)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#F97316] mb-2 animate-pulse">
            Radical Image Caption Contest!
          </h1>
          <div className="h-2 bg-[#1EAEDB] my-4" />
          <p className="text-black font-bold">Drop Your Pics Here! It's Gonna Be All That!</p>
          <div className="h-2 bg-[#1EAEDB] my-4" />
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-black mb-1 uppercase">
              Your Name (Don't be buggin')
            </label>
            <Input
              id="name"
              placeholder="What's your 411?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-[#1EAEDB] bg-white text-black font-bold"
            />
          </div>

          <GifUploader onGifSelected={handleSubmit} />

          <div className="text-center text-sm text-black font-bold bg-[#FEC6A1] p-4 rounded border-2 border-[#F97316]">
            <p>✨ Word Up! We support these formats: GIF, JPEG, PNG, WebP, AVIF ✨</p>
            <p>📁 Max size: 10MB (Don't have a cow!) 📁</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-black">
          🌟 Best viewed with Netscape Navigator! As if! 🌟
        </p>
      </div>
    </div>
  );
};

export default Index;