import React from 'react';
import Icon from '../../../components/AppIcon';

const LiveMetrics = () => {
  const currentBatch = {
    batchNumber: "B2025-002",
    breadType: "Pão Integral",
    startTime: "09:00",
    progress: 65,
    estimatedCompletion: "11:45",
    currentStage: "Fermentação",
    temperature: "28°C",
    humidity: "75%"
  };

  const metrics = [
    {
      id: 1,
      title: "Eficiência de Produção",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: "TrendingUp",
      color: "text-success"
    },
    {
      id: 2,
      title: "Consumo de Ingredientes",
      value: "142kg",
      change: "Normal",
      trend: "stable",
      icon: "Package",
      color: "text-accent"
    },
    {
      id: 3,
      title: "Tempo Médio por Lote",
      value: "2h 45m",
      change: "-15min",
      trend: "down",
      icon: "Clock",
      color: "text-success"
    },
    {
      id: 4,
      title: "Taxa de Desperdício",
      value: "2.3%",
      change: "+0.5%",
      trend: "up",
      icon: "AlertTriangle",
      color: "text-warning"
    }
  ];

  const ingredientConsumption = [
    { name: "Farinha de Trigo", consumed: 85, total: 100, unit: "kg" },
    { name: "Fermento", consumed: 2.5, total: 5, unit: "kg" },
    { name: "Sal", consumed: 1.8, total: 3, unit: "kg" },
    { name: "Açúcar", consumed: 3.2, total: 8, unit: "kg" }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4 h-full">
      {/* Current Batch Status */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Lote Atual</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-lg text-sm font-medium">
            <Icon name="Play" size={14} />
            <span>Em Andamento</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Lote</p>
            <p className="font-mono font-medium text-foreground">{currentBatch?.batchNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Produto</p>
            <p className="font-medium text-foreground">{currentBatch?.breadType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estágio Atual</p>
            <p className="font-medium text-foreground">{currentBatch?.currentStage}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Previsão</p>
            <p className="font-medium text-foreground">{currentBatch?.estimatedCompletion}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium text-foreground">{currentBatch?.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-accent h-3 rounded-full transition-all duration-500"
              style={{ width: `${currentBatch?.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="Thermometer" size={16} className="text-error" />
            <span className="text-muted-foreground">Temperatura:</span>
            <span className="font-medium text-foreground">{currentBatch?.temperature}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Droplets" size={16} className="text-accent" />
            <span className="text-muted-foreground">Umidade:</span>
            <span className="font-medium text-foreground">{currentBatch?.humidity}</span>
          </div>
        </div>
      </div>
      {/* Production Metrics */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Métricas de Produção</h3>
        <div className="grid grid-cols-2 gap-4">
          {metrics?.map((metric) => (
            <div key={metric?.id} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Icon name={metric?.icon} size={20} className={metric?.color} />
                <Icon
                  name={getTrendIcon(metric?.trend)}
                  size={16}
                  className={getTrendColor(metric?.trend)}
                />
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{metric?.value}</p>
              <p className="text-xs text-muted-foreground mb-1">{metric?.title}</p>
              <p className={`text-xs font-medium ${getTrendColor(metric?.trend)}`}>
                {metric?.change}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Ingredient Consumption */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Consumo de Ingredientes</h3>
        <div className="space-y-3">
          {ingredientConsumption?.map((ingredient, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground font-medium">{ingredient?.name}</span>
                <span className="text-muted-foreground">
                  {ingredient?.consumed}/{ingredient?.total} {ingredient?.unit}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(ingredient?.consumed / ingredient?.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMetrics;