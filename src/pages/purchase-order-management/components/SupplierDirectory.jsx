import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SupplierDirectory = ({ suppliers, selectedSupplier, onSupplierSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredSuppliers = suppliers?.filter(supplier => {
    const matchesSearch = supplier?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         supplier?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesCategory = filterCategory === 'all' || supplier?.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getPerformanceColor = (rating) => {
    if (rating >= 4.5) return 'text-success';
    if (rating >= 3.5) return 'text-warning';
    return 'text-error';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'pending': return 'bg-warning/10 text-warning';
      case 'inactive': return 'bg-error/10 text-error';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Fornecedores</h2>
          <Button variant="outline" size="sm" iconName="Plus" iconSize={16}>
            Novo
          </Button>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Buscar fornecedores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="mb-3"
        />

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'farinha', 'laticínios', 'açúcar', 'fermento', 'outros']?.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filterCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category === 'all' ? 'Todos' : category?.charAt(0)?.toUpperCase() + category?.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {/* Suppliers List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSuppliers?.map((supplier) => (
          <div
            key={supplier?.id}
            onClick={() => onSupplierSelect(supplier)}
            className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
              selectedSupplier?.id === supplier?.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{supplier?.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{supplier?.category}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(supplier?.status)}`}>
                {supplier?.status === 'active' ? 'Ativo' :
                 supplier?.status === 'pending' ? 'Pendente' : 'Inativo'}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Icon name="Star" size={14} className={getPerformanceColor(supplier?.rating)} />
                <span className={getPerformanceColor(supplier?.rating)}>{supplier?.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>{supplier?.deliveryTime} dias</span>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Icon name="Phone" size={12} />
                <span>{supplier?.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="MapPin" size={12} />
                <span>{supplier?.location}</span>
              </div>
            </div>

            {supplier?.paymentTerms && (
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="font-medium">Pagamento:</span> {supplier?.paymentTerms}
              </div>
            )}
          </div>
        ))}

        {filteredSuppliers?.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum fornecedor encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDirectory;