import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const GeneralSettingsTab = () => {
  const [settings, setSettings] = useState({
    businessName: "Padaria São João",
    businessAddress: "Rua das Flores, 123 - Centro",
    businessPhone: "(11) 98765-4321",
    businessEmail: "contato@padariasaojoao.com.br",
    operatingHours: {
      start: "06:00",
      end: "18:00"
    },
    defaultCurrency: "BRL",
    defaultWeightUnit: "kg",
    defaultVolumeUnit: "L",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "1.000,00",
    enableNotifications: true,
    enableAutoBackup: true,
    backupFrequency: "daily"
  });

  const [hasChanges, setHasChanges] = useState(false);

  const currencyOptions = [
    { value: "BRL", label: "Real Brasileiro (R$)" },
    { value: "USD", label: "Dólar Americano ($)" },
    { value: "EUR", label: "Euro (€)" }
  ];

  const weightUnitOptions = [
    { value: "kg", label: "Quilogramas (kg)" },
    { value: "g", label: "Gramas (g)" },
    { value: "lb", label: "Libras (lb)" }
  ];

  const volumeUnitOptions = [
    { value: "L", label: "Litros (L)" },
    { value: "ml", label: "Mililitros (ml)" },
    { value: "cup", label: "Xícaras" }
  ];

  const timezoneOptions = [
    { value: "America/Sao_Paulo", label: "Brasília (GMT-3)" },
    { value: "America/Manaus", label: "Manaus (GMT-4)" },
    { value: "America/Rio_Branco", label: "Rio Branco (GMT-5)" }
  ];

  const backupFrequencyOptions = [
    { value: "hourly", label: "A cada hora" },
    { value: "daily", label: "Diariamente" },
    { value: "weekly", label: "Semanalmente" }
  ];

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleOperatingHoursChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      operatingHours: {
        ...prev?.operatingHours,
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Mock save functionality
    console.log('Salvando configurações gerais:', settings);
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      businessName: "Padaria São João",
      businessAddress: "Rua das Flores, 123 - Centro",
      businessPhone: "(11) 98765-4321",
      businessEmail: "contato@padariasaojoao.com.br",
      operatingHours: {
        start: "06:00",
        end: "18:00"
      },
      defaultCurrency: "BRL",
      defaultWeightUnit: "kg",
      defaultVolumeUnit: "L",
      timezone: "America/Sao_Paulo",
      dateFormat: "DD/MM/YYYY",
      numberFormat: "1.000,00",
      enableNotifications: true,
      enableAutoBackup: true,
      backupFrequency: "daily"
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-8">
      {/* Business Information */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Building2" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Informações do Negócio</h3>
            <p className="text-sm text-muted-foreground">Configure os dados básicos da sua padaria</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nome da Padaria"
            type="text"
            value={settings?.businessName}
            onChange={(e) => handleInputChange('businessName', e?.target?.value)}
            placeholder="Digite o nome da padaria"
            required
          />

          <Input
            label="Telefone"
            type="tel"
            value={settings?.businessPhone}
            onChange={(e) => handleInputChange('businessPhone', e?.target?.value)}
            placeholder="(11) 99999-9999"
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Endereço"
              type="text"
              value={settings?.businessAddress}
              onChange={(e) => handleInputChange('businessAddress', e?.target?.value)}
              placeholder="Rua, número - Bairro"
              required
            />
          </div>

          <Input
            label="E-mail"
            type="email"
            value={settings?.businessEmail}
            onChange={(e) => handleInputChange('businessEmail', e?.target?.value)}
            placeholder="contato@padaria.com.br"
            required
          />
        </div>
      </div>
      {/* Operating Hours */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Horário de Funcionamento</h3>
            <p className="text-sm text-muted-foreground">Defina os horários de operação da padaria</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Horário de Abertura"
            type="time"
            value={settings?.operatingHours?.start}
            onChange={(e) => handleOperatingHoursChange('start', e?.target?.value)}
            required
          />

          <Input
            label="Horário de Fechamento"
            type="time"
            value={settings?.operatingHours?.end}
            onChange={(e) => handleOperatingHoursChange('end', e?.target?.value)}
            required
          />
        </div>
      </div>
      {/* Units and Formatting */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Settings2" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Unidades e Formatação</h3>
            <p className="text-sm text-muted-foreground">Configure as unidades padrão e formatos de exibição</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Select
            label="Moeda Padrão"
            options={currencyOptions}
            value={settings?.defaultCurrency}
            onChange={(value) => handleInputChange('defaultCurrency', value)}
            required
          />

          <Select
            label="Unidade de Peso"
            options={weightUnitOptions}
            value={settings?.defaultWeightUnit}
            onChange={(value) => handleInputChange('defaultWeightUnit', value)}
            required
          />

          <Select
            label="Unidade de Volume"
            options={volumeUnitOptions}
            value={settings?.defaultVolumeUnit}
            onChange={(value) => handleInputChange('defaultVolumeUnit', value)}
            required
          />

          <Select
            label="Fuso Horário"
            options={timezoneOptions}
            value={settings?.timezone}
            onChange={(value) => handleInputChange('timezone', value)}
            required
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Formato de Data</label>
            <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
              {settings?.dateFormat} (04/08/2025)
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Formato de Número</label>
            <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
              {settings?.numberFormat} (R$ 1.234,56)
            </div>
          </div>
        </div>
      </div>
      {/* System Preferences */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Bell" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Preferências do Sistema</h3>
            <p className="text-sm text-muted-foreground">Configure notificações e backup automático</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Checkbox
                label="Habilitar Notificações"
                description="Receba alertas sobre estoque baixo e outras informações importantes"
                checked={settings?.enableNotifications}
                onChange={(e) => handleInputChange('enableNotifications', e?.target?.checked)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Checkbox
                label="Backup Automático"
                description="Faça backup automático dos dados do sistema"
                checked={settings?.enableAutoBackup}
                onChange={(e) => handleInputChange('enableAutoBackup', e?.target?.checked)}
              />
            </div>
          </div>

          {settings?.enableAutoBackup && (
            <div className="ml-6 pt-2">
              <Select
                label="Frequência do Backup"
                options={backupFrequencyOptions}
                value={settings?.backupFrequency}
                onChange={(value) => handleInputChange('backupFrequency', value)}
                className="max-w-xs"
              />
            </div>
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
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsTab;