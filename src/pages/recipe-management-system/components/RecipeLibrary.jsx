import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import RecipeCard from './RecipeCard';

const RecipeLibrary = ({
  recipes,
  selectedRecipe,
  onSelectRecipe,
  onCreateNew,
  onEditRecipe,
  onDuplicateRecipe,
  onDeleteRecipe,
  userRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const categoryOptions = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'Pães Doces', label: 'Pães Doces' },
    { value: 'Pães Salgados', label: 'Pães Salgados' },
    { value: 'Pães Integrais', label: 'Pães Integrais' },
    { value: 'Pães Especiais', label: 'Pães Especiais' },
    { value: 'Bolos', label: 'Bolos' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' }
  ];

  const filteredRecipes = recipes?.filter(recipe => {
    const matchesSearch = recipe?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         recipe?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || recipe?.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || recipe?.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getRecipeCount = () => {
    const total = recipes?.length;
    const active = recipes?.filter(r => r?.status === 'active')?.length;
    return { total, active };
  };

  const { total, active } = getRecipeCount();

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Biblioteca de Receitas</h2>
            <p className="text-sm text-muted-foreground">
              {total} receitas ({active} ativas)
            </p>
          </div>
          {userRole !== 'production' && (
            <Button
              variant="default"
              size="sm"
              onClick={onCreateNew}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Nova
            </Button>
          )}
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Buscar receitas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="mb-3"
        />

        {/* Filters */}
        <div className="space-y-2">
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Filtrar por categoria"
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filtrar por status"
          />
        </div>
      </div>
      {/* Recipe List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredRecipes?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' ?'Nenhuma receita encontrada com os filtros aplicados' :'Nenhuma receita cadastrada'
              }
            </p>
            {userRole !== 'production' && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCreateNew}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Criar primeira receita
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecipes?.map((recipe) => (
              <RecipeCard
                key={recipe?.id}
                recipe={recipe}
                isSelected={selectedRecipe?.id === recipe?.id}
                onSelect={onSelectRecipe}
                onEdit={onEditRecipe}
                onDuplicate={onDuplicateRecipe}
                onDelete={onDeleteRecipe}
                userRole={userRole}
              />
            ))}
          </div>
        )}
      </div>
      {/* Quick Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">{active}</div>
            <div className="text-xs text-muted-foreground">Receitas Ativas</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              R$ {(filteredRecipes?.reduce((sum, r) => sum + r?.costPerUnit, 0) / filteredRecipes?.length || 0)?.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Custo Médio</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeLibrary;