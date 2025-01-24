import { WINNER_GIF } from "@/components/gif/gifData";

interface ContestHeaderProps {
  votingClosed: boolean;
  winnerName?: string;
}

export const ContestHeader = ({ votingClosed, winnerName }: ContestHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-[#F97316] mb-4 animate-pulse">
        {votingClosed ? "WINNER WINNER!" : "Caption Battle Time!"}
      </h1>
      {votingClosed && winnerName && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-2xl font-bold text-[#1EAEDB]">
            🏆 {winnerName} is like, TOTALLY AWESOME! 🏆
          </p>
          <img 
            src={WINNER_GIF} 
            alt="Winner celebration" 
            className="mx-auto h-32 object-contain rounded-lg border-4 border-[#F97316] shadow-lg"
          />
        </div>
      )}
      {!votingClosed && (
        <p className="text-lg text-gray-700">
          Vote for the most RADICAL caption! (Choose wisely, dude!)
        </p>
      )}
    </div>
  );
};