import { Button } from "@/components/ui/button";
import { ThumbsUp, Trophy } from "lucide-react";

type Submission = {
  name: string;
  caption: string;
  votes: number;
  id: string;
  voters: string[];
};

type CaptionListProps = {
  submissions: Submission[];
  onVote: (submissionId: string) => void;
  onCloseVoting: () => void;
  isVotingClosed: boolean;
  winner: Submission | null;
  currentUserId: string;
};

export const CaptionList = ({
  submissions,
  onVote,
  onCloseVoting,
  isVotingClosed,
  winner,
  currentUserId,
}: CaptionListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#F97316]">
          {isVotingClosed ? "Final Results" : "Current Captions"}
        </h2>
        {!isVotingClosed && submissions.length > 0 && (
          <Button
            onClick={onCloseVoting}
            className="bg-[#F97316] hover:bg-[#FEC6A1] text-white font-bold"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Close Voting
          </Button>
        )}
      </div>

      {submissions.map((submission) => (
        <div
          key={submission.id}
          className={`flex justify-between items-center p-4 rounded-lg ${
            winner?.id === submission.id
              ? "border-2 border-[#F97316] bg-[#FEF7CD]"
              : "border border-[#1EAEDB]"
          }`}
        >
          <div>
            <p className="text-black">
              <strong>{submission.name}</strong> - {submission.caption}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-black font-bold">{submission.votes}</span>
            {!isVotingClosed && (
              <Button
                onClick={() => onVote(submission.id)}
                variant="outline"
                className={`border-2 ${
                  submission.voters.includes(currentUserId)
                    ? "bg-[#FEC6A1] border-[#F97316]"
                    : "border-[#1EAEDB] hover:bg-[#FEC6A1]"
                } text-black font-bold`}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}

      {submissions.length === 0 && (
        <p className="text-center text-gray-600">
          No captions yet. Be the first to add one
        </p>
      )}
    </div>
  );
};