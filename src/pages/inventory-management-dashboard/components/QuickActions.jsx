import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const [syncStatus, setSyncStatus] = useState('synced');

  const quickActions = [
    {
      id: 1,
      title: "Ajuste Rápido de Estoque",
      description: "Corrigir quantidades em estoque",
      icon: "Edit",
      color: "primary",
      action: () => console.log('Ajuste de estoque')
    },
    {
      id: 2,
      title: "Pedido de Emergência",
      description: "Criar pedido urgente",
      icon: "AlertCircle",
      color: "error",
      action: () => console.log('Pedido emergência')
    },
    {
      id: 3,
      title: "Relatório de Desperdício",
      description: "Registrar perdas e descartes",
      icon: "Trash2",
      color: "warning",
      action: () => console.log('Relatório desperdício')
    },
    {
      id: 4,
      title: "Sincronizar Sistema",
      description: "Atualizar dados com fornecedores",
      icon: "RefreshCw",
      color: "secondary",
      action: () => {
        setSyncStatus('syncing');
        setTimeout(() => setSyncStatus('synced'), 2000);
      }
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "critical",
      message: "Fermento Biológico Seco está sem estoque",
      timestamp: "2025-02-04 14:30",
      action: "Criar Pedido"
    },
    {
      id: 2,
      type: "warning",
      message: "8 ingredientes vencendo em 7 dias",
      timestamp: "2025-02-04 09:15",
      action: "Ver Lista"
    },
    {
      id: 3,
      type: "info",
      message: "Pedido #PO-2025-0156 foi entregue",
      timestamp: "2025-02-04 08:45",
      action: "Conferir"
    }
  ];

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'border-l-error bg-error/5';
      case 'warning':
        return 'border-l-warning bg-warning/5';
      case 'info':
        return 'border-l-primary bg-primary/5';
      default:
        return 'border-l-muted bg-muted/5';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return 'AlertTriangle';
      case 'warning':
        return 'Clock';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sync Status */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Status de Sincronização</h3>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            syncStatus === 'synced' ? 'bg-success/10 text-success' :
            syncStatus === 'syncing'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
          }`}>
            <Icon
              name={syncStatus === 'synced' ? 'CheckCircle' : syncStatus === 'syncing' ? 'RefreshCw' : 'XCircle'}
              size={16}
              className={syncStatus === 'syncing' ? 'animate-spin' : ''}
            />
            {syncStatus === 'synced' ? 'Sincronizado' :
             syncStatus === 'syncing' ? 'Sincronizando...' : 'Erro'}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Última sincronização: 04/02/2025 às 15:14
        </p>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fornecedores</span>
            <span className="text-success font-medium">5/5 conectados</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sistema Contábil</span>
            <span className="text-success font-medium">Conectado</span>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-semibold text-foreground mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 gap-3">
          {quickActions?.map((action) => (
            <Button
              key={action?.id}
              variant="outline"
              onClick={action?.action}
              className="justify-start h-auto p-4 text-left"
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  action?.color === 'primary' ? 'bg-primary/10' :
                  action?.color === 'error' ? 'bg-error/10' :
                  action?.color === 'warning'? 'bg-warning/10' : 'bg-secondary/10'
                }`}>
                  <Icon
                    name={action?.icon}
                    size={20}
                    className={
                      action?.color === 'primary' ? 'text-primary' :
                      action?.color === 'error' ? 'text-error' :
                      action?.color === 'warning'? 'text-warning' : 'text-secondary'
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm">{action?.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{action?.description}</p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </div>
            </Button>
          ))}
        </div>
      </div>
      {/* Recent Alerts */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Alertas Recentes</h3>
          <Button variant="ghost" size="sm" iconName="Bell">
            Ver Todos
          </Button>
        </div>
        <div className="space-y-3">
          {recentAlerts?.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 rounded-r-lg p-3 ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  name={getAlertIcon(alert.type)}
                  size={16}
                  className={
                    alert.type === 'critical' ? 'text-error' :
                    alert.type === 'warning'? 'text-warning' : 'text-primary'
                  }
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  {alert.action}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Keyboard Shortcuts */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-semibold text-foreground mb-4">Atalhos do Teclado</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Buscar ingredientes</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + F</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Novo ajuste</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + N</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Exportar dados</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + E</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Atualizar página</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">F5</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;