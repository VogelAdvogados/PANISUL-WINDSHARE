import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = () => {
  const alerts = [
    {
      id: 1,
      type: "low-stock",
      title: "Estoque Baixo",
      message: "Farinha de Trigo abaixo do limite mínimo",
      details: "Restam apenas 15kg em estoque",
      severity: "high",
      timestamp: "2025-08-04T14:30:00",
      action: "Reabastecer"
    },
    {
      id: 2,
      type: "expiration",
      title: "Vencimento Próximo",
      message: "Fermento vence em 3 dias",
      details: "Lote FRM-2025-08 - 5kg",
      severity: "medium",
      timestamp: "2025-08-04T13:45:00",
      action: "Usar Primeiro"
    },
    {
      id: 3,
      type: "production-delay",
      title: "Atraso na Produção",
      message: "Lote B2025-001 com 30min de atraso",
      details: "Problema no forno 2",
      severity: "medium",
      timestamp: "2025-08-04T12:15:00",
      action: "Verificar"
    },
    {
      id: 4,
      type: "temperature",
      title: "Temperatura Elevada",
      message: "Câmara de fermentação acima do ideal",
      details: "32°C (ideal: 28°C)",
      severity: "low",
      timestamp: "2025-08-04T11:20:00",
      action: "Ajustar"
    },
    {
      id: 5,
      type: "maintenance",
      title: "Manutenção Programada",
      message: "Forno 1 precisa de limpeza",
      details: "Última limpeza há 7 dias",
      severity: "low",
      timestamp: "2025-08-04T10:00:00",
      action: "Agendar"
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'border-l-error bg-error/5';
      case 'medium':
        return 'border-l-warning bg-warning/5';
      case 'low':
        return 'border-l-accent bg-accent/5';
      default:
        return 'border-l-muted bg-muted/5';
    }
  };

  const getSeverityIcon = (type) => {
    switch (type) {
      case 'low-stock':
        return 'Package';
      case 'expiration':
        return 'Calendar';
      case 'production-delay':
        return 'Clock';
      case 'temperature':
        return 'Thermometer';
      case 'maintenance':
        return 'Wrench';
      default:
        return 'AlertCircle';
    }
  };

  const getSeverityIconColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const criticalAlerts = alerts?.filter(alert => alert.severity === 'high');
  const otherAlerts = alerts?.filter(alert => alert.severity !== 'high');

  return (
    <div className="bg-card rounded-lg border border-border p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Alertas Críticos</h2>
        <div className="flex items-center gap-2">
          {criticalAlerts?.length > 0 && (
            <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
          )}
          <span className="text-sm text-muted-foreground">
            {alerts?.length} alertas
          </span>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {/* Critical Alerts First */}
        {criticalAlerts?.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 rounded-lg p-3 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon
                  name={getSeverityIcon(alert.type)}
                  size={16}
                  className={getSeverityIconColor(alert.severity)}
                />
                <h3 className="font-medium text-foreground text-sm">{alert.title}</h3>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTime(alert.timestamp)}
              </span>
            </div>

            <p className="text-sm text-foreground mb-1">{alert.message}</p>
            <p className="text-xs text-muted-foreground mb-3">{alert.details}</p>

            <Button
              variant="outline"
              size="xs"
              className="w-full"
              iconName="ArrowRight"
              iconPosition="right"
              iconSize={12}
            >
              {alert.action}
            </Button>
          </div>
        ))}

        {/* Other Alerts */}
        {otherAlerts?.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 rounded-lg p-3 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon
                  name={getSeverityIcon(alert.type)}
                  size={16}
                  className={getSeverityIconColor(alert.severity)}
                />
                <h3 className="font-medium text-foreground text-sm">{alert.title}</h3>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTime(alert.timestamp)}
              </span>
            </div>

            <p className="text-sm text-foreground mb-1">{alert.message}</p>
            <p className="text-xs text-muted-foreground mb-3">{alert.details}</p>

            <Button
              variant="ghost"
              size="xs"
              className="w-full"
              iconName="ArrowRight"
              iconPosition="right"
              iconSize={12}
            >
              {alert.action}
            </Button>
          </div>
        ))}
      </div>
      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-error">{criticalAlerts?.length}</p>
            <p className="text-xs text-muted-foreground">Críticos</p>
          </div>
          <div>
            <p className="text-lg font-bold text-warning">
              {alerts?.filter(a => a?.severity === 'medium')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Médios</p>
          </div>
          <div>
            <p className="text-lg font-bold text-accent">
              {alerts?.filter(a => a?.severity === 'low')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Baixos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;