import { useState } from 'react';

type ContestImageProps = {
  imageUrl: string;
};

export const ContestImage = ({ imageUrl }: ContestImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="gif-container mb-8 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="w-16 h-16 border-8 border-[#1EAEDB] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img 
        src={imageUrl} 
        alt="Contest" 
        className="w-full h-full object-contain rounded-lg"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};