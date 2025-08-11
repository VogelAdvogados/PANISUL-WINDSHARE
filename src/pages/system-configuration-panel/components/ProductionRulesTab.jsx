import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductionRulesTab = () => {
  const [rules, setRules] = useState({
    minBatchSize: 10,
    maxBatchSize: 100,
    defaultBatchSize: 50,
    recipeScalingLimit: 500,
    qualityControlEnabled: true,
    qualityCheckpoints: ['mixing', 'baking', 'cooling'],
    efficiencyCalculationMethod: 'time_based',
    productionPlanningHorizon: 7,
    allowPartialBatches: true,
    requireBatchApproval: false,
    trackProductionTime: true,
    enableYieldTracking: true,
    yieldVarianceThreshold: 10,
    temperatureMonitoring: true,
    humidityMonitoring: false,
    equipmentMaintenanceAlerts: true,
    maintenanceIntervalDays: 30
  });

  const [hasChanges, setHasChanges] = useState(false);

  const efficiencyMethods = [
    { value: "time_based", label: "Baseado no Tempo" },
    { value: "yield_based", label: "Baseado no Rendimento" },
    { value: "cost_based", label: "Baseado no Custo" },
    { value: "combined", label: "Método Combinado" }
  ];

  const qualityCheckpointOptions = [
    { value: "preparation", label: "Preparação" },
    { value: "mixing", label: "Mistura" },
    { value: "fermentation", label: "Fermentação" },
    { value: "shaping", label: "Modelagem" },
    { value: "baking", label: "Assamento" },
    { value: "cooling", label: "Resfriamento" },
    { value: "packaging", label: "Embalagem" }
  ];

  const handleInputChange = (field, value) => {
    setRules(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleCheckpointChange = (checkpoint, checked) => {
    setRules(prev => ({
      ...prev,
      qualityCheckpoints: checked
        ? [...prev?.qualityCheckpoints, checkpoint]
        : prev?.qualityCheckpoints?.filter(cp => cp !== checkpoint)
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Salvando regras de produção:', rules);
    setHasChanges(false);
  };

  const handleReset = () => {
    setRules({
      minBatchSize: 10,
      maxBatchSize: 100,
      defaultBatchSize: 50,
      recipeScalingLimit: 500,
      qualityControlEnabled: true,
      qualityCheckpoints: ['mixing', 'baking', 'cooling'],
      efficiencyCalculationMethod: 'time_based',
      productionPlanningHorizon: 7,
      allowPartialBatches: true,
      requireBatchApproval: false,
      trackProductionTime: true,
      enableYieldTracking: true,
      yieldVarianceThreshold: 10,
      temperatureMonitoring: true,
      humidityMonitoring: false,
      equipmentMaintenanceAlerts: true,
      maintenanceIntervalDays: 30
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-8">
      {/* Batch Configuration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Package2" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Configuração de Lotes</h3>
            <p className="text-sm text-muted-foreground">Defina os tamanhos de lote para produção</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Tamanho Mínimo do Lote"
            type="number"
            value={rules?.minBatchSize}
            onChange={(e) => handleInputChange('minBatchSize', parseInt(e?.target?.value))}
            description="Quantidade mínima por lote"
            min="1"
            required
          />

          <Input
            label="Tamanho Máximo do Lote"
            type="number"
            value={rules?.maxBatchSize}
            onChange={(e) => handleInputChange('maxBatchSize', parseInt(e?.target?.value))}
            description="Quantidade máxima por lote"
            min="1"
            required
          />

          <Input
            label="Tamanho Padrão do Lote"
            type="number"
            value={rules?.defaultBatchSize}
            onChange={(e) => handleInputChange('defaultBatchSize', parseInt(e?.target?.value))}
            description="Tamanho sugerido automaticamente"
            min="1"
            required
          />
        </div>

        <div className="mt-6 space-y-4">
          <Checkbox
            label="Permitir Lotes Parciais"
            description="Permitir produção de lotes menores que o mínimo"
            checked={rules?.allowPartialBatches}
            onChange={(e) => handleInputChange('allowPartialBatches', e?.target?.checked)}
          />

          <Checkbox
            label="Requer Aprovação de Lote"
            description="Solicitar aprovação antes de iniciar a produção"
            checked={rules?.requireBatchApproval}
            onChange={(e) => handleInputChange('requireBatchApproval', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Recipe Scaling */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Scale" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Escalonamento de Receitas</h3>
            <p className="text-sm text-muted-foreground">Configure limites para ajuste de receitas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Limite de Escalonamento (%)"
            type="number"
            value={rules?.recipeScalingLimit}
            onChange={(e) => handleInputChange('recipeScalingLimit', parseInt(e?.target?.value))}
            description="Percentual máximo para aumentar receitas"
            min="100"
            max="1000"
            required
          />

          <Input
            label="Horizonte de Planejamento (dias)"
            type="number"
            value={rules?.productionPlanningHorizon}
            onChange={(e) => handleInputChange('productionPlanningHorizon', parseInt(e?.target?.value))}
            description="Quantos dias à frente planejar"
            min="1"
            max="30"
            required
          />
        </div>
      </div>
      {/* Quality Control */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="CheckCircle" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Controle de Qualidade</h3>
            <p className="text-sm text-muted-foreground">Configure pontos de verificação de qualidade</p>
          </div>
        </div>

        <div className="space-y-6">
          <Checkbox
            label="Controle de Qualidade Ativo"
            description="Habilitar verificações de qualidade durante a produção"
            checked={rules?.qualityControlEnabled}
            onChange={(e) => handleInputChange('qualityControlEnabled', e?.target?.checked)}
          />

          {rules?.qualityControlEnabled && (
            <div className="ml-6 pt-2">
              <label className="text-sm font-medium text-foreground mb-3 block">
                Pontos de Verificação
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {qualityCheckpointOptions?.map((option) => (
                  <Checkbox
                    key={option?.value}
                    label={option?.label}
                    checked={rules?.qualityCheckpoints?.includes(option?.value)}
                    onChange={(e) => handleCheckpointChange(option?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Efficiency Calculation */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Cálculo de Eficiência</h3>
            <p className="text-sm text-muted-foreground">Configure como medir a eficiência da produção</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Método de Cálculo"
            options={efficiencyMethods}
            value={rules?.efficiencyCalculationMethod}
            onChange={(value) => handleInputChange('efficiencyCalculationMethod', value)}
            description="Como calcular a eficiência da produção"
            required
          />

          <div className="space-y-4">
            <Checkbox
              label="Rastrear Tempo de Produção"
              description="Registrar tempo gasto em cada etapa"
              checked={rules?.trackProductionTime}
              onChange={(e) => handleInputChange('trackProductionTime', e?.target?.checked)}
            />

            <Checkbox
              label="Rastrear Rendimento"
              description="Comparar quantidade produzida vs. esperada"
              checked={rules?.enableYieldTracking}
              onChange={(e) => handleInputChange('enableYieldTracking', e?.target?.checked)}
            />
          </div>
        </div>

        {rules?.enableYieldTracking && (
          <div className="mt-6">
            <Input
              label="Limite de Variação do Rendimento (%)"
              type="number"
              value={rules?.yieldVarianceThreshold}
              onChange={(e) => handleInputChange('yieldVarianceThreshold', parseInt(e?.target?.value))}
              description="Percentual aceitável de variação no rendimento"
              min="1"
              max="50"
              className="max-w-xs"
            />
          </div>
        )}
      </div>
      {/* Environmental Monitoring */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Thermometer" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Monitoramento Ambiental</h3>
            <p className="text-sm text-muted-foreground">Configure sensores e alertas ambientais</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Checkbox
            label="Monitoramento de Temperatura"
            description="Acompanhar temperatura durante a produção"
            checked={rules?.temperatureMonitoring}
            onChange={(e) => handleInputChange('temperatureMonitoring', e?.target?.checked)}
          />

          <Checkbox
            label="Monitoramento de Umidade"
            description="Controlar níveis de umidade no ambiente"
            checked={rules?.humidityMonitoring}
            onChange={(e) => handleInputChange('humidityMonitoring', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Equipment Maintenance */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
            <Icon name="Wrench" size={20} className="text-error" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Manutenção de Equipamentos</h3>
            <p className="text-sm text-muted-foreground">Configure alertas de manutenção preventiva</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Checkbox
            label="Alertas de Manutenção"
            description="Receber lembretes de manutenção preventiva"
            checked={rules?.equipmentMaintenanceAlerts}
            onChange={(e) => handleInputChange('equipmentMaintenanceAlerts', e?.target?.checked)}
          />

          {rules?.equipmentMaintenanceAlerts && (
            <Input
              label="Intervalo de Manutenção (dias)"
              type="number"
              value={rules?.maintenanceIntervalDays}
              onChange={(e) => handleInputChange('maintenanceIntervalDays', parseInt(e?.target?.value))}
              description="Frequência dos alertas de manutenção"
              min="1"
              max="365"
            />
          )}
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
            Salvar Regras
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductionRulesTab;