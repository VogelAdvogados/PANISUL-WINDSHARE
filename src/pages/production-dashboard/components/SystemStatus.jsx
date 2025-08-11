import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = () => {
  const systemStatus = {
    lastSync: "2025-08-04T15:12:30",
    inventorySync: "connected",
    accountingSync: "connected",
    webSocketStatus: "connected",
    databaseStatus: "healthy",
    backupStatus: "completed"
  };

  const integrations = [
    {
      name: "Sistema de Estoque",
      status: systemStatus?.inventorySync,
      lastUpdate: "15:12",
      icon: "Package"
    },
    {
      name: "Contabilidade",
      status: systemStatus?.accountingSync,
      lastUpdate: "15:10",
      icon: "Calculator"
    },
    {
      name: "Backup Automático",
      status: systemStatus?.backupStatus === "completed" ? "connected" : "error",
      lastUpdate: "14:00",
      icon: "HardDrive"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': case'healthy': case'completed':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error': case'disconnected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': case'healthy': case'completed':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error': case'disconnected':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'healthy':
        return 'Saudável';
      case 'completed':
        return 'Concluído';
      case 'warning':
        return 'Atenção';
      case 'error':
        return 'Erro';
      case 'disconnected':
        return 'Desconectado';
      default:
        return 'Desconhecido';
    }
  };

  const formatLastSync = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Status do Sistema</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-success font-medium">Online</span>
        </div>
      </div>
      {/* Last Sync Info */}
      <div className="mb-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="RefreshCw" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Última Sincronização</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatLastSync(systemStatus?.lastSync)}
          </span>
        </div>
      </div>
      {/* Integration Status */}
      <div className="space-y-3 mb-4">
        <h4 className="text-sm font-medium text-foreground">Integrações</h4>
        {integrations?.map((integration, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <Icon name={integration?.icon} size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{integration?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{integration?.lastUpdate}</span>
              <div className="flex items-center gap-1">
                <Icon
                  name={getStatusIcon(integration?.status)}
                  size={14}
                  className={getStatusColor(integration?.status)}
                />
                <span className={`text-xs font-medium ${getStatusColor(integration?.status)}`}>
                  {getStatusText(integration?.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* System Health */}
      <div className="pt-3 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Saúde do Sistema</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="Database" size={14} className="text-success" />
              <span className="text-xs font-medium text-success">Banco de Dados</span>
            </div>
            <p className="text-xs text-muted-foreground">Saudável</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="Wifi" size={14} className="text-success" />
              <span className="text-xs font-medium text-success">Conexão</span>
            </div>
            <p className="text-xs text-muted-foreground">Estável</p>
          </div>
        </div>
      </div>
      {/* Performance Indicator */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Performance do Sistema</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-success font-medium">Excelente</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;