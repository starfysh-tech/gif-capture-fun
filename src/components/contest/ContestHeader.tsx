import { WINNER_GIF } from "@/components/gif/gifData";

interface ContestHeaderProps {
  votingClosed: boolean;
  winnerName?: string;
}

export const ContestHeader = ({ votingClosed }: ContestHeaderProps) => {
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
    </div>
  );
};