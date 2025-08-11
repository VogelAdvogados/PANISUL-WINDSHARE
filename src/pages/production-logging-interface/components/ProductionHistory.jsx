import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductionHistory = ({ isVisible, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Mock production history data
  const productionHistory = [
    {
      id: 'PROD-240804-001',
      recipeName: 'Pão Francês',
      quantity: 100,
      batchNumber: 'LT-240804-001',
      productionDate: '2025-08-04',
      productionTime: '06:30',
      operator: 'João Silva',
      status: 'completed',
      wasteAmount: 2,
      qualityNotes: 'Textura perfeita, cor dourada ideal',
      timestamp: '2025-08-04T06:30:00Z'
    },
    {
      id: 'PROD-240804-002',
      recipeName: 'Pão de Forma',
      quantity: 50,
      batchNumber: 'LT-240804-002',
      productionDate: '2025-08-04',
      productionTime: '08:15',
      operator: 'Maria Santos',
      status: 'completed',
      wasteAmount: 0,
      qualityNotes: 'Produção sem intercorrências',
      timestamp: '2025-08-04T08:15:00Z'
    },
    {
      id: 'PROD-240804-003',
      recipeName: 'Croissant',
      quantity: 75,
      batchNumber: 'LT-240804-003',
      productionDate: '2025-08-04',
      productionTime: '10:00',
      operator: 'Carlos Oliveira',
      status: 'in-progress',
      wasteAmount: 0,
      qualityNotes: '',
      timestamp: '2025-08-04T10:00:00Z'
    },
    {
      id: 'PROD-240803-015',
      recipeName: 'Pão Doce',
      quantity: 60,
      batchNumber: 'LT-240803-015',
      productionDate: '2025-08-03',
      productionTime: '14:30',
      operator: 'Ana Costa',
      status: 'completed',
      wasteAmount: 3,
      qualityNotes: 'Leve ressecamento na superfície',
      timestamp: '2025-08-03T14:30:00Z'
    },
    {
      id: 'PROD-240803-014',
      recipeName: 'Baguete',
      quantity: 40,
      batchNumber: 'LT-240803-014',
      productionDate: '2025-08-03',
      productionTime: '12:00',
      operator: 'Pedro Lima',
      status: 'completed',
      wasteAmount: 1,
      qualityNotes: 'Crocância excelente',
      timestamp: '2025-08-03T12:00:00Z'
    }
  ];

  const filteredHistory = productionHistory?.filter(item => {
    const matchesSearch = !searchTerm ||
      item?.recipeName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      item?.batchNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      item?.operator?.toLowerCase()?.includes(searchTerm?.toLowerCase());

    const matchesDate = !filterDate || item?.productionDate === filterDate;

    return matchesSearch && matchesDate;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'in-progress':
        return { icon: 'Clock', color: 'text-warning' };
      case 'cancelled':
        return { icon: 'XCircle', color: 'text-error' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in-progress':
        return 'Em Andamento';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj?.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          className="fab"
          iconName="History"
          size="icon"
        >
          <span className="sr-only">Ver histórico de produção</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="History" size={24} className="text-primary" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Histórico de Produção</h2>
                <p className="text-muted-foreground">Registros de produções anteriores</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              iconName="X"
            >
              <span className="sr-only">Fechar histórico</span>
            </Button>
          </div>

          {/* Filters */}
          <div className="mt-4 flex gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Buscar por receita, lote ou operador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
            </div>
            <div className="w-48">
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e?.target?.value)}
                placeholder="Filtrar por data"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterDate('');
              }}
              iconName="RotateCcw"
            >
              Limpar
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredHistory?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum registro encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou verifique se há produções registradas.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory?.map((item) => {
                const statusInfo = getStatusIcon(item?.status);

                return (
                  <div
                    key={item?.id}
                    className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon name={statusInfo?.icon} size={20} className={statusInfo?.color} />
                        <div>
                          <h3 className="font-medium text-foreground">{item?.recipeName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Lote: {item?.batchNumber} • {item?.quantity} unidades
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          item?.status === 'completed' ? 'bg-success/10 text-success' :
                          item?.status === 'in-progress'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                        }`}>
                          {getStatusLabel(item?.status)}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Icon name="Calendar" size={14} />
                          <span>Data e Hora</span>
                        </div>
                        <p className="text-foreground font-medium">
                          {formatDateTime(item?.productionDate, item?.productionTime)}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Icon name="User" size={14} />
                          <span>Operador</span>
                        </div>
                        <p className="text-foreground font-medium">{item?.operator}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Icon name="Trash2" size={14} />
                          <span>Desperdício</span>
                        </div>
                        <p className="text-foreground font-medium">
                          {item?.wasteAmount > 0 ? `${item?.wasteAmount} unidades` : 'Nenhum'}
                        </p>
                      </div>
                    </div>
                    {item?.qualityNotes && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-start gap-2">
                          <Icon name="FileText" size={14} className="text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Notas de Qualidade:</p>
                            <p className="text-sm text-foreground">{item?.qualityNotes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total de registros: {filteredHistory?.length}</span>
            <div className="flex gap-4">
              <Button variant="outline" size="sm" iconName="Download">
                Exportar
              </Button>
              <Button variant="outline" size="sm" iconName="Printer">
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionHistory;