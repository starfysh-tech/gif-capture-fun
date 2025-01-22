import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";

export const ShareLink = () => {
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Totally Rad",
      description: "URL copied to clipboard",
      className: "bg-[#FEC6A1] text-black border-2 border-[#1EAEDB]",
    });
  };

  return (
    <div className="space-y-4">
      <Input
        value={window.location.href}
        readOnly
        className="w-full border-2 border-[#1EAEDB] bg-white text-black font-bold"
      />
      <Button
        onClick={handleShare}
        variant="outline"
        className="w-full border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share Link
      </Button>
    </div>
  );
};