import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import GifUploader from "@/components/GifUploader";
import { useNavigate } from "react-router-dom";
import { Shuffle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Extended list of 90s-themed GIFs
const RANDOM_GIFS = [
  "https://media.giphy.com/media/3o7aTskHEUdgCQAXde/giphy.gif", // Original
  "https://media.giphy.com/media/26DN81TqLPIzBlksw/giphy.gif", // Original
  "https://media.giphy.com/media/l0HlPwMAzh13pcZ20/giphy.gif", // Original
  "https://media.giphy.com/media/3o7btXv9i4Pnjb1m0w/giphy.gif", // Original
  "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif", // Windows 95
  "https://media.giphy.com/media/CTX0ivSQbI78A/giphy.gif", // Tamagotchi
  "https://media.giphy.com/media/jpnUo1K9G5nzUuFUQT/giphy.gif", // Game Boy
  "https://media.giphy.com/media/ZE6HYckyroMWwSp11C/giphy.gif", // Nintendo 64
  "https://media.giphy.com/media/3rgXBrLlRs4ZlpnVDO/giphy.gif", // Furby
  "https://media.giphy.com/media/l41YmiCZ8HXvVl5M4/giphy.gif", // Beanie Babies
  "https://media.giphy.com/media/xT5LMQ8rHYTDGFG07e/giphy.gif", // Pokemon
  "https://media.giphy.com/media/3o6Zt4j96fDG4XzO0w/giphy.gif", // Power Rangers
  "https://media.giphy.com/media/3o6ZtfZp8ID54YUne0/giphy.gif", // Spice Girls
  "https://media.giphy.com/media/l4FGjNNQYCrC7ZvoI/giphy.gif", // NSYNC
  "https://media.giphy.com/media/3o7TKFe8xHMzUoNqg0/giphy.gif", // Backstreet Boys
  "https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif", // Britney Spears
  "https://media.giphy.com/media/3o6ZsX2OZJ8G3Tec6Y/giphy.gif", // Saved by the Bell
  "https://media.giphy.com/media/l41YagtOTyCfks2wU/giphy.gif", // Fresh Prince
  "https://media.giphy.com/media/3o7TKMeCOV3oXSb5bq/giphy.gif", // Full House
  "https://media.giphy.com/media/3o6Zt4HU9uwXmXSAuI/giphy.gif", // Boy Meets World
  "https://media.giphy.com/media/3o7TKFZa7JYJzfu5O0/giphy.gif", // Dawson's Creek
  "https://media.giphy.com/media/xT5LMPczMNDset02Tm/giphy.gif", // Friends
  "https://media.giphy.com/media/3o7TKv6MgQfdSRT01G/giphy.gif", // Seinfeld
  "https://media.giphy.com/media/3o7TKQm5mROo5pXd1S/giphy.gif", // The Matrix
  "https://media.giphy.com/media/3o7TKDt2tKDR6WRCuI/giphy.gif", // Space Jam
  "https://media.giphy.com/media/l41YaEfCkjCyHl1Oo/giphy.gif", // Jurassic Park
  "https://media.giphy.com/media/3o7TKPdUkkbCAVqWk0/giphy.gif", // Titanic
  "https://media.giphy.com/media/l41YfyxFn7bwk4DLy/giphy.gif", // Clueless
  "https://media.giphy.com/media/3o7TKMf5HQQlZvv9Cg/giphy.gif", // Pulp Fiction
  "https://media.giphy.com/media/3o7TKGy6TBUPrjtQLC/giphy.gif", // Wayne's World
  "https://media.giphy.com/media/xT5LMFZDsj0AKUDNG0/giphy.gif", // Ace Ventura
  "https://media.giphy.com/media/3o7TKJgTL1bgEXYbZK/giphy.gif", // Austin Powers
  "https://media.giphy.com/media/3o7TKVexQf66dMSCoo/giphy.gif", // Dumb and Dumber
  "https://media.giphy.com/media/3o7TKQ8kAP0f9X5PoY/giphy.gif", // Home Alone
  "https://media.giphy.com/media/3o7TKNjg8dxB5ysRnW/giphy.gif", // Jumanji
  "https://media.giphy.com/media/3o7TKSha51ATTx9KzC/giphy.gif", // Men in Black
  "https://media.giphy.com/media/3o7TKLy0He9SYe9xW8/giphy.gif", // Independence Day
  "https://media.giphy.com/media/3o7TKFe8xHMzUoNqg0/giphy.gif", // Terminator 2
  "https://media.giphy.com/media/3o7TKQ8dFZaYf5xhqU/giphy.gif", // Speed
  "https://media.giphy.com/media/3o7TKVZVhW5vZXhheE/giphy.gif", // The Fifth Element
  "https://media.giphy.com/media/3o7TKPATxXqYvEJVD2/giphy.gif", // Starship Troopers
  "https://media.giphy.com/media/3o7TKQ8dFZaYf5xhqU/giphy.gif", // Total Recall
  "https://media.giphy.com/media/3o7TKVZVhW5vZXhheE/giphy.gif", // RoboCop
  "https://media.giphy.com/media/3o7TKPATxXqYvEJVD2/giphy.gif"  // Judge Dredd
];

const Index = () => {
  const [name, setName] = useState("");
  const [seenGifs, setSeenGifs] = useState<Set<number>>(new Set());
  const [currentGifIndex, setCurrentGifIndex] = useState(() => {
    const randomIndex = Math.floor(Math.random() * RANDOM_GIFS.length);
    return randomIndex;
  });
  
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

  const handleRandomGif = () => {
    // Get array of indices not yet seen
    const availableIndices = Array.from(
      { length: RANDOM_GIFS.length },
      (_, i) => i
    ).filter(index => !seenGifs.has(index));

    // If we've seen all GIFs, reset the seen set and use all indices
    if (availableIndices.length === 0) {
      setSeenGifs(new Set());
      const newIndex = Math.floor(Math.random() * RANDOM_GIFS.length);
      setCurrentGifIndex(newIndex);
      setSeenGifs(new Set([newIndex]));
      return;
    }

    // Pick a random index from available indices
    const randomAvailableIndex = Math.floor(Math.random() * availableIndices.length);
    const newIndex = availableIndices[randomAvailableIndex];
    
    // Update state
    setCurrentGifIndex(newIndex);
    setSeenGifs(prev => new Set([...prev, newIndex]));
  };

  const useRandomGif = () => {
    handleSubmit(RANDOM_GIFS[currentGifIndex]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FEF7CD]">
      <div className="max-w-md w-full space-y-8 bg-white border-4 border-[#1EAEDB] rounded-lg p-8 shadow-[8px_8px_0_0_rgba(30,174,219,0.5)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#F97316] mb-2 animate-pulse">
            Totally Radical Caption Contest!
          </h1>
          <div className="h-2 bg-[#1EAEDB] my-4" />
          <p className="text-black font-bold">Drop Your Pics Here! It's All That!</p>
          <div className="h-2 bg-[#1EAEDB] my-4" />
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-black mb-1 uppercase">
              Your Name (Don't Have a Cow!)
            </label>
            <Input
              id="name"
              placeholder="What's your 411?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-[#1EAEDB] bg-white text-black font-bold"
            />
          </div>

          {RANDOM_GIFS[currentGifIndex] && (
            <div className="space-y-4">
              <div className="gif-container">
                <img 
                  src={RANDOM_GIFS[currentGifIndex]} 
                  alt="Random GIF" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleRandomGif}
                  variant="outline"
                  className="w-full border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Shuffle GIF (Totally Random!)
                </Button>
                <Button
                  onClick={useRandomGif}
                  className="w-full bg-[#F97316] hover:bg-[#FEC6A1] text-white font-bold"
                >
                  Use This Fresh GIF!
                </Button>
              </div>
            </div>
          )}

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
