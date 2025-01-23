import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type ContestHeaderProps = {
  onShare: () => void;
};

export const ContestHeader = ({ onShare }: ContestHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <Button
        onClick={() => navigate("/")}
        variant="outline"
        className="border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home Base
      </Button>
      <Button
        onClick={onShare}
        variant="outline"
        className="border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share Link
      </Button>
    </div>
  );
};