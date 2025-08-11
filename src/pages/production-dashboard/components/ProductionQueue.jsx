import React from 'react';
import Icon from '../../../components/AppIcon';

const ProductionQueue = () => {
  const productionQueue = [
    {
      id: 1,
      batchNumber: "B2025-001",
      breadType: "Pão Francês",
      quantity: 200,
      status: "pending",
      startTime: "08:00",
      estimatedCompletion: "10:30",
      priority: "high"
    },
    {
      id: 2,
      batchNumber: "B2025-002",
      breadType: "Pão Integral",
      quantity: 150,
      status: "in-progress",
      startTime: "09:00",
      estimatedCompletion: "11:45",
      priority: "medium",
      progress: 65
    },
    {
      id: 3,
      batchNumber: "B2025-003",
      breadType: "Pão de Forma",
      quantity: 100,
      status: "completed",
      startTime: "06:00",
      completedTime: "08:15",
      priority: "low"
    },
    {
      id: 4,
      batchNumber: "B2025-004",
      breadType: "Baguete",
      quantity: 80,
      status: "pending",
      startTime: "11:00",
      estimatedCompletion: "13:30",
      priority: "medium"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'Clock';
      case 'in-progress':
        return 'Play';
      case 'completed':
        return 'CheckCircle';
      default:
        return 'Circle';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Fila de Produção</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span>Hoje, 04 Ago 2025</span>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {productionQueue?.map((batch) => (
          <div
            key={batch?.id}
            className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-muted-foreground">
                  {batch?.batchNumber}
                </span>
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(batch?.priority)}`} />
              </div>
              <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(batch?.status)}`}>
                <div className="flex items-center gap-1">
                  <Icon name={getStatusIcon(batch?.status)} size={12} />
                  <span className="capitalize">
                    {batch?.status === 'in-progress' ? 'Em Andamento' :
                     batch?.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="font-medium text-foreground mb-1">{batch?.breadType}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Quantidade: {batch?.quantity} unidades
            </p>

            {batch?.status === 'in-progress' && batch?.progress && (
              <div className="mb-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progresso</span>
                  <span>{batch?.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${batch?.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={12} />
                <span>Início: {batch?.startTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Target" size={12} />
                <span>
                  {batch?.status === 'completed'
                    ? `Concluído: ${batch?.completedTime}`
                    : `Previsão: ${batch?.estimatedCompletion}`
                  }
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total de lotes hoje:</span>
          <span className="font-medium text-foreground">{productionQueue?.length}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductionQueue;