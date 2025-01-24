import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

interface RandomGifDisplayProps {
  onGifSelected: (gifUrl: string) => void;
}

// Extended list of 90s-themed GIFs moved to a separate file
import { RANDOM_GIFS } from "./gifData";

export const RandomGifDisplay = ({ onGifSelected }: RandomGifDisplayProps) => {
  const [seenGifs, setSeenGifs] = useState<Set<number>>(new Set());
  const [currentGifIndex, setCurrentGifIndex] = useState(() => {
    const randomIndex = Math.floor(Math.random() * RANDOM_GIFS.length);
    setSeenGifs(new Set([randomIndex])); // Track initial GIF as seen
    return randomIndex;
  });

  const handleRandomGif = () => {
    const unseenIndices = Array.from(Array(RANDOM_GIFS.length).keys())
      .filter(index => !seenGifs.has(index));
    
    if (unseenIndices.length === 0) {
      // Reset when all GIFs have been seen
      setSeenGifs(new Set());
      const newIndex = Math.floor(Math.random() * RANDOM_GIFS.length);
      setCurrentGifIndex(newIndex);
      setSeenGifs(new Set([newIndex]));
    } else {
      // Pick a random unseen GIF
      const randomUnseenIndex = unseenIndices[Math.floor(Math.random() * unseenIndices.length)];
      setCurrentGifIndex(randomUnseenIndex);
      setSeenGifs(prev => new Set([...prev, randomUnseenIndex]));
    }
  };

  const useCurrentGif = () => {
    onGifSelected(RANDOM_GIFS[currentGifIndex]);
  };

  return (
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
          onClick={useCurrentGif}
          className="w-full bg-[#F97316] hover:bg-[#FEC6A1] text-white font-bold"
        >
          Use This Fresh GIF!
        </Button>
      </div>
    </div>
  );
};