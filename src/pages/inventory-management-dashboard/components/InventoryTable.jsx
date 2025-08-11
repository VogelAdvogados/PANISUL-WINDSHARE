import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const InventoryTable = ({ filters = {} }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const inventoryData = [
    {
      id: 1,
      name: "Farinha de Trigo Especial",
      category: "farinhas",
      currentStock: 45.5,
      unit: "kg",
      reorderLevel: 20,
      supplier: "Moinho Sul Ltda",
      lastPurchase: "2025-01-28",
      expirationDate: "2025-04-15",
      costPerUnit: 3.85,
      status: "adequate",
      location: "Estoque A-1"
    },
    {
      id: 2,
      name: "Açúcar Cristal",
      category: "acucares",
      currentStock: 8.2,
      unit: "kg",
      reorderLevel: 15,
      supplier: "Distribuidora ABC",
      lastPurchase: "2025-01-25",
      expirationDate: "2025-12-31",
      costPerUnit: 4.20,
      status: "low",
      location: "Estoque B-2"
    },
    {
      id: 3,
      name: "Fermento Biológico Seco",
      category: "fermentos",
      currentStock: 0,
      unit: "kg",
      reorderLevel: 2,
      supplier: "Ingredientes Premium",
      lastPurchase: "2025-01-20",
      expirationDate: "2025-08-10",
      costPerUnit: 28.50,
      status: "out",
      location: "Estoque C-1"
    },
    {
      id: 4,
      name: "Manteiga sem Sal",
      category: "gorduras",
      currentStock: 12.8,
      unit: "kg",
      reorderLevel: 10,
      supplier: "Fornecedor Local",
      lastPurchase: "2025-02-01",
      expirationDate: "2025-02-15",
      costPerUnit: 18.90,
      status: "adequate",
      location: "Geladeira A"
    },
    {
      id: 5,
      name: "Chocolate em Pó",
      category: "aditivos",
      currentStock: 3.1,
      unit: "kg",
      reorderLevel: 5,
      supplier: "Atacado Brasil",
      lastPurchase: "2025-01-30",
      expirationDate: "2025-06-20",
      costPerUnit: 15.75,
      status: "critical",
      location: "Estoque B-1"
    },
    {
      id: 6,
      name: "Ovos Frescos",
      category: "proteinas",
      currentStock: 180,
      unit: "unidades",
      reorderLevel: 60,
      supplier: "Granja São João",
      lastPurchase: "2025-02-03",
      expirationDate: "2025-02-10",
      costPerUnit: 0.45,
      status: "adequate",
      location: "Geladeira B"
    },
    {
      id: 7,
      name: "Leite Integral",
      category: "laticinios",
      currentStock: 25.5,
      unit: "litros",
      reorderLevel: 20,
      supplier: "Laticínios Vale Verde",
      lastPurchase: "2025-02-02",
      expirationDate: "2025-02-08",
      costPerUnit: 3.20,
      status: "adequate",
      location: "Geladeira C"
    },
    {
      id: 8,
      name: "Sal Refinado",
      category: "temperos",
      currentStock: 15.0,
      unit: "kg",
      reorderLevel: 5,
      supplier: "Distribuidora ABC",
      lastPurchase: "2025-01-15",
      expirationDate: "2026-01-15",
      costPerUnit: 2.10,
      status: "adequate",
      location: "Estoque A-2"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'adequate':
        return 'bg-success/10 text-success';
      case 'low':
        return 'bg-warning/10 text-warning';
      case 'critical':
        return 'bg-error/10 text-error';
      case 'out':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'adequate':
        return 'Adequado';
      case 'low':
        return 'Baixo';
      case 'critical':
        return 'Crítico';
      case 'out':
        return 'Sem Estoque';
      default:
        return 'Desconhecido';
    }
  };

  const isExpiringSoon = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const filteredData = useMemo(() => {
    return inventoryData?.filter(item => {
      if (filters?.search && !item?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
        return false;
      }
      if (filters?.category && item?.category !== filters?.category) {
        return false;
      }
      if (filters?.supplier && item?.supplier !== filters?.supplier) {
        return false;
      }
      if (filters?.status && item?.status !== filters?.status) {
        return false;
      }
      if (filters?.expiration) {
        const today = new Date();
        const expDate = new Date(item.expirationDate);
        const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

        switch (filters?.expiration) {
          case '7days':
            return diffDays <= 7 && diffDays > 0;
          case '15days':
            return diffDays <= 15 && diffDays > 0;
          case '30days':
            return diffDays <= 30 && diffDays > 0;
          case 'expired':
            return diffDays <= 0;
          default:
            return true;
        }
      }
      return true;
    });
  }, [filters]);

  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig?.key) {
      sortableData?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const newSelection = prev?.includes(itemId)
        ? prev?.filter(id => id !== itemId)
        : [...prev, itemId];
      setShowBulkActions(newSelection?.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems?.length === sortedData?.length) {
      setSelectedItems([]);
      setShowBulkActions(false);
    } else {
      setSelectedItems(sortedData?.map(item => item?.id));
      setShowBulkActions(true);
    }
  };

  const SortableHeader = ({ label, sortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {label}
        <div className="flex flex-col">
          <Icon
            name="ChevronUp"
            size={12}
            className={`${sortConfig?.key === sortKey && sortConfig?.direction === 'asc' ? 'text-primary' : 'text-muted-foreground/50'}`}
          />
          <Icon
            name="ChevronDown"
            size={12}
            className={`${sortConfig?.key === sortKey && sortConfig?.direction === 'desc' ? 'text-primary' : 'text-muted-foreground/50'} -mt-1`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-primary/5 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {selectedItems?.length} itens selecionados
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" iconName="Edit">
                Editar em Lote
              </Button>
              <Button variant="outline" size="sm" iconName="ShoppingCart">
                Criar Pedido
              </Button>
              <Button variant="outline" size="sm" iconName="Download">
                Exportar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 w-12">
                <Checkbox
                  checked={selectedItems?.length === sortedData?.length && sortedData?.length > 0}
                  onChange={handleSelectAll}
                  indeterminate={selectedItems?.length > 0 && selectedItems?.length < sortedData?.length}
                />
              </th>
              <SortableHeader label="Ingrediente" sortKey="name" />
              <SortableHeader label="Estoque Atual" sortKey="currentStock" />
              <SortableHeader label="Ponto de Reposição" sortKey="reorderLevel" />
              <SortableHeader label="Status" sortKey="status" />
              <SortableHeader label="Fornecedor" sortKey="supplier" />
              <SortableHeader label="Última Compra" sortKey="lastPurchase" />
              <SortableHeader label="Validade" sortKey="expirationDate" />
              <SortableHeader label="Custo/Unidade" sortKey="costPerUnit" />
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedData?.map((item) => (
              <tr
                key={item?.id}
                className={`hover:bg-muted/30 transition-colors ${
                  item?.status === 'out' ? 'bg-error/5' :
                  item?.status === 'critical'? 'bg-warning/5' : isExpiringSoon(item?.expirationDate) ?'bg-warning/5' : ''
                }`}
              >
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedItems?.includes(item?.id)}
                    onChange={() => handleSelectItem(item?.id)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{item?.name}</span>
                    <span className="text-xs text-muted-foreground">{item?.location}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {item?.currentStock?.toLocaleString('pt-BR')} {item?.unit}
                    </span>
                    {item?.status === 'out' && (
                      <span className="text-xs text-error font-medium">Sem estoque</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">
                    {item?.reorderLevel} {item?.unit}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item?.status)}`}>
                    {getStatusText(item?.status)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">{item?.supplier}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">
                    {new Date(item.lastPurchase)?.toLocaleDateString('pt-BR')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className={`text-sm ${isExpiringSoon(item?.expirationDate) ? 'text-warning font-medium' : 'text-foreground'}`}>
                      {new Date(item.expirationDate)?.toLocaleDateString('pt-BR')}
                    </span>
                    {isExpiringSoon(item?.expirationDate) && (
                      <span className="text-xs text-warning">Vence em breve</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-foreground">
                    R$ {item?.costPerUnit?.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ShoppingCart"
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreHorizontal"
                      className="h-8 w-8 p-0"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Empty State */}
      {sortedData?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum ingrediente encontrado</h3>
          <p className="text-muted-foreground">Tente ajustar os filtros ou adicionar novos ingredientes ao estoque.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;