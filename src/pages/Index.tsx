import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Link as LinkIcon } from "lucide-react";
import GifUploader from "@/components/GifUploader";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [name, setName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (gifUrl: string) => {
    if (!name.trim()) {
      toast({
        title: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we'd save this to a backend
    const contestId = Math.random().toString(36).substring(7);
    navigate(`/contest/${contestId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">GIF Caption Contest</h1>
          <p className="text-gray-600">Upload a GIF and start the fun!</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <GifUploader onGifSelected={handleSubmit} />

          <div className="text-center text-sm text-gray-500">
            <p>Supported formats: GIF</p>
            <p>Max file size: 10MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;