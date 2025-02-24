
import { Card } from "@/components/ui/card";

interface Material {
  name: string;
  price: number;
}

interface DecorationAnalysisProps {
  materials: Material[];
  isLoading?: boolean;
}

export const DecorationAnalysis = ({ materials, isLoading }: DecorationAnalysisProps) => {
  if (isLoading) {
    return (
      <Card className="p-6 space-y-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const materialsTotal = materials.reduce((sum, material) => sum + material.price, 0);
  const transportationFee = Math.ceil(materialsTotal * 0.1); // 10% of materials total
  const laborFee = Math.ceil(materialsTotal * 0.15); // 15% of materials total
  const totalPrice = materialsTotal + transportationFee + laborFee;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-ET', {
      style: 'currency',
      currency: 'ETB',
    });
  };

  return (
    <Card className="p-6 space-y-4 bg-white/80 backdrop-blur-sm animate-fade-up">
      <h3 className="text-lg font-semibold text-gray-900">Materials Analysis</h3>
      <div className="space-y-3">
        {materials.map((material, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
            <span className="text-gray-700">{material.name}</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(material.price)}
            </span>
          </div>
        ))}
        
        <div className="pt-4 space-y-2 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Materials Subtotal</span>
            <span className="font-medium text-gray-900">{formatCurrency(materialsTotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Transportation Fee (10%)</span>
            <span className="font-medium text-gray-900">{formatCurrency(transportationFee)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Labor Fee (15%)</span>
            <span className="font-medium text-gray-900">{formatCurrency(laborFee)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="font-semibold text-gray-900">Total Price</span>
          <span className="font-bold text-lg text-accent">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>
    </Card>
  );
};
