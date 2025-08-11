import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import IngredientRow from './IngredientRow';

const RecipeForm = ({
  recipe,
  availableIngredients,
  onSave,
  onCancel,
  userRole,
  isNew = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    yield: 1,
    prepTime: 30,
    cookTime: 0,
    totalTime: 30,
    difficulty: 'medium',
    status: 'active',
    ingredients: [],
    instructions: '',
    notes: '',
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (recipe) {
      setFormData(recipe);
    }
  }, [recipe]);

  const categoryOptions = [
    { value: 'Pães Doces', label: 'Pães Doces' },
    { value: 'Pães Salgados', label: 'Pães Salgados' },
    { value: 'Pães Integrais', label: 'Pães Integrais' },
    { value: 'Pães Especiais', label: 'Pães Especiais' },
    { value: 'Bolos', label: 'Bolos' }
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Fácil' },
    { value: 'medium', label: 'Médio' },
    { value: 'hard', label: 'Difícil' }
  ];

  const isReadOnly = userRole === 'production';

  const calculateTotalCost = () => {
    return formData?.ingredients?.reduce((total, ingredient) => {
      const ingredientData = availableIngredients?.find(ing => ing?.id === ingredient?.ingredientId);
      return total + (ingredient?.quantity * (ingredientData?.costPerUnit || 0));
    }, 0);
  };

  const calculateCostPerUnit = () => {
    const totalCost = calculateTotalCost();
    return formData?.yield > 0 ? totalCost / formData?.yield : 0;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Nome da receita é obrigatório';
    }

    if (!formData?.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (formData?.yield <= 0) {
      newErrors.yield = 'Rendimento deve ser maior que zero';
    }

    if (formData?.ingredients?.length === 0) {
      newErrors.ingredients = 'Pelo menos um ingrediente é obrigatório';
    }

    formData?.ingredients?.forEach((ingredient, index) => {
      if (!ingredient?.ingredientId) {
        newErrors[`ingredient_${index}`] = 'Ingrediente deve ser selecionado';
      }
      if (ingredient?.quantity <= 0) {
        newErrors[`quantity_${index}`] = 'Quantidade deve ser maior que zero';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);

    // Clear specific field error
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleIngredientUpdate = (index, updatedIngredient) => {
    const newIngredients = [...formData?.ingredients];
    newIngredients[index] = updatedIngredient;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
    setIsDirty(true);
  };

  const handleAddIngredient = () => {
    const newIngredient = {
      id: Date.now(),
      ingredientId: '',
      quantity: 0,
      unit: 'g',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev?.ingredients, newIngredient]
    }));
    setIsDirty(true);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = formData?.ingredients?.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
    setIsDirty(true);
  };

  const handleMoveIngredient = (index, direction) => {
    const newIngredients = [...formData?.ingredients];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newIngredients?.length) {
      [newIngredients[index], newIngredients[targetIndex]] =
      [newIngredients?.[targetIndex], newIngredients?.[index]];

      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
      setIsDirty(true);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    const recipeData = {
      ...formData,
      totalCost: calculateTotalCost(),
      costPerUnit: calculateCostPerUnit(),
      lastModified: new Date()?.toISOString(),
      modifiedBy: userRole === 'admin' ? 'Admin User' : 'Manager User'
    };

    onSave(recipeData);
  };

  const totalCost = calculateTotalCost();
  const costPerUnit = calculateCostPerUnit();

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {isNew ? 'Nova Receita' : `Editando: ${formData?.name}`}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isReadOnly ? 'Visualização apenas' : 'Preencha os dados da receita'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isDirty && !isReadOnly && (
              <div className="flex items-center gap-2 text-sm text-warning">
                <Icon name="AlertCircle" size={16} />
                <span>Alterações não salvas</span>
              </div>
            )}
            <Button
              variant="outline"
              onClick={onCancel}
              iconName="X"
              iconPosition="left"
              iconSize={16}
            >
              {isReadOnly ? 'Fechar' : 'Cancelar'}
            </Button>
            {!isReadOnly && (
              <Button
                variant="default"
                onClick={handleSubmit}
                iconName="Save"
                iconPosition="left"
                iconSize={16}
                disabled={!isDirty}
              >
                Salvar Receita
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <Input
                  label="Nome da Receita"
                  type="text"
                  value={formData?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  placeholder="Ex: Pão Francês Tradicional"
                  required
                  disabled={isReadOnly}
                  error={errors?.name}
                />
              </div>
              <div className="lg:col-span-2">
                <Input
                  label="Descrição"
                  type="text"
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                  placeholder="Breve descrição da receita..."
                  disabled={isReadOnly}
                />
              </div>
              <Select
                label="Categoria"
                options={categoryOptions}
                value={formData?.category}
                onChange={(value) => handleInputChange('category', value)}
                disabled={isReadOnly}
                error={errors?.category}
                required
              />
              <Select
                label="Dificuldade"
                options={difficultyOptions}
                value={formData?.difficulty}
                onChange={(value) => handleInputChange('difficulty', value)}
                disabled={isReadOnly}
              />
              <Input
                label="Rendimento (unidades)"
                type="number"
                min="1"
                value={formData?.yield}
                onChange={(e) => handleInputChange('yield', parseInt(e?.target?.value) || 1)}
                disabled={isReadOnly}
                error={errors?.yield}
                required
              />
              <Input
                label="Tempo de Preparo (min)"
                type="number"
                min="0"
                value={formData?.prepTime}
                onChange={(e) => handleInputChange('prepTime', parseInt(e?.target?.value) || 0)}
                disabled={isReadOnly}
              />
              <Input
                label="Tempo de Cozimento (min)"
                type="number"
                min="0"
                value={formData?.cookTime}
                onChange={(e) => handleInputChange('cookTime', parseInt(e?.target?.value) || 0)}
                disabled={isReadOnly}
              />
              <div className="flex items-center">
                <Checkbox
                  label="Receita Ativa"
                  checked={formData?.status === 'active'}
                  onChange={(e) => handleInputChange('status', e?.target?.checked ? 'active' : 'inactive')}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Ingredientes</h3>
              {!isReadOnly && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddIngredient}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Adicionar Ingrediente
                </Button>
              )}
            </div>

            {errors?.ingredients && (
              <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                <div className="flex items-center gap-2 text-error text-sm">
                  <Icon name="AlertCircle" size={16} />
                  <span>{errors?.ingredients}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {formData?.ingredients?.map((ingredient, index) => (
                <IngredientRow
                  key={ingredient?.id || index}
                  ingredient={ingredient}
                  index={index}
                  availableIngredients={availableIngredients}
                  onUpdate={handleIngredientUpdate}
                  onRemove={handleRemoveIngredient}
                  onMoveUp={() => handleMoveIngredient(index, 'up')}
                  onMoveDown={() => handleMoveIngredient(index, 'down')}
                  canMoveUp={index > 0}
                  canMoveDown={index < formData?.ingredients?.length - 1}
                  isReadOnly={isReadOnly}
                />
              ))}

              {formData?.ingredients?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Package" size={48} className="mx-auto mb-4" />
                  <p className="mb-2">Nenhum ingrediente adicionado</p>
                  {!isReadOnly && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddIngredient}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Adicionar primeiro ingrediente
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Análise de Custos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">R$ {totalCost?.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Custo Total</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">R$ {costPerUnit?.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Custo por Unidade</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{formData?.yield}</div>
                <div className="text-sm text-muted-foreground">Rendimento</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Modo de Preparo</h3>
            <textarea
              className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Descreva o passo a passo do preparo..."
              value={formData?.instructions}
              onChange={(e) => handleInputChange('instructions', e?.target?.value)}
              disabled={isReadOnly}
            />
          </div>

          {/* Notes */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Observações</h3>
            <textarea
              className="w-full h-24 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Observações adicionais, dicas ou variações..."
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              disabled={isReadOnly}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;