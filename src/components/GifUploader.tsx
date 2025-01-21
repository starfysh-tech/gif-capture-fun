import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Link as LinkIcon } from "lucide-react";

interface GifUploaderProps {
  onGifSelected: (gifUrl: string) => void;
}

const GifUploader = ({ onGifSelected }: GifUploaderProps) => {
  const [gifUrl, setGifUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("gif")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a GIF file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const fakeUrl = URL.createObjectURL(file);
      onGifSelected(fakeUrl);
      setIsUploading(false);
    }, 1500);
  }, [onGifSelected, toast]);

  const handleUrlSubmit = useCallback(() => {
    if (!gifUrl.trim()) {
      toast({
        title: "Please enter a GIF URL",
        variant: "destructive",
      });
      return;
    }

    if (!gifUrl.toLowerCase().endsWith('.gif')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GIF URL",
        variant: "destructive",
      });
      return;
    }

    onGifSelected(gifUrl);
  }, [gifUrl, onGifSelected, toast]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="file"
          accept="image/gif"
          onChange={handleFileUpload}
          className="hidden"
          id="gif-upload"
        />
        <label
          htmlFor="gif-upload"
          className="flex min-h-[160px] cursor-pointer items-center justify-center rounded-lg border-4 border-dashed border-[#1EAEDB] px-6 py-10 transition-colors hover:border-[#F97316] bg-white"
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-[#1EAEDB]" />
            <div className="mt-4 flex text-sm leading-6 text-black font-bold">
              <span className="relative rounded-md font-bold text-[#F97316] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#F97316] focus-within:ring-offset-2 hover:text-[#F97316]/80">
                Upload a GIF
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
          </div>
        </label>
      </div>

      <div className="flex space-x-2">
        <Input
          type="url"
          placeholder="Or paste a GIF URL"
          value={gifUrl}
          onChange={(e) => setGifUrl(e.target.value)}
          className="border-2 border-[#1EAEDB] bg-white text-black font-bold"
        />
        <Button
          onClick={handleUrlSubmit}
          disabled={isUploading}
          variant="outline"
          className="border-2 border-[#1EAEDB] hover:bg-[#FEC6A1] text-black font-bold"
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          Submit URL
        </Button>
      </div>
    </div>
  );
};

export default GifUploader;