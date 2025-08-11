import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const IntegrationTab = () => {
  const [integrations, setIntegrations] = useState({
    accounting: {
      enabled: true,
      provider: 'quickbooks',
      apiEndpoint: 'https://api.quickbooks.com/v3',
      syncFrequency: 'daily',
      lastSync: '2025-08-04T10:30:00',
      status: 'connected'
    },
    suppliers: {
      enabled: false,
      provider: 'custom',
      apiEndpoint: '',
      syncFrequency: 'weekly',
      lastSync: null,
      status: 'disconnected'
    },
    mobile: {
      enabled: true,
      apiVersion: 'v2',
      pushNotifications: true,
      offlineSync: true,
      status: 'active'
    },
    pos: {
      enabled: false,
      provider: 'square',
      apiEndpoint: 'https://api.squareup.com/v2',
      syncFrequency: 'realtime',
      lastSync: null,
      status: 'disconnected'
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const accountingProviders = [
    { value: 'quickbooks', label: 'QuickBooks Online' },
    { value: 'xero', label: 'Xero' },
    { value: 'sage', label: 'Sage Business Cloud' },
    { value: 'custom', label: 'API Personalizada' }
  ];

  const posProviders = [
    { value: 'square', label: 'Square' },
    { value: 'stripe', label: 'Stripe Terminal' },
    { value: 'paypal', label: 'PayPal Here' },
    { value: 'custom', label: 'Sistema Personalizado' }
  ];

  const syncFrequencyOptions = [
    { value: 'realtime', label: 'Tempo Real' },
    { value: 'hourly', label: 'A cada hora' },
    { value: 'daily', label: 'Diariamente' },
    { value: 'weekly', label: 'Semanalmente' },
    { value: 'manual', label: 'Manual' }
  ];

  const handleIntegrationChange = (integration, field, value) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev?.[integration],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleTestConnection = (integration) => {
    console.log(`Testando conexão: ${integration}`);
    // Mock test result
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        [integration]: {
          ...prev?.[integration],
          status: prev?.[integration]?.enabled ? 'connected' : 'disconnected'
        }
      }));
    }, 2000);
  };

  const handleSyncNow = (integration) => {
    console.log(`Sincronizando: ${integration}`);
    const now = new Date()?.toISOString();
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev?.[integration],
        lastSync: now
      }
    }));
  };

  const handleSave = () => {
    console.log('Salvando configurações de integração:', integrations);
    setHasChanges(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': case'active':
        return 'text-success';
      case 'disconnected':
        return 'text-error';
      case 'testing':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': case'active':
        return 'CheckCircle';
      case 'disconnected':
        return 'XCircle';
      case 'testing':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const formatLastSync = (lastSync) => {
    if (!lastSync) return 'Nunca sincronizado';
    const date = new Date(lastSync);
    return `${date?.toLocaleDateString('pt-BR')} às ${date?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-8">
      {/* Accounting Integration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calculator" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Sistema Contábil</h3>
              <p className="text-sm text-muted-foreground">Integração com software de contabilidade</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Icon
              name={getStatusIcon(integrations?.accounting?.status)}
              size={16}
              className={getStatusColor(integrations?.accounting?.status)}
            />
            <span className={`text-sm font-medium ${getStatusColor(integrations?.accounting?.status)}`}>
              {integrations?.accounting?.status === 'connected' ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <Checkbox
            label="Habilitar Integração Contábil"
            description="Sincronizar dados financeiros automaticamente"
            checked={integrations?.accounting?.enabled}
            onChange={(e) => handleIntegrationChange('accounting', 'enabled', e?.target?.checked)}
          />

          {integrations?.accounting?.enabled && (
            <div className="ml-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Provedor"
                  options={accountingProviders}
                  value={integrations?.accounting?.provider}
                  onChange={(value) => handleIntegrationChange('accounting', 'provider', value)}
                />

                <Select
                  label="Frequência de Sincronização"
                  options={syncFrequencyOptions}
                  value={integrations?.accounting?.syncFrequency}
                  onChange={(value) => handleIntegrationChange('accounting', 'syncFrequency', value)}
                />
              </div>

              <Input
                label="Endpoint da API"
                type="url"
                value={integrations?.accounting?.apiEndpoint}
                onChange={(e) => handleIntegrationChange('accounting', 'apiEndpoint', e?.target?.value)}
                placeholder="https://api.exemplo.com/v1"
              />

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Última Sincronização</p>
                  <p className="text-sm text-muted-foreground">
                    {formatLastSync(integrations?.accounting?.lastSync)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestConnection('accounting')}
                    iconName="Zap"
                    iconPosition="left"
                  >
                    Testar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSyncNow('accounting')}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Sincronizar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Supplier Integration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="Truck" size={20} className="text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Sistema de Fornecedores</h3>
              <p className="text-sm text-muted-foreground">Integração com fornecedores de ingredientes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Icon
              name={getStatusIcon(integrations?.suppliers?.status)}
              size={16}
              className={getStatusColor(integrations?.suppliers?.status)}
            />
            <span className={`text-sm font-medium ${getStatusColor(integrations?.suppliers?.status)}`}>
              {integrations?.suppliers?.status === 'connected' ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <Checkbox
            label="Habilitar Integração com Fornecedores"
            description="Receber atualizações de preços e disponibilidade"
            checked={integrations?.suppliers?.enabled}
            onChange={(e) => handleIntegrationChange('suppliers', 'enabled', e?.target?.checked)}
          />

          {integrations?.suppliers?.enabled && (
            <div className="ml-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Frequência de Sincronização"
                  options={syncFrequencyOptions}
                  value={integrations?.suppliers?.syncFrequency}
                  onChange={(value) => handleIntegrationChange('suppliers', 'syncFrequency', value)}
                />
              </div>

              <Input
                label="Endpoint da API"
                type="url"
                value={integrations?.suppliers?.apiEndpoint}
                onChange={(e) => handleIntegrationChange('suppliers', 'apiEndpoint', e?.target?.value)}
                placeholder="https://api.fornecedor.com/v1"
              />

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Última Sincronização</p>
                  <p className="text-sm text-muted-foreground">
                    {formatLastSync(integrations?.suppliers?.lastSync)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestConnection('suppliers')}
                    iconName="Zap"
                    iconPosition="left"
                  >
                    Testar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSyncNow('suppliers')}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Sincronizar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile App Integration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Smartphone" size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Aplicativo Mobile</h3>
              <p className="text-sm text-muted-foreground">Configurações do app para produção</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Icon
              name={getStatusIcon(integrations?.mobile?.status)}
              size={16}
              className={getStatusColor(integrations?.mobile?.status)}
            />
            <span className={`text-sm font-medium ${getStatusColor(integrations?.mobile?.status)}`}>
              {integrations?.mobile?.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <Checkbox
            label="Habilitar App Mobile"
            description="Permitir acesso via aplicativo móvel"
            checked={integrations?.mobile?.enabled}
            onChange={(e) => handleIntegrationChange('mobile', 'enabled', e?.target?.checked)}
          />

          {integrations?.mobile?.enabled && (
            <div className="ml-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Checkbox
                  label="Notificações Push"
                  description="Enviar alertas para dispositivos móveis"
                  checked={integrations?.mobile?.pushNotifications}
                  onChange={(e) => handleIntegrationChange('mobile', 'pushNotifications', e?.target?.checked)}
                />

                <Checkbox
                  label="Sincronização Offline"
                  description="Permitir uso sem conexão com internet"
                  checked={integrations?.mobile?.offlineSync}
                  onChange={(e) => handleIntegrationChange('mobile', 'offlineSync', e?.target?.checked)}
                />
              </div>

              <div className="p-4 bg-success/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">API Versão {integrations?.mobile?.apiVersion}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Aplicativo funcionando normalmente. Última atualização: hoje às 10:30
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* POS Integration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CreditCard" size={20} className="text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Sistema de Vendas (POS)</h3>
              <p className="text-sm text-muted-foreground">Integração com ponto de venda</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Icon
              name={getStatusIcon(integrations?.pos?.status)}
              size={16}
              className={getStatusColor(integrations?.pos?.status)}
            />
            <span className={`text-sm font-medium ${getStatusColor(integrations?.pos?.status)}`}>
              {integrations?.pos?.status === 'connected' ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <Checkbox
            label="Habilitar Integração POS"
            description="Sincronizar vendas com controle de estoque"
            checked={integrations?.pos?.enabled}
            onChange={(e) => handleIntegrationChange('pos', 'enabled', e?.target?.checked)}
          />

          {integrations?.pos?.enabled && (
            <div className="ml-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Provedor POS"
                  options={posProviders}
                  value={integrations?.pos?.provider}
                  onChange={(value) => handleIntegrationChange('pos', 'provider', value)}
                />

                <Select
                  label="Frequência de Sincronização"
                  options={syncFrequencyOptions}
                  value={integrations?.pos?.syncFrequency}
                  onChange={(value) => handleIntegrationChange('pos', 'syncFrequency', value)}
                />
              </div>

              <Input
                label="Endpoint da API"
                type="url"
                value={integrations?.pos?.apiEndpoint}
                onChange={(e) => handleIntegrationChange('pos', 'apiEndpoint', e?.target?.value)}
                placeholder="https://api.pos.com/v2"
              />

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Última Sincronização</p>
                  <p className="text-sm text-muted-foreground">
                    {formatLastSync(integrations?.pos?.lastSync)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestConnection('pos')}
                    iconName="Zap"
                    iconPosition="left"
                  >
                    Testar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSyncNow('pos')}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Sincronizar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          iconName="Download"
          iconPosition="left"
        >
          Exportar Configurações
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
            Salvar Integrações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTab;