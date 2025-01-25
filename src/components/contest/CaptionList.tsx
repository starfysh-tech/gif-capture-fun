import { Button } from "@/components/ui/button";
import { WINNER_GIF } from "@/components/gif/gifData";

interface CaptionListProps {
  submissions: {
    id: string;
    name: string;
    caption: string;
    votes: number;
    voters: string[];
  }[];
  onVote: (id: string) => void;
  onCloseVoting: () => void;
  isVotingClosed: boolean;
  winner: {
    name: string;
    caption: string;
    votes: number;
  } | null;
  currentUserId: string;
}

export const CaptionList = ({
  submissions,
  onVote,
  onCloseVoting,
  isVotingClosed,
  winner,
  currentUserId,
}: CaptionListProps) => {
  // Function to check if there's a tie for the highest votes
  const hasTie = () => {
    if (submissions.length < 2) return false;
    
    const sortedSubmissions = [...submissions].sort((a, b) => b.votes - a.votes);
    return sortedSubmissions[0].votes === sortedSubmissions[1].votes && sortedSubmissions[0].votes > 0;
  };

  return (
    <div className="space-y-6">
      {!isVotingClosed && submissions.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={onCloseVoting}
            className="bg-[#F97316] hover:bg-[#FEC6A1] text-white"
          >
            Close Voting
          </Button>
        </div>
      )}

      {isVotingClosed && hasTie() && (
        <div className="flex justify-center mb-8">
          <img 
            src={WINNER_GIF} 
            alt="Winner celebration" 
            className="h-32 object-contain rounded-lg border-4 border-[#F97316] shadow-lg"
          />
        </div>
      )}

      {isVotingClosed && winner && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-[#F97316] mb-2">
            Winner: <strong>{winner.name}</strong>
          </h3>
          <p className="text-lg italic">"{winner.caption}"</p>
        </div>
      )}

      <h2 className="text-2xl font-bold text-[#1EAEDB] mb-4">
        {isVotingClosed ? "Final Results" : "Current Submissions"}
      </h2>

      {submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white p-4 rounded-lg border-2 border-[#1EAEDB] shadow-[4px_4px_0_0_rgba(30,174,219,0.3)]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#F97316]">{submission.name}</p>
                  <p className="text-gray-700">{submission.caption}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[#1EAEDB] font-bold">
                    {submission.votes} {submission.votes === 1 ? "vote" : "votes"}
                  </span>
                  {!isVotingClosed && (
                    <Button
                      onClick={() => onVote(submission.id)}
                      variant={submission.voters.includes(currentUserId) ? "outline" : "default"}
                      className={
                        submission.voters.includes(currentUserId)
                          ? "border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black"
                          : "bg-[#1EAEDB] hover:bg-[#FEC6A1] text-white"
                      }
                    >
                      {submission.voters.includes(currentUserId) ? "Remove Vote" : "Vote"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic">
          No captions yet. Be the first to add one!
        </p>
      )}
    </div>
  );
};