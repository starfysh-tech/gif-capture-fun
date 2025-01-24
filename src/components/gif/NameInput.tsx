import { Input } from "@/components/ui/input";

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const NameInput = ({ value, onChange }: NameInputProps) => {
  return (
    <div>
      <label htmlFor="name" className="block text-sm font-bold text-black mb-1 uppercase">
        Your Name (Don't Have a Cow!)
      </label>
      <Input
        id="name"
        placeholder="What's your 411?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-2 border-[#1EAEDB] bg-white text-black font-bold"
      />
    </div>
  );
};