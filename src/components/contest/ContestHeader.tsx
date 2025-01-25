import { WINNER_GIF } from "@/components/gif/gifData";

interface ContestHeaderProps {
  votingClosed: boolean;
  winnerName?: string;
}

export const ContestHeader = ({ votingClosed, winnerName }: ContestHeaderProps) => {
  const hasTie = () => {
    // Logic to determine if there is a tie
    // This could involve checking the votes of the submissions
    // and returning true if there are multiple submissions with the highest votes
    return false; // Placeholder return value
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#F97316] mb-4 animate-pulse">
          Caption Battle Time!
        </h1>
        {!votingClosed && (
          <p className="text-lg text-gray-700">
            Vote for the most RADICAL caption! (Choose wisely, dude!)
          </p>
        )}
      </div>
      {votingClosed && hasTie() && (
        <div className="flex justify-center">
          <img src={WINNER_GIF} alt="Winner" className="max-w-[300px]" />
        </div>
      )}
      {votingClosed && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#F97316] animate-bounce">
            {winnerName} is the WINNER!
          </h2>
        </div>
      )}
    </div>
  );
};
