import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InventoryFilters = ({ onFiltersChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [expirationFilter, setExpirationFilter] = useState('');

  const categoryOptions = [
    { value: '', label: 'Todas as Categorias' },
    { value: 'farinhas', label: 'Farinhas' },
    { value: 'acucares', label: 'Açúcares' },
    { value: 'gorduras', label: 'Gorduras' },
    { value: 'fermentos', label: 'Fermentos' },
    { value: 'aditivos', label: 'Aditivos' },
    { value: 'frutas', label: 'Frutas e Recheios' },
    { value: 'embalagens', label: 'Embalagens' }
  ];

  const supplierOptions = [
    { value: '', label: 'Todos os Fornecedores' },
    { value: 'moinho-sul', label: 'Moinho Sul Ltda' },
    { value: 'distribuidora-abc', label: 'Distribuidora ABC' },
    { value: 'ingredientes-premium', label: 'Ingredientes Premium' },
    { value: 'fornecedor-local', label: 'Fornecedor Local' },
    { value: 'atacado-brasil', label: 'Atacado Brasil' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'adequate', label: 'Estoque Adequado' },
    { value: 'low', label: 'Estoque Baixo' },
    { value: 'critical', label: 'Estoque Crítico' },
    { value: 'out', label: 'Sem Estoque' }
  ];

  const expirationOptions = [
    { value: '', label: 'Todos os Prazos' },
    { value: '7days', label: 'Vence em 7 dias' },
    { value: '15days', label: 'Vence em 15 dias' },
    { value: '30days', label: 'Vence em 30 dias' },
    { value: 'expired', label: 'Vencidos' }
  ];

  const savedFilters = [
    { id: 1, name: 'Estoque Crítico', filters: { status: 'critical' } },
    { id: 2, name: 'Farinhas Baixas', filters: { category: 'farinhas', status: 'low' } },
    { id: 3, name: 'Vencendo Esta Semana', filters: { expiration: '7days' } },
    { id: 4, name: 'Fornecedor ABC', filters: { supplier: 'distribuidora-abc' } }
  ];

  const handleApplyFilters = () => {
    const filters = {
      search: searchTerm,
      category: selectedCategory,
      supplier: selectedSupplier,
      status: selectedStatus,
      expiration: expirationFilter
    };
    onFiltersChange(filters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSupplier('');
    setSelectedStatus('');
    setExpirationFilter('');
    onFiltersChange({});
  };

  const applySavedFilter = (savedFilter) => {
    const { filters } = savedFilter;
    setSelectedCategory(filters?.category || '');
    setSelectedSupplier(filters?.supplier || '');
    setSelectedStatus(filters?.status || '');
    setExpirationFilter(filters?.expiration || '');
    onFiltersChange(filters);
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Filtros Avançados</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {isExpanded ? 'Recolher' : 'Expandir'}
        </Button>
      </div>
      {/* Search Bar - Always Visible */}
      <div className="p-4 border-b border-border">
        <Input
          type="search"
          placeholder="Buscar ingredientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Categoria"
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />

            <Select
              label="Fornecedor"
              options={supplierOptions}
              value={selectedSupplier}
              onChange={setSelectedSupplier}
              searchable
            />

            <Select
              label="Status do Estoque"
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
            />

            <Select
              label="Prazo de Validade"
              options={expirationOptions}
              value={expirationFilter}
              onChange={setExpirationFilter}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              variant="default"
              onClick={handleApplyFilters}
              iconName="Search"
              iconPosition="left"
            >
              Aplicar Filtros
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Limpar
            </Button>
          </div>

          {/* Saved Filters */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Filtros Salvos</h4>
            <div className="flex flex-wrap gap-2">
              {savedFilters?.map((filter) => (
                <Button
                  key={filter?.id}
                  variant="secondary"
                  size="sm"
                  onClick={() => applySavedFilter(filter)}
                  className="text-xs"
                >
                  {filter?.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryFilters;