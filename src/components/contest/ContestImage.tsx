type ContestImageProps = {
  imageUrl: string;
};

export const ContestImage = ({ imageUrl }: ContestImageProps) => {
  return (
    <div className="gif-container mb-8">
      <img 
        src={imageUrl} 
        alt="Contest" 
        className="w-full h-full object-contain rounded-lg"
      />
    </div>
  );
};