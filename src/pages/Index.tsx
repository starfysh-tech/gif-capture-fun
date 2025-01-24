import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import GifUploader from "@/components/GifUploader";
import { supabase } from "@/integrations/supabase/client";
import { RandomGifDisplay } from "@/components/gif/RandomGifDisplay";
import { NameInput } from "@/components/gif/NameInput";

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
      const { data: contest, error } = await supabase
        .from("contests")
        .insert([{ image_url: gifUrl, creator_name: name }])
        .select()
        .single();

      if (error) throw error;

      navigate(`/contest/${contest.id}`);
    } catch (error) {
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
          <p className="text-black font-bold mb-4">
            Create your Totally Radical Caption Contest!
          </p>
          <ol>
            <li>Choosing a GIF or upload your own</li>
            <li>Share the link</li>
            <li>GIF CAPTION BATTLE!!1!</li>
            <li>In case of a tie, Justin decides.</li>
          </ol>
          <div className="h-2 bg-[#1EAEDB] my-4" />
        </div>

        <div className="space-y-6">
          <NameInput value={name} onChange={setName} />
          <RandomGifDisplay onGifSelected={handleSubmit} />

          <div className="relative">
            <div className="text-center mb-4 font-bold text-[#F97316]">
              - OR -
            </div>
            <GifUploader onGifSelected={handleSubmit} />
          </div>

          <div className="text-center text-sm text-gray-600 bg-[#FEF7CD] p-4 rounded border border-[#F97316]">
            <p>✨ Word Up! We support these formats: GIF, JPEG, PNG, WebP, AVIF ✨</p>
            <p>📁 Max size: 10MB (No Way!) 📁</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center max-w-md">
        <p className="text-xs text-black mb-4">
          🌟 Best viewed with Netscape Navigator! As if! 🌟
        </p>
        <div className="text-xs text-gray-600 bg-white p-4 rounded-lg border border-[#1EAEDB]">
          <p className="mb-2">Legal Disclaimer:</p>
          <p>By using this Caption Contest app, you agree that all captions submitted must be appropriate for general audiences. Users are responsible for their submissions. The app reserves the right to remove inappropriate content. Winners are determined by vote count only.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;