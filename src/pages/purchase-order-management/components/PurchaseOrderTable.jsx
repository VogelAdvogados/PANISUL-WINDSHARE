import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PurchaseOrderTable = ({ orders, selectedOrder, onOrderSelect, onCreateOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'draft', label: 'Rascunho' },
    { value: 'pending', label: 'Pendente' },
    { value: 'approved', label: 'Aprovado' },
    { value: 'sent', label: 'Enviado' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const sortOptions = [
    { value: 'orderDate', label: 'Data do Pedido' },
    { value: 'poNumber', label: 'Número PO' },
    { value: 'supplier', label: 'Fornecedor' },
    { value: 'total', label: 'Valor Total' },
    { value: 'deliveryDate', label: 'Data de Entrega' }
  ];

  const filteredAndSortedOrders = orders?.filter(order => {
      const matchesSearch = order?.poNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           order?.supplier?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order?.status === statusFilter;
      return matchesSearch && matchesStatus;
    })?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];

      if (sortBy === 'total') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortBy === 'orderDate' || sortBy === 'deliveryDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'pending': return 'bg-warning/10 text-warning';
      case 'approved': return 'bg-success/10 text-success';
      case 'sent': return 'bg-primary/10 text-primary';
      case 'delivered': return 'bg-success/20 text-success';
      case 'cancelled': return 'bg-error/10 text-error';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Rascunho',
      pending: 'Pendente',
      approved: 'Aprovado',
      sent: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return labels?.[status] || status;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR');
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Pedidos de Compra</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" iconName="Download" iconSize={16}>
              Exportar
            </Button>
            <Button variant="default" size="sm" iconName="Plus" iconSize={16} onClick={onCreateOrder}>
              Novo Pedido
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar por número PO ou fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          <div className="w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Status"
            />
          </div>
          <div className="w-48">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Ordenar por"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-foreground">{orders?.filter(o => o?.status === 'pending')?.length}</div>
            <div className="text-muted-foreground">Pendentes</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{orders?.filter(o => o?.status === 'approved')?.length}</div>
            <div className="text-muted-foreground">Aprovados</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{orders?.filter(o => o?.status === 'sent')?.length}</div>
            <div className="text-muted-foreground">Enviados</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">
              {formatCurrency(orders?.reduce((sum, o) => sum + parseFloat(o?.total), 0))}
            </div>
            <div className="text-muted-foreground">Total</div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-muted/50 border-b border-border">
            <tr>
              <th
                className="text-left p-3 font-medium text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('poNumber')}
              >
                <div className="flex items-center gap-2">
                  Número PO
                  <Icon
                    name={sortBy === 'poNumber' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                    size={14}
                  />
                </div>
              </th>
              <th
                className="text-left p-3 font-medium text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('supplier')}
              >
                <div className="flex items-center gap-2">
                  Fornecedor
                  <Icon
                    name={sortBy === 'supplier' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                    size={14}
                  />
                </div>
              </th>
              <th
                className="text-left p-3 font-medium text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('orderDate')}
              >
                <div className="flex items-center gap-2">
                  Data Pedido
                  <Icon
                    name={sortBy === 'orderDate' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                    size={14}
                  />
                </div>
              </th>
              <th
                className="text-left p-3 font-medium text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('deliveryDate')}
              >
                <div className="flex items-center gap-2">
                  Entrega Prevista
                  <Icon
                    name={sortBy === 'deliveryDate' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                    size={14}
                  />
                </div>
              </th>
              <th className="text-left p-3 font-medium text-foreground">Status</th>
              <th
                className="text-right p-3 font-medium text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('total')}
              >
                <div className="flex items-center justify-end gap-2">
                  Valor Total
                  <Icon
                    name={sortBy === 'total' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                    size={14}
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOrders?.map((order) => (
              <tr
                key={order?.id}
                onClick={() => onOrderSelect(order)}
                className={`cursor-pointer transition-colors hover:bg-muted/30 ${
                  selectedOrder?.id === order?.id ? 'bg-primary/5' : ''
                }`}
              >
                <td className="p-3">
                  <div className="font-medium text-foreground">{order?.poNumber}</div>
                  <div className="text-sm text-muted-foreground">{order?.items} itens</div>
                </td>
                <td className="p-3">
                  <div className="font-medium text-foreground">{order?.supplier}</div>
                  <div className="text-sm text-muted-foreground">{order?.supplierContact}</div>
                </td>
                <td className="p-3 text-foreground">{formatDate(order?.orderDate)}</td>
                <td className="p-3 text-foreground">{formatDate(order?.deliveryDate)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order?.status)}`}>
                    {getStatusLabel(order?.status)}
                  </span>
                </td>
                <td className="p-3 text-right font-medium text-foreground">
                  {formatCurrency(order?.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedOrders?.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderTable;