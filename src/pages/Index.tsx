import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import GifUploader from "@/components/GifUploader";
import { supabase } from "@/integrations/supabase/client";
import { RandomGifDisplay } from "@/components/gif/RandomGifDisplay";
import { NameInput } from "@/components/gif/NameInput";
import { NETSCAPE_GIF } from "@/components/gif/gifData";

const Index = () => {
  const [name, setName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (gifUrl: string) => {
    if (!name.trim()) {
      toast({
        title: "Not Cool!",
        description: "Yo dawg, we need your name!",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Creating contest with GIF URL:", gifUrl);
      const { data: contest, error } = await supabase
        .from("contests")
        .insert([{ image_url: gifUrl, creator_name: name }])
        .select()
        .single();

      if (error) {
        console.error("Error creating contest:", error);
        throw error;
      }

      console.log("Contest created successfully:", contest);
      navigate(`/contest/${contest.id}`);
    } catch (error) {
      console.error("Failed to create contest:", error);
      toast({
        title: "Bogus!",
        description: "Something went totally wrong!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FEF7CD]">
      <div className="max-w-md w-full space-y-8 bg-white border-4 border-[#1EAEDB] rounded-lg p-8 shadow-[8px_8px_0_0_rgba(30,174,219,0.5)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#F97316] mb-2 animate-pulse">
            Totally Radical Caption Contest!
          </h1>
          <div className="h-2 bg-[#1EAEDB] my-4" />
          <p className="text-black font-bold mb-4 text-xl animate-bounce">
            🔥 WHOA! Create Your Most Excellent Caption Battle! 🔥
          </p>
          <ol className="list-decimal list-inside space-y-2 text-left bg-[#FFE4B5] p-4 rounded-lg border-2 border-[#F97316] shadow-inner">
            <li className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              🎮 Pick a totally tubular GIF or upload your own (NO WAY!)
            </li>
            <li className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              🌟 Share the radical link with your homies
            </li>
            <li className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              💥 CAPTION BATTLE TO THE MAX!!1!
            </li>
            <li className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              🏆 Tie = Justin's the boss! WORD!
            </li>
          </ol>
          <div className="h-2 bg-[#1EAEDB] my-4" />
        </div>

        <div className="space-y-6">
          <NameInput value={name} onChange={setName} />
          <RandomGifDisplay onGifSelected={handleSubmit} />

          <div className="relative">
            <div className="text-center mb-4 font-bold text-[#F97316]">
              - TOTALLY RAD ALTERNATIVE! -
            </div>
            <GifUploader onGifSelected={handleSubmit} />
          </div>

          <div className="text-center text-sm text-gray-600 bg-[#FEF7CD] p-4 rounded border-2 border-[#F97316] animate-pulse">
            <p>✨ COWABUNGA! We support these formats: GIF, JPEG, PNG, WebP, AVIF ✨</p>
            <p>📁 Max size: 10MB (BOGUS!) 📁</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-4 bg-white p-2 rounded-lg border-2 border-[#1EAEDB] animate-pulse">
          <p className="text-xs text-black">🌟 Best viewed with</p>
          <img src={NETSCAPE_GIF} alt="Netscape Navigator" className="h-6" />
          <p className="text-xs text-black">As if! 🌟</p>
        </div>
        <div className="text-xs text-gray-600 bg-white p-4 rounded-lg border-2 border-[#1EAEDB] shadow-inner">
          <p className="mb-2 font-bold">Legal Disclaimer (BORING STUFF):</p>
          <p>By using this totally radical Caption Contest app, you agree to keep it clean (DUH!). Users gotta be responsible for their own stuff. We can remove anything that's not cool. Winners are picked by votes - NO CHEATING!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;