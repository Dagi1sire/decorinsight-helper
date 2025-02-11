
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { DecorationAnalysis } from "@/components/DecorationAnalysis";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { toast } from "sonner";

const analyzeWithGemini = async (imageFile: File, apiKey: string) => {
  try {
    // Convert image to base64
    const base64Image = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.readAsDataURL(imageFile);
    });

    // Call Gemini API with updated model name
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: "Analyze this party decoration image and list the materials used along with their estimated rental prices in Ethiopian Birr (ETB). Format the response as a JSON array with objects containing 'name' and 'price' properties.",
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    const text = data.candidates[0].content.parts[0].text;
    console.log('Extracted text:', text);
    
    // Try to parse the response as JSON
    try {
      // Find JSON content between ```json and ``` markers
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        // Clean the JSON string by removing comments and parsing
        const jsonStr = jsonMatch[1].replace(/\/\/.*$/gm, '').trim();
        const parsedData = JSON.parse(jsonStr);
        console.log('Parsed JSON:', parsedData);
        return parsedData;
      }
      
      // If no JSON markers found, try parsing the entire text as JSON
      const parsedData = JSON.parse(text);
      console.log('Parsed JSON:', parsedData);
      return parsedData;
    } catch (e) {
      console.log('Failed to parse as JSON, falling back to text parsing');
      // If parsing fails, try to extract information from the text
      const lines = text.split('\n');
      const materials = lines
        .filter(line => line.trim().length > 0 && !line.startsWith('**') && !line.startsWith('```')) // Filter out empty lines and markdown
        .map(line => {
          // Match patterns like "Item name - 1000 ETB" or "Item name: 1000 ETB"
          const match = line.match(/([^:-]+)(?:-|:)\s*(?:ETB)?\s*(\d+)/i);
          if (match) {
            return {
              name: match[1].trim(),
              price: parseInt(match[2])
            };
          }
          return null;
        })
        .filter(item => item !== null);
      
      console.log('Extracted materials:', materials);
      return materials;
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [materials, setMaterials] = useState<Array<{ name: string; price: number }>>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleImageSelect = async (file: File) => {
    try {
      // File size validation (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Preview image
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsAnalyzing(true);

      // Check if API key is available
      if (!apiKey) {
        toast.error("Please enter your Gemini API key first");
        setIsAnalyzing(false);
        return;
      }

      // Analyze image
      const results = await analyzeWithGemini(file, apiKey);
      setMaterials(results);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze image. Please try again.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-primary/10 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ApiKeyInput onSubmit={setApiKey} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-primary/10 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-up">
          <h1 className="text-4xl font-bold text-gray-900">
            Party Decoration Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Upload a decoration image to get material details and rental prices
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ImageUpload onImageSelect={handleImageSelect} />
            {selectedImage && (
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg animate-fade-in">
                <img
                  src={selectedImage}
                  alt="Selected decoration"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>

          {(isAnalyzing || materials.length > 0) && (
            <DecorationAnalysis
              materials={materials}
              isLoading={isAnalyzing}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
