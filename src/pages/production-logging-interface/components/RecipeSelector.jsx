import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';

const RecipeSelector = ({ recipes, selectedRecipe, onRecipeSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = useMemo(() => {
    if (!searchTerm) return recipes;
    return recipes?.filter(recipe =>
      recipe?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      recipe?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  }, [recipes, searchTerm]);

  const getRecipeImage = (recipe) => {
    const imageMap = {
      'Pão Francês': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
      'Pão de Forma': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300&h=200&fit=crop',
      'Pão Doce': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      'Pão Integral': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300&h=200&fit=crop',
      'Croissant': 'https://images.unsplash.com/photo-1555507036-ab794f4ade6a?w=300&h=200&fit=crop',
      'Baguete': 'https://images.unsplash.com/photo-1534620808146-d33bb39128b2?w=300&h=200&fit=crop'
    };
    return imageMap?.[recipe?.name] || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop';
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">Receitas Disponíveis</h2>
        <Input
          type="search"
          placeholder="Buscar receitas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Recipe List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {filteredRecipes?.map((recipe) => (
            <div
              key={recipe?.id}
              onClick={() => onRecipeSelect(recipe)}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedRecipe?.id === recipe?.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex gap-3">
                {/* Recipe Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={getRecipeImage(recipe)}
                    alt={recipe?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Recipe Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-foreground truncate">{recipe?.name}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full flex-shrink-0 ml-2">
                      {recipe?.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      <span>{recipe?.prepTime}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Package" size={14} />
                      <span>{recipe?.yield} unidades</span>
                    </div>
                  </div>

                  {/* Ingredient Count */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="List" size={12} />
                    <span>{recipe?.ingredients?.length} ingredientes</span>
                  </div>
                </div>
              </div>

              {/* Selected Recipe Indicator */}
              {selectedRecipe?.id === recipe?.id && (
                <div className="mt-2 pt-2 border-t border-primary/20">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Icon name="CheckCircle" size={16} />
                    <span className="font-medium">Receita Selecionada</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredRecipes?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma receita encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar os termos de busca ou verifique se há receitas cadastradas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeSelector;