import { WINNER_GIF } from "@/components/gif/gifData";

interface ContestHeaderProps {
  votingClosed: boolean;
  winnerName?: string;
  isTie?: boolean;
}

export const ContestHeader = ({ votingClosed, winnerName, isTie }: ContestHeaderProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#F97316] mb-4 animate-pulse">
          {votingClosed ? "WINNER WINNER!" : "Caption Battle Time!"}
        </h1>
        {!votingClosed && (
          <p className="text-lg text-gray-700">
            Vote for the most RADICAL caption! (Choose wisely, dude!)
          </p>
        )}
      </div>

      {votingClosed && winnerName && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#1EAEDB]">
              {isTie 
                ? "🏆 It's a tie! Everyone's TOTALLY AWESOME! 🏆"
                : `🏆 ${winnerName} is like, TOTALLY AWESOME! 🏆`}
            </p>
          </div>
        </div>
      )}

      {votingClosed && winnerName && isTie && (
        <div className="flex justify-center mt-8">
          <img 
            src={WINNER_GIF} 
            alt="Winner celebration" 
            className="h-32 object-contain rounded-lg border-4 border-[#F97316] shadow-lg"
          />
        </div>
      )}
    </div>
  );
};