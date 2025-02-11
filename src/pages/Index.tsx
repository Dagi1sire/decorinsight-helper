
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { DecorationAnalysis } from "@/components/DecorationAnalysis";
import { toast } from "sonner";

// Temporary mock function - replace with actual AI analysis
const analyzeDecoration = async (image: File) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response
  return [
    { name: "Balloon Arch", price: 2500 },
    { name: "Floral Centerpieces", price: 1800 },
    { name: "LED String Lights", price: 1200 },
    { name: "Table Runners", price: 800 },
    { name: "Chair Covers", price: 1500 },
  ];
};

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [materials, setMaterials] = useState<Array<{ name: string; price: number }>>([]);

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

      // Analyze image
      const results = await analyzeDecoration(file);
      setMaterials(results);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze image. Please try again.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

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
