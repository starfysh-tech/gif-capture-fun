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
    // Simulate file upload
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
          className="flex min-h-[160px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 transition-colors hover:border-primary"
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <span className="relative rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80">
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
        />
        <Button
          onClick={handleUrlSubmit}
          disabled={isUploading}
          variant="outline"
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          Submit URL
        </Button>
      </div>
    </div>
  );
};

export default GifUploader;