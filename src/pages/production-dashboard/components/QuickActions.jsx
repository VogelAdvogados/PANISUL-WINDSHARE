import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const QuickActions = () => {
  const [showBatchUpdate, setShowBatchUpdate] = useState(false);
  const [showStockAdjustment, setShowStockAdjustment] = useState(false);
  const [showProductionNote, setShowProductionNote] = useState(false);
  const [batchStatus, setBatchStatus] = useState('');
  const [stockItem, setStockItem] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [productionNote, setProductionNote] = useState('');

  const quickActions = [
    {
      id: 1,
      title: "Atualizar Status do Lote",
      description: "Alterar status de produção",
      icon: "RefreshCw",
      color: "text-accent",
      bgColor: "bg-accent/10",
      action: () => setShowBatchUpdate(true)
    },
    {
      id: 2,
      title: "Ajuste de Estoque",
      description: "Correção emergencial",
      icon: "Package",
      color: "text-warning",
      bgColor: "bg-warning/10",
      action: () => setShowStockAdjustment(true)
    },
    {
      id: 3,
      title: "Nota de Produção",
      description: "Adicionar observação",
      icon: "FileText",
      color: "text-primary",
      bgColor: "bg-primary/10",
      action: () => setShowProductionNote(true)
    },
    {
      id: 4,
      title: "Relatório Rápido",
      description: "Gerar relatório atual",
      icon: "BarChart3",
      color: "text-success",
      bgColor: "bg-success/10",
      action: () => alert('Gerando relatório...')
    }
  ];

  const handleBatchUpdate = () => {
    if (batchStatus) {
      alert(`Status do lote atualizado para: ${batchStatus}`);
      setBatchStatus('');
      setShowBatchUpdate(false);
    }
  };

  const handleStockAdjustment = () => {
    if (stockItem && stockQuantity) {
      alert(`Estoque ajustado: ${stockItem} - ${stockQuantity}kg`);
      setStockItem('');
      setStockQuantity('');
      setShowStockAdjustment(false);
    }
  };

  const handleProductionNote = () => {
    if (productionNote) {
      alert(`Nota adicionada: ${productionNote}`);
      setProductionNote('');
      setShowProductionNote(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.action}
            className="p-3 rounded-lg border border-border hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className={`w-10 h-10 rounded-lg ${action?.bgColor} flex items-center justify-center mb-2`}>
              <Icon name={action?.icon} size={20} className={action?.color} />
            </div>
            <h4 className="font-medium text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
              {action?.title}
            </h4>
            <p className="text-xs text-muted-foreground">{action?.description}</p>
          </button>
        ))}
      </div>
      {/* Batch Update Modal */}
      {showBatchUpdate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Atualizar Status do Lote</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBatchUpdate(false)}
                iconName="X"
                iconSize={16}
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Novo Status"
                type="text"
                placeholder="Ex: Concluído, Em Andamento, Pausado"
                value={batchStatus}
                onChange={(e) => setBatchStatus(e?.target?.value)}
              />

              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={handleBatchUpdate}
                  className="flex-1"
                  iconName="Check"
                  iconPosition="left"
                  iconSize={16}
                >
                  Atualizar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBatchUpdate(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Stock Adjustment Modal */}
      {showStockAdjustment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Ajuste de Estoque</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowStockAdjustment(false)}
                iconName="X"
                iconSize={16}
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Item"
                type="text"
                placeholder="Ex: Farinha de Trigo"
                value={stockItem}
                onChange={(e) => setStockItem(e?.target?.value)}
              />

              <Input
                label="Quantidade (kg)"
                type="number"
                placeholder="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e?.target?.value)}
              />

              <div className="flex gap-2">
                <Button
                  variant="warning"
                  onClick={handleStockAdjustment}
                  className="flex-1"
                  iconName="Package"
                  iconPosition="left"
                  iconSize={16}
                >
                  Ajustar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowStockAdjustment(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Production Note Modal */}
      {showProductionNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Nota de Produção</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProductionNote(false)}
                iconName="X"
                iconSize={16}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Observação
                </label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  rows={4}
                  placeholder="Digite sua observação sobre a produção..."
                  value={productionNote}
                  onChange={(e) => setProductionNote(e?.target?.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={handleProductionNote}
                  className="flex-1"
                  iconName="FileText"
                  iconPosition="left"
                  iconSize={16}
                >
                  Salvar Nota
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowProductionNote(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Keyboard Shortcuts Info */}
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Atalhos do Teclado:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Space</kbd>
            <span className="text-muted-foreground">Status</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">N</kbd>
            <span className="text-muted-foreground">Nova Nota</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;