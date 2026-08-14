'use client';

import React from 'react';
import { FoodItem, ServingOption } from '@/types/food';
import { Printer } from 'lucide-react';

interface USDANutritionLabelProps {
  food: FoodItem;
  grams: number;
  serving?: ServingOption;
}

export const USDANutritionLabel: React.FC<USDANutritionLabelProps> = ({
  food,
  grams,
  serving,
}) => {
  const scale = grams / 100;
  const n = food.nutrientsPer100g;

  const cal = Math.round(n.calories * scale);
  const totalFat = (n.fat * scale).toFixed(1);
  const satFat = ((n.saturatedFat || 0) * scale).toFixed(1);
  const chol = Math.round((n.cholesterol || 0) * scale);
  const sodium = Math.round((n.sodium || 0) * scale);
  const totalCarb = (n.carbohydrates * scale).toFixed(1);
  const fiber = ((n.fiber || 0) * scale).toFixed(1);
  const sugars = ((n.sugar || 0) * scale).toFixed(1);
  const protein = (n.protein * scale).toFixed(1);
  const potas = Math.round((n.potassium || 0) * scale);

  // FDA Standard Daily Values (based on 2,000 cal diet)
  const fatDV = Math.round((parseFloat(totalFat) / 78) * 100);
  const satFatDV = Math.round((parseFloat(satFat) / 20) * 100);
  const cholDV = Math.round((chol / 300) * 100);
  const sodiumDV = Math.round((sodium / 2300) * 100);
  const carbDV = Math.round((parseFloat(totalCarb) / 275) * 100);
  const fiberDV = Math.round((parseFloat(fiber) / 28) * 100);
  const potasDV = Math.round((potas / 4700) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border-2 border-black p-5 rounded-none text-black font-sans max-w-xs w-full shadow-lg">
      <div className="flex justify-between items-start border-b-8 border-black pb-1 mb-1">
        <div>
          <h2 className="font-extrabold text-3xl leading-none tracking-tight font-serif">
            Nutrition Facts
          </h2>
          <div className="text-xs font-medium pt-1">
            {serving ? serving.label : `${grams}g Serving`}
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-black print:hidden cursor-pointer"
          title="Print Label"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-between items-baseline border-b-4 border-black py-2">
        <div>
          <div className="text-[10px] font-bold uppercase">Amount Per Serving</div>
          <div className="font-extrabold text-2xl leading-none">Calories</div>
        </div>
        <div className="font-extrabold text-4xl leading-none">{cal}</div>
      </div>

      <div className="text-right text-[10px] font-bold border-b border-black py-1">
        % Daily Value*
      </div>

      <div className="text-xs space-y-1 py-1 border-b border-black">
        <div className="flex justify-between">
          <span>
            <strong>Total Fat</strong> {totalFat}g
          </span>
          <strong>{fatDV}%</strong>
        </div>
        <div className="flex justify-between pl-4 text-[11px]">
          <span>Saturated Fat {satFat}g</span>
          <strong>{satFatDV}%</strong>
        </div>
        <div className="flex justify-between">
          <span>
            <strong>Cholesterol</strong> {chol}mg
          </span>
          <strong>{cholDV}%</strong>
        </div>
        <div className="flex justify-between">
          <span>
            <strong>Sodium</strong> {sodium}mg
          </span>
          <strong>{sodiumDV}%</strong>
        </div>
        <div className="flex justify-between">
          <span>
            <strong>Total Carbohydrate</strong> {totalCarb}g
          </span>
          <strong>{carbDV}%</strong>
        </div>
        <div className="flex justify-between pl-4 text-[11px]">
          <span>Dietary Fiber {fiber}g</span>
          <strong>{fiberDV}%</strong>
        </div>
        <div className="pl-4 text-[11px]">Total Sugars {sugars}g</div>
        <div className="flex justify-between pt-1 border-t border-gray-200">
          <span>
            <strong>Protein</strong> {protein}g
          </span>
          <span className="font-bold text-gray-500">—</span>
        </div>
      </div>

      <div className="text-[11px] py-1 border-b-4 border-black space-y-0.5">
        <div className="flex justify-between">
          <span>Potassium {potas}mg</span>
          <span>{potasDV}%</span>
        </div>
      </div>

      <div className="text-[9px] leading-tight text-gray-600 pt-2">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </div>
    </div>
  );
};
