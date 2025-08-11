import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BatchScalingCalculator = ({ recipe, onClose, onApplyScaling }) => {
  const [targetYield, setTargetYield] = useState(recipe?.yield || 1);
  const [scalingFactor, setScalingFactor] = useState(1);

  const calculateScalingFactor = (newYield) => {
    if (recipe?.yield && recipe?.yield > 0) {
      return newYield / recipe?.yield;
    }
    return 1;
  };

  const handleYieldChange = (e) => {
    const newYield = parseInt(e?.target?.value) || 1;
    setTargetYield(newYield);
    setScalingFactor(calculateScalingFactor(newYield));
  };

  const handleFactorChange = (e) => {
    const newFactor = parseFloat(e?.target?.value) || 1;
    setScalingFactor(newFactor);
    setTargetYield(Math.round((recipe?.yield || 1) * newFactor));
  };

  const getScaledIngredients = () => {
    if (!recipe?.ingredients) return [];

    return recipe?.ingredients?.map(ingredient => ({
      ...ingredient,
      originalQuantity: ingredient?.quantity,
      scaledQuantity: ingredient?.quantity * scalingFactor
    }));
  };

  const getScaledCosts = () => {
    const originalTotalCost = recipe?.totalCost || 0;
    const scaledTotalCost = originalTotalCost * scalingFactor;
    const scaledCostPerUnit = targetYield > 0 ? scaledTotalCost / targetYield : 0;

    return {
      originalTotalCost,
      scaledTotalCost,
      originalCostPerUnit: recipe?.costPerUnit || 0,
      scaledCostPerUnit
    };
  };

  const scaledIngredients = getScaledIngredients();
  const costs = getScaledCosts();

  const handleApply = () => {
    const scaledRecipe = {
      ...recipe,
      yield: targetYield,
      ingredients: scaledIngredients?.map(ing => ({
        ...ing,
        quantity: ing?.scaledQuantity
      })),
      totalCost: costs?.scaledTotalCost,
      costPerUnit: costs?.scaledCostPerUnit,
      name: `${recipe?.name} (${scalingFactor}x)`,
      isScaled: true,
      originalRecipeId: recipe?.id,
      scalingFactor
    };

    onApplyScaling(scaledRecipe);
  };

  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Calculadora de Escalonamento</h3>
            <p className="text-sm text-muted-foreground">
              Ajuste a quantidade da receita: {recipe?.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          >
            <span className="sr-only">Fechar</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Scaling Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="text-lg font-semibold text-foreground">{recipe?.yield}</div>
              <div className="text-sm text-muted-foreground">Rendimento Original</div>
            </div>
            <div className="space-y-4">
              <Input
                label="Novo Rendimento"
                type="number"
                min="1"
                value={targetYield}
                onChange={handleYieldChange}
              />
              <Input
                label="Fator de Escala"
                type="number"
                step="0.1"
                min="0.1"
                value={scalingFactor}
                onChange={handleFactorChange}
              />
            </div>
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <div className="text-lg font-semibold text-primary">{targetYield}</div>
              <div className="text-sm text-muted-foreground">Novo Rendimento</div>
            </div>
          </div>

          {/* Quick Scale Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm font-medium text-foreground">Escalas rápidas:</span>
            {[0.5, 1, 1.5, 2, 2.5, 3, 4, 5]?.map(factor => (
              <Button
                key={factor}
                variant={scalingFactor === factor ? "default" : "outline"}
                size="xs"
                onClick={() => {
                  setScalingFactor(factor);
                  setTargetYield(Math.round(recipe?.yield * factor));
                }}
              >
                {factor}x
              </Button>
            ))}
          </div>

          {/* Cost Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-3">Custos Originais</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custo Total:</span>
                  <span className="font-medium">R$ {costs?.originalTotalCost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custo por Unidade:</span>
                  <span className="font-medium">R$ {costs?.originalCostPerUnit?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rendimento:</span>
                  <span className="font-medium">{recipe?.yield} unidades</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-3">Custos Escalonados</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custo Total:</span>
                  <span className="font-medium text-primary">R$ {costs?.scaledTotalCost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custo por Unidade:</span>
                  <span className="font-medium text-primary">R$ {costs?.scaledCostPerUnit?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rendimento:</span>
                  <span className="font-medium text-primary">{targetYield} unidades</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scaled Ingredients */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-4">Ingredientes Escalonados</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground">Ingrediente</th>
                    <th className="text-right py-2 text-muted-foreground">Quantidade Original</th>
                    <th className="text-right py-2 text-muted-foreground">Nova Quantidade</th>
                    <th className="text-right py-2 text-muted-foreground">Diferença</th>
                  </tr>
                </thead>
                <tbody>
                  {scaledIngredients?.map((ingredient, index) => {
                    const difference = ingredient?.scaledQuantity - ingredient?.originalQuantity;
                    const differenceColor = difference > 0 ? 'text-success' : difference < 0 ? 'text-error' : 'text-muted-foreground';

                    return (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-2 font-medium text-foreground">
                          {/* This would normally show ingredient name from lookup */}
                          Ingrediente {index + 1}
                        </td>
                        <td className="text-right py-2 text-muted-foreground">
                          {ingredient?.originalQuantity?.toFixed(2)} {ingredient?.unit}
                        </td>
                        <td className="text-right py-2 font-medium text-foreground">
                          {ingredient?.scaledQuantity?.toFixed(2)} {ingredient?.unit}
                        </td>
                        <td className={`text-right py-2 font-medium ${differenceColor}`}>
                          {difference > 0 ? '+' : ''}{difference?.toFixed(2)} {ingredient?.unit}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Fator de escala: {scalingFactor}x | Novo rendimento: {targetYield} unidades
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleApply}
              iconName="Calculator"
              iconPosition="left"
              iconSize={16}
            >
              Aplicar Escalonamento
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchScalingCalculator;