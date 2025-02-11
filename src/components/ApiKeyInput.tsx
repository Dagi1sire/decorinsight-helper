
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
}

export const ApiKeyInput = ({ onSubmit }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Enter Gemini API Key</h2>
        <p className="text-sm text-gray-600">
          Your API key will only be used for this session and won't be stored.
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="flex-1"
        />
        <Button type="submit" disabled={!apiKey.trim()}>
          Submit
        </Button>
      </div>
    </form>
  );
};
