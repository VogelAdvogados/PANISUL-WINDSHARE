import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReorderSuggestions = ({ suggestions, onCreateFromSuggestion, onDismissSuggestion }) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);

  if (!suggestions || suggestions?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 text-center">
        <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Estoque em Dia</h3>
        <p className="text-muted-foreground">
          Não há sugestões de reposição no momento. Todos os ingredientes estão com níveis adequados.
        </p>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa'
    };
    return labels?.[priority] || priority;
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Info';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Sugestões de Reposição</h3>
        <span className="text-sm text-muted-foreground">
          {suggestions?.length} sugestão{suggestions?.length !== 1 ? 'ões' : ''}
        </span>
      </div>
      <div className="space-y-3">
        {suggestions?.map((suggestion) => (
          <div key={suggestion?.id} className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    suggestion?.priority === 'high' ? 'bg-error/10' :
                    suggestion?.priority === 'medium' ? 'bg-warning/10' : 'bg-success/10'
                  }`}>
                    <Icon
                      name={getPriorityIcon(suggestion?.priority)}
                      size={20}
                      className={getPriorityColor(suggestion?.priority)}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{suggestion?.supplier}</h4>
                    <p className="text-sm text-muted-foreground">{suggestion?.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        suggestion?.priority === 'high' ? 'bg-error/10 text-error' :
                        suggestion?.priority === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                      }`}>
                        Prioridade {getPriorityLabel(suggestion?.priority)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {suggestion?.items?.length} ite{suggestion?.items?.length !== 1 ? 'ns' : 'm'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{formatCurrency(suggestion?.estimatedTotal)}</div>
                  <div className="text-sm text-muted-foreground">Total estimado</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  iconName={expandedSuggestion === suggestion?.id ? "ChevronUp" : "ChevronDown"}
                  iconSize={16}
                  onClick={() => setExpandedSuggestion(
                    expandedSuggestion === suggestion?.id ? null : suggestion?.id
                  )}
                >
                  {expandedSuggestion === suggestion?.id ? 'Ocultar' : 'Ver'} Detalhes
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="ShoppingCart"
                  iconSize={16}
                  onClick={() => onCreateFromSuggestion(suggestion)}
                >
                  Criar Pedido
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  iconSize={16}
                  onClick={() => onDismissSuggestion(suggestion?.id)}
                >
                  Dispensar
                </Button>
              </div>

              {expandedSuggestion === suggestion?.id && (
                <div className="border-t border-border pt-4">
                  <h5 className="font-medium text-foreground mb-3">Itens Sugeridos:</h5>
                  <div className="space-y-3">
                    {suggestion?.items?.map((item, index) => (
                      <div key={index} className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h6 className="font-medium text-foreground">{item?.name}</h6>
                            <p className="text-sm text-muted-foreground">{item?.reason}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-foreground">{formatCurrency(item?.estimatedCost)}</div>
                            <div className="text-sm text-muted-foreground">
                              {item?.suggestedQuantity} {item?.unit}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Estoque Atual:</span>
                            <div>{item?.currentStock} {item?.unit}</div>
                          </div>
                          <div>
                            <span className="font-medium">Estoque Mínimo:</span>
                            <div>{item?.minStock} {item?.unit}</div>
                          </div>
                          <div>
                            <span className="font-medium">Consumo Médio:</span>
                            <div>{item?.avgConsumption} {item?.unit}/dia</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Informações do Fornecedor:</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Prazo de Entrega:</span>
                        <div className="text-muted-foreground">{suggestion?.deliveryTime} dias úteis</div>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Condições:</span>
                        <div className="text-muted-foreground">{suggestion?.paymentTerms}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReorderSuggestions;