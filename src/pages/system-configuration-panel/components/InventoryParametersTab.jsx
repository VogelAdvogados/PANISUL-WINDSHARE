import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const InventoryParametersTab = () => {
  const [parameters, setParameters] = useState({
    reorderPointDays: 7,
    safetyStockPercentage: 20,
    expirationWarningDays: 3,
    wasteThresholdPercentage: 5,
    autoAdjustmentEnabled: true,
    autoAdjustmentThreshold: 2,
    lowStockAlertEnabled: true,
    expirationAlertEnabled: true,
    wasteTrackingEnabled: true,
    batchTrackingEnabled: true,
    supplierLeadTimeDays: 2,
    inventoryValuationMethod: "FIFO",
    stockMovementLogging: true,
    negativeStockAllowed: false
  });

  const [hasChanges, setHasChanges] = useState(false);

  const valuationMethods = [
    { value: "FIFO", label: "FIFO (Primeiro a Entrar, Primeiro a Sair)" },
    { value: "LIFO", label: "LIFO (Último a Entrar, Primeiro a Sair)" },
    { value: "AVERAGE", label: "Custo Médio Ponderado" }
  ];

  const handleInputChange = (field, value) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Salvando parâmetros de estoque:', parameters);
    setHasChanges(false);
  };

  const handleReset = () => {
    setParameters({
      reorderPointDays: 7,
      safetyStockPercentage: 20,
      expirationWarningDays: 3,
      wasteThresholdPercentage: 5,
      autoAdjustmentEnabled: true,
      autoAdjustmentThreshold: 2,
      lowStockAlertEnabled: true,
      expirationAlertEnabled: true,
      wasteTrackingEnabled: true,
      batchTrackingEnabled: true,
      supplierLeadTimeDays: 2,
      inventoryValuationMethod: "FIFO",
      stockMovementLogging: true,
      negativeStockAllowed: false
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-8">
      {/* Reorder Point Configuration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Package" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Ponto de Reposição</h3>
            <p className="text-sm text-muted-foreground">Configure quando reabastecer o estoque</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Dias para Reposição"
            type="number"
            value={parameters?.reorderPointDays}
            onChange={(e) => handleInputChange('reorderPointDays', parseInt(e?.target?.value))}
            description="Quantos dias antes do estoque acabar"
            min="1"
            max="30"
            required
          />

          <Input
            label="Estoque de Segurança (%)"
            type="number"
            value={parameters?.safetyStockPercentage}
            onChange={(e) => handleInputChange('safetyStockPercentage', parseInt(e?.target?.value))}
            description="Percentual adicional de segurança"
            min="0"
            max="100"
            required
          />

          <Input
            label="Prazo de Entrega (dias)"
            type="number"
            value={parameters?.supplierLeadTimeDays}
            onChange={(e) => handleInputChange('supplierLeadTimeDays', parseInt(e?.target?.value))}
            description="Tempo médio de entrega dos fornecedores"
            min="1"
            max="30"
            required
          />
        </div>
      </div>
      {/* Expiration Management */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Controle de Validade</h3>
            <p className="text-sm text-muted-foreground">Gerencie produtos próximos ao vencimento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Alerta de Vencimento (dias)"
            type="number"
            value={parameters?.expirationWarningDays}
            onChange={(e) => handleInputChange('expirationWarningDays', parseInt(e?.target?.value))}
            description="Quantos dias antes do vencimento alertar"
            min="1"
            max="30"
            required
          />

          <div className="flex items-center justify-between">
            <Checkbox
              label="Alertas de Vencimento"
              description="Receber notificações sobre produtos próximos ao vencimento"
              checked={parameters?.expirationAlertEnabled}
              onChange={(e) => handleInputChange('expirationAlertEnabled', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Waste Management */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
            <Icon name="Trash2" size={20} className="text-error" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Controle de Desperdício</h3>
            <p className="text-sm text-muted-foreground">Monitore e controle perdas de ingredientes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Limite de Desperdício (%)"
            type="number"
            value={parameters?.wasteThresholdPercentage}
            onChange={(e) => handleInputChange('wasteThresholdPercentage', parseInt(e?.target?.value))}
            description="Percentual máximo aceitável de desperdício"
            min="0"
            max="50"
            required
          />

          <div className="flex items-center justify-between">
            <Checkbox
              label="Rastreamento de Desperdício"
              description="Registrar e analisar perdas de ingredientes"
              checked={parameters?.wasteTrackingEnabled}
              onChange={(e) => handleInputChange('wasteTrackingEnabled', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Automatic Adjustments */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Ajustes Automáticos</h3>
            <p className="text-sm text-muted-foreground">Configure correções automáticas de estoque</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Checkbox
              label="Ajustes Automáticos"
              description="Permitir correções automáticas pequenas no estoque"
              checked={parameters?.autoAdjustmentEnabled}
              onChange={(e) => handleInputChange('autoAdjustmentEnabled', e?.target?.checked)}
            />
          </div>

          {parameters?.autoAdjustmentEnabled && (
            <div className="ml-6 pt-2">
              <Input
                label="Limite para Ajuste (%)"
                type="number"
                value={parameters?.autoAdjustmentThreshold}
                onChange={(e) => handleInputChange('autoAdjustmentThreshold', parseInt(e?.target?.value))}
                description="Percentual máximo para ajuste automático"
                min="1"
                max="10"
                className="max-w-xs"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Checkbox
              label="Permitir Estoque Negativo"
              description="Permitir que o estoque fique negativo temporariamente"
              checked={parameters?.negativeStockAllowed}
              onChange={(e) => handleInputChange('negativeStockAllowed', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Inventory Valuation */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Calculator" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Avaliação de Estoque</h3>
            <p className="text-sm text-muted-foreground">Configure método de valoração do estoque</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Método de Avaliação"
            options={valuationMethods}
            value={parameters?.inventoryValuationMethod}
            onChange={(value) => handleInputChange('inventoryValuationMethod', value)}
            description="Método para calcular o valor do estoque"
            required
          />

          <div className="space-y-4">
            <Checkbox
              label="Rastreamento por Lote"
              description="Controlar ingredientes por lotes de compra"
              checked={parameters?.batchTrackingEnabled}
              onChange={(e) => handleInputChange('batchTrackingEnabled', e?.target?.checked)}
            />

            <Checkbox
              label="Log de Movimentações"
              description="Registrar todas as movimentações de estoque"
              checked={parameters?.stockMovementLogging}
              onChange={(e) => handleInputChange('stockMovementLogging', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Alerts Configuration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Bell" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Configuração de Alertas</h3>
            <p className="text-sm text-muted-foreground">Defina quando receber notificações</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Checkbox
            label="Alertas de Estoque Baixo"
            description="Notificar quando ingredientes estiverem acabando"
            checked={parameters?.lowStockAlertEnabled}
            onChange={(e) => handleInputChange('lowStockAlertEnabled', e?.target?.checked)}
          />

          <Checkbox
            label="Alertas de Vencimento"
            description="Notificar sobre produtos próximos ao vencimento"
            checked={parameters?.expirationAlertEnabled}
            onChange={(e) => handleInputChange('expirationAlertEnabled', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={handleReset}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Restaurar Padrões
        </Button>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-warning flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              Alterações não salvas
            </span>
          )}
          <Button
            variant="default"
            onClick={handleSave}
            disabled={!hasChanges}
            iconName="Save"
            iconPosition="left"
          >
            Salvar Parâmetros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InventoryParametersTab;