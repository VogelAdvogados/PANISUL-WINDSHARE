import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const IngredientRow = ({
  ingredient,
  index,
  availableIngredients,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  isReadOnly
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const ingredientOptions = availableIngredients?.map(ing => ({
    value: ing?.id,
    label: `${ing?.name} (${ing?.unit})`,
    description: `Estoque: ${ing?.stock} ${ing?.unit} - R$ ${ing?.costPerUnit?.toFixed(2)}/${ing?.unit}`
  }));

  const unitOptions = [
    { value: 'kg', label: 'Quilogramas (kg)' },
    { value: 'g', label: 'Gramas (g)' },
    { value: 'l', label: 'Litros (l)' },
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'unidade', label: 'Unidades' },
    { value: 'xícara', label: 'Xícaras' },
    { value: 'colher_sopa', label: 'Colheres de Sopa' },
    { value: 'colher_chá', label: 'Colheres de Chá' }
  ];

  const selectedIngredient = availableIngredients?.find(ing => ing?.id === ingredient?.ingredientId);
  const totalCost = ingredient?.quantity * (selectedIngredient?.costPerUnit || 0);
  const isAvailable = selectedIngredient && selectedIngredient?.stock >= ingredient?.quantity;

  const handleIngredientChange = (ingredientId) => {
    const selected = availableIngredients?.find(ing => ing?.id === ingredientId);
    onUpdate(index, {
      ...ingredient,
      ingredientId,
      unit: selected?.unit || ingredient?.unit,
      costPerUnit: selected?.costPerUnit || 0
    });
  };

  const handleQuantityChange = (e) => {
    const quantity = parseFloat(e?.target?.value) || 0;
    onUpdate(index, {
      ...ingredient,
      quantity,
      costPerUnit: selectedIngredient?.costPerUnit || 0
    });
  };

  const handleUnitChange = (unit) => {
    onUpdate(index, {
      ...ingredient,
      unit
    });
  };

  const handleNotesChange = (e) => {
    onUpdate(index, {
      ...ingredient,
      notes: e?.target?.value
    });
  };

  return (
    <div className={`p-4 border rounded-lg transition-all duration-200 ${
      !isAvailable && ingredient?.ingredientId
        ? 'border-warning bg-warning/5' :'border-border bg-card'
    }`}>
      <div className="flex items-start gap-4">
        {/* Drag Handle & Order Controls */}
        {!isReadOnly && (
          <div className="flex flex-col items-center gap-1 pt-2">
            <div className="text-xs text-muted-foreground font-mono">
              {String(index + 1)?.padStart(2, '0')}
            </div>
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onMoveUp(index)}
                disabled={!canMoveUp}
                iconName="ChevronUp"
                iconSize={12}
                className="w-6 h-6 p-0"
              >
                <span className="sr-only">Mover para cima</span>
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onMoveDown(index)}
                disabled={!canMoveDown}
                iconName="ChevronDown"
                iconSize={12}
                className="w-6 h-6 p-0"
              >
                <span className="sr-only">Mover para baixo</span>
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Ingredient Selection */}
          <div className="lg:col-span-4">
            <Select
              label="Ingrediente"
              options={ingredientOptions}
              value={ingredient?.ingredientId}
              onChange={handleIngredientChange}
              searchable
              disabled={isReadOnly}
              error={!selectedIngredient && ingredient?.ingredientId ? 'Ingrediente não encontrado' : ''}
            />
          </div>

          {/* Quantity */}
          <div className="lg:col-span-2">
            <Input
              label="Quantidade"
              type="number"
              step="0.01"
              min="0"
              value={ingredient?.quantity}
              onChange={handleQuantityChange}
              disabled={isReadOnly}
              error={ingredient?.quantity <= 0 ? 'Quantidade deve ser maior que zero' : ''}
            />
          </div>

          {/* Unit */}
          <div className="lg:col-span-2">
            <Select
              label="Unidade"
              options={unitOptions}
              value={ingredient?.unit}
              onChange={handleUnitChange}
              disabled={isReadOnly}
            />
          </div>

          {/* Cost Information */}
          <div className="lg:col-span-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Custo</label>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  R$ {(selectedIngredient?.costPerUnit || 0)?.toFixed(2)}/{ingredient?.unit}
                </div>
                <div className="text-sm font-medium text-foreground">
                  Total: R$ {totalCost?.toFixed(2)}
                </div>
                {!isAvailable && ingredient?.ingredientId && (
                  <div className="flex items-center gap-1 text-xs text-warning">
                    <Icon name="AlertTriangle" size={12} />
                    <span>Estoque insuficiente</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {!isReadOnly && (
            <div className="lg:col-span-1 flex items-end justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                iconName="Trash2"
                iconSize={16}
                className="text-error hover:text-error hover:bg-error/10"
              >
                <span className="sr-only">Remover ingrediente</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Notes Section */}
      {(isEditing || ingredient?.notes) && (
        <div className="mt-4 pt-4 border-t border-border">
          <Input
            label="Observações"
            type="text"
            placeholder="Observações sobre este ingrediente..."
            value={ingredient?.notes || ''}
            onChange={handleNotesChange}
            disabled={isReadOnly}
          />
        </div>
      )}
      {/* Toggle Notes Button */}
      {!isReadOnly && !ingredient?.notes && (
        <div className="mt-3 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setIsEditing(!isEditing)}
            iconName="MessageSquare"
            iconPosition="left"
            iconSize={14}
          >
            {isEditing ? 'Cancelar observação' : 'Adicionar observação'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default IngredientRow;