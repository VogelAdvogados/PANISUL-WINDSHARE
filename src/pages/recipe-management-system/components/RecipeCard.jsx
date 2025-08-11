import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecipeCard = ({ recipe, isSelected, onSelect, onEdit, onDuplicate, onDelete, userRole }) => {
  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Pães Doces': 'bg-amber-100 text-amber-800',
      'Pães Salgados': 'bg-blue-100 text-blue-800',
      'Pães Integrais': 'bg-green-100 text-green-800',
      'Pães Especiais': 'bg-purple-100 text-purple-800',
      'Bolos': 'bg-pink-100 text-pink-800'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border bg-card hover:border-primary/50'
      }`}
      onClick={() => onSelect(recipe)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate mb-1">
            {recipe?.name}
          </h3>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(recipe?.category)}`}>
            {recipe?.category}
          </span>
        </div>
        <div className="flex items-center gap-1 ml-2">
          {recipe?.status === 'active' ? (
            <div className="w-2 h-2 bg-success rounded-full" title="Ativo" />
          ) : (
            <div className="w-2 h-2 bg-muted-foreground rounded-full" title="Inativo" />
          )}
        </div>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground mb-3">
        <div className="flex items-center gap-2">
          <Icon name="Users" size={14} />
          <span>{recipe?.yield} unidades</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Clock" size={14} />
          <span>{recipe?.prepTime} min</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="DollarSign" size={14} />
          <span>R$ {recipe?.costPerUnit?.toFixed(2)}/unidade</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Calendar" size={14} />
          <span>Modificado em {formatDate(recipe?.lastModified)}</span>
        </div>
      </div>
      {userRole !== 'production' && (
        <div className="flex items-center gap-1 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e?.stopPropagation();
              onEdit(recipe);
            }}
            iconName="Edit"
            iconSize={14}
            className="flex-1"
          >
            Editar
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e?.stopPropagation();
              onDuplicate(recipe);
            }}
            iconName="Copy"
            iconSize={14}
            className="flex-1"
          >
            Duplicar
          </Button>
          {userRole === 'admin' && (
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e?.stopPropagation();
                onDelete(recipe);
              }}
              iconName="Trash2"
              iconSize={14}
              className="text-error hover:text-error hover:bg-error/10"
            >
              <span className="sr-only">Excluir</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeCard;