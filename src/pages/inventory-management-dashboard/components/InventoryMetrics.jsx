import React from 'react';
import Icon from '../../../components/AppIcon';

const InventoryMetrics = () => {
  const metrics = [
    {
      id: 1,
      title: "Valor Total do Estoque",
      value: "R$ 45.280,50",
      change: "+5,2%",
      changeType: "positive",
      icon: "DollarSign",
      description: "Valor total dos ingredientes em estoque"
    },
    {
      id: 2,
      title: "Itens Abaixo do Ponto de Reposição",
      value: "12",
      change: "+3",
      changeType: "negative",
      icon: "AlertTriangle",
      description: "Ingredientes que precisam ser repostos"
    },
    {
      id: 3,
      title: "Ingredientes Vencendo em 7 Dias",
      value: "8",
      change: "-2",
      changeType: "positive",
      icon: "Clock",
      description: "Itens próximos ao vencimento"
    },
    {
      id: 4,
      title: "Fornecedores Ativos",
      value: "15",
      change: "0",
      changeType: "neutral",
      icon: "Truck",
      description: "Fornecedores com pedidos recentes"
    }
  ];

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              metric?.changeType === 'negative' ? 'bg-error/10' : 'bg-primary/10'
            }`}>
              <Icon
                name={metric?.icon}
                size={24}
                className={metric?.changeType === 'negative' ? 'text-error' : 'text-primary'}
              />
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              metric?.changeType === 'positive' ? 'bg-success/10 text-success' :
              metric?.changeType === 'negative'? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
            }`}>
              <Icon name={getChangeIcon(metric?.changeType)} size={12} />
              {metric?.change}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{metric?.title}</h3>
            <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
            <p className="text-xs text-muted-foreground">{metric?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryMetrics;