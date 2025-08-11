import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ProductionForm = ({ selectedRecipe, onSubmit, userRole = 'staff' }) => {
  const [formData, setFormData] = useState({
    quantity: '',
    batchNumber: '',
    productionDate: new Date()?.toISOString()?.split('T')?.[0],
    productionTime: new Date()?.toTimeString()?.slice(0, 5),
    qualityNotes: '',
    wasteAmount: '',
    wasteReason: ''
  });

  const [ingredientDeductions, setIngredientDeductions] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock current inventory levels
  const currentInventory = {
    'farinha-trigo': 50000, // 50kg
    'fermento-biologico': 2000, // 2kg
    'sal': 5000, // 5kg
    'acucar': 10000, // 10kg
    'oleo-vegetal': 8000, // 8L
    'ovos': 240, // 20 dozen
    'leite': 15000, // 15L
    'manteiga': 3000 // 3kg
  };

  const wasteReasons = [
    { value: 'queimado', label: 'Queimado' },
    { value: 'mal-formado', label: 'Mal Formado' },
    { value: 'textura-inadequada', label: 'Textura Inadequada' },
    { value: 'sabor-alterado', label: 'Sabor Alterado' },
    { value: 'contaminacao', label: 'Contaminação' },
    { value: 'outros', label: 'Outros' }
  ];

  // Quick quantity buttons for staff
  const quickQuantities = [10, 20, 50, 100];

  useEffect(() => {
    if (selectedRecipe && formData?.quantity) {
      calculateIngredientDeductions();
    }
  }, [selectedRecipe, formData?.quantity]);

  const calculateIngredientDeductions = () => {
    if (!selectedRecipe || !formData?.quantity) return;

    const quantity = parseInt(formData?.quantity);
    const batchYield = selectedRecipe?.yield;
    const multiplier = quantity / batchYield;

    const deductions = selectedRecipe?.ingredients?.map(ingredient => {
      const requiredAmount = ingredient?.amount * multiplier;
      const currentStock = currentInventory?.[ingredient?.id] || 0;
      const remainingStock = currentStock - requiredAmount;

      return {
        ...ingredient,
        requiredAmount,
        currentStock,
        remainingStock,
        hasEnoughStock: remainingStock >= 0,
        stockStatus: remainingStock < 0 ? 'insufficient' :
                    remainingStock < (ingredient?.minStock || 0) ? 'low' : 'sufficient'
      };
    });

    setIngredientDeductions(deductions);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData?.quantity || parseInt(formData?.quantity) <= 0) {
      errors.quantity = 'Quantidade deve ser maior que zero';
    }

    if (!formData?.batchNumber?.trim()) {
      errors.batchNumber = 'Número do lote é obrigatório';
    }

    // Check if there's enough stock for all ingredients
    const insufficientIngredients = ingredientDeductions?.filter(ing => !ing?.hasEnoughStock);
    if (insufficientIngredients?.length > 0) {
      errors.ingredients = `Estoque insuficiente para: ${insufficientIngredients?.map(ing => ing?.name)?.join(', ')}`;
    }

    if (userRole === 'manager' && formData?.wasteAmount && !formData?.wasteReason) {
      errors.wasteReason = 'Motivo do desperdício é obrigatório quando há desperdício';
    }

    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const productionData = {
        ...formData,
        recipeId: selectedRecipe?.id,
        recipeName: selectedRecipe?.name,
        ingredientDeductions,
        timestamp: new Date()?.toISOString(),
        userId: 'current-user-id',
        userRole
      };

      await onSubmit(productionData);

      // Reset form after successful submission
      setFormData({
        quantity: '',
        batchNumber: '',
        productionDate: new Date()?.toISOString()?.split('T')?.[0],
        productionTime: new Date()?.toTimeString()?.slice(0, 5),
        qualityNotes: '',
        wasteAmount: '',
        wasteReason: ''
      });
      setIngredientDeductions([]);
      setValidationErrors({});

    } catch (error) {
      console.error('Error submitting production log:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickQuantity = (quantity) => {
    setFormData(prev => ({ ...prev, quantity: quantity?.toString() }));
  };

  const formatAmount = (amount, unit) => {
    if (unit === 'g' && amount >= 1000) {
      return `${(amount / 1000)?.toFixed(1)}kg`;
    }
    if (unit === 'ml' && amount >= 1000) {
      return `${(amount / 1000)?.toFixed(1)}L`;
    }
    return `${amount}${unit}`;
  };

  if (!selectedRecipe) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <Icon name="ChefHat" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Selecione uma Receita</h3>
          <p className="text-muted-foreground">
            Escolha uma receita no painel à esquerda para começar o registro de produção.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center gap-3 mb-2">
          <Icon name="ClipboardList" size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Registro de Produção</h2>
        </div>
        <p className="text-muted-foreground">
          Registrando produção para: <span className="font-medium text-foreground">{selectedRecipe?.name}</span>
        </p>
      </div>
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Production Details */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <Icon name="Package" size={20} />
              Detalhes da Produção
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Quantidade Produzida"
                  type="number"
                  placeholder="Ex: 50"
                  value={formData?.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e?.target?.value }))}
                  error={validationErrors?.quantity}
                  required
                  className="text-lg"
                />

                {/* Quick Quantity Buttons for Staff */}
                {userRole === 'staff' && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Quantidades rápidas:</p>
                    <div className="flex gap-2">
                      {quickQuantities?.map(qty => (
                        <Button
                          key={qty}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickQuantity(qty)}
                          className="px-3 py-1"
                        >
                          {qty}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Número do Lote"
                type="text"
                placeholder="Ex: LT-240804-001"
                value={formData?.batchNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e?.target?.value }))}
                error={validationErrors?.batchNumber}
                required
              />

              <Input
                label="Data de Produção"
                type="date"
                value={formData?.productionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, productionDate: e?.target?.value }))}
                required
              />

              <Input
                label="Horário de Produção"
                type="time"
                value={formData?.productionTime}
                onChange={(e) => setFormData(prev => ({ ...prev, productionTime: e?.target?.value }))}
                required
              />
            </div>
          </div>

          {/* Ingredient Deduction Preview */}
          {ingredientDeductions?.length > 0 && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Icon name="Calculator" size={20} />
                Previsão de Consumo de Ingredientes
              </h3>

              {validationErrors?.ingredients && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                  <div className="flex items-center gap-2 text-error">
                    <Icon name="AlertTriangle" size={16} />
                    <span className="font-medium">{validationErrors?.ingredients}</span>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Ingrediente</th>
                      <th className="text-right py-2 text-sm font-medium text-muted-foreground">Necessário</th>
                      <th className="text-right py-2 text-sm font-medium text-muted-foreground">Disponível</th>
                      <th className="text-right py-2 text-sm font-medium text-muted-foreground">Restante</th>
                      <th className="text-center py-2 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredientDeductions?.map((ingredient, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 text-foreground font-medium">{ingredient?.name}</td>
                        <td className="py-3 text-right text-foreground">
                          {formatAmount(ingredient?.requiredAmount, ingredient?.unit)}
                        </td>
                        <td className="py-3 text-right text-foreground">
                          {formatAmount(ingredient?.currentStock, ingredient?.unit)}
                        </td>
                        <td className="py-3 text-right text-foreground">
                          {formatAmount(ingredient?.remainingStock, ingredient?.unit)}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            ingredient?.stockStatus === 'insufficient' ?'bg-error/10 text-error'
                              : ingredient?.stockStatus === 'low' ?'bg-warning/10 text-warning' :'bg-success/10 text-success'
                          }`}>
                            <Icon
                              name={
                                ingredient?.stockStatus === 'insufficient' ? 'XCircle' :
                                ingredient?.stockStatus === 'low' ? 'AlertTriangle' : 'CheckCircle'
                              }
                              size={12}
                            />
                            {ingredient?.stockStatus === 'insufficient' ? 'Insuficiente' :
                             ingredient?.stockStatus === 'low' ? 'Baixo' : 'Suficiente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manager-only fields */}
          {userRole === 'manager' && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Icon name="Settings" size={20} />
                Controles Avançados
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Quantidade de Desperdício"
                  type="number"
                  placeholder="Ex: 2"
                  value={formData?.wasteAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, wasteAmount: e?.target?.value }))}
                  description="Unidades perdidas durante a produção"
                />

                {formData?.wasteAmount && (
                  <Select
                    label="Motivo do Desperdício"
                    options={wasteReasons}
                    value={formData?.wasteReason}
                    onChange={(value) => setFormData(prev => ({ ...prev, wasteReason: value }))}
                    error={validationErrors?.wasteReason}
                    placeholder="Selecione o motivo"
                    required
                  />
                )}

                <div className="md:col-span-2">
                  <Input
                    label="Notas de Qualidade"
                    type="text"
                    placeholder="Observações sobre a qualidade do produto..."
                    value={formData?.qualityNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, qualityNotes: e?.target?.value }))}
                    description="Opcional: observações sobre textura, sabor, aparência, etc."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  quantity: '',
                  batchNumber: '',
                  productionDate: new Date()?.toISOString()?.split('T')?.[0],
                  productionTime: new Date()?.toTimeString()?.slice(0, 5),
                  qualityNotes: '',
                  wasteAmount: '',
                  wasteReason: ''
                });
                setIngredientDeductions([]);
                setValidationErrors({});
              }}
            >
              Limpar Formulário
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Save"
              iconPosition="left"
              disabled={!selectedRecipe || !formData?.quantity}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Produção'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductionForm;