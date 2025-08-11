import React, { useState } from 'react';
import Icon from '../../components/AppIcon';

import ConfigurationHeader from './components/ConfigurationHeader';
import GeneralSettingsTab from './components/GeneralSettingsTab';
import InventoryParametersTab from './components/InventoryParametersTab';
import ProductionRulesTab from './components/ProductionRulesTab';
import IntegrationTab from './components/IntegrationTab';
import SecurityPoliciesTab from './components/SecurityPoliciesTab';

const SystemConfigurationPanel = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [lastBackup] = useState('2025-08-04T08:00:00');

  const tabs = [
    {
      id: 'general',
      label: 'Configurações Gerais',
      icon: 'Settings',
      component: GeneralSettingsTab
    },
    {
      id: 'inventory',
      label: 'Parâmetros de Estoque',
      icon: 'Package',
      component: InventoryParametersTab
    },
    {
      id: 'production',
      label: 'Regras de Produção',
      icon: 'Factory',
      component: ProductionRulesTab
    },
    {
      id: 'integration',
      label: 'Integrações',
      icon: 'Link',
      component: IntegrationTab
    },
    {
      id: 'security',
      label: 'Políticas de Segurança',
      icon: 'Shield',
      component: SecurityPoliciesTab
    }
  ];

  const handleBackup = () => {
    console.log('Iniciando backup das configurações...');
    // Mock backup functionality
  };

  const handleRestore = () => {
    console.log('Iniciando restauração das configurações...');
    // Mock restore functionality
  };

  const ActiveComponent = tabs?.find(tab => tab?.id === activeTab)?.component || GeneralSettingsTab;

  return (
    <div className="min-h-screen bg-background">
      <div className="content-with-sidebar lg:content-with-sidebar-collapsed">
        <div className="content-with-mobile-nav lg:ml-0">
          <div className="p-6 pt-20 lg:pt-6">
            <ConfigurationHeader
              onBackup={handleBackup}
              onRestore={handleRestore}
              lastBackup={lastBackup}
            />

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-border">
                <div className="flex overflow-x-auto">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center gap-3 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                        activeTab === tab?.id
                          ? 'text-primary border-primary bg-primary/5' :'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon name={tab?.icon} size={18} />
                      <span className="hidden sm:inline">{tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <ActiveComponent />
              </div>
            </div>

            {/* System Information Footer */}
            <div className="mt-8 bg-card rounded-lg border border-border p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center">
                    <Icon name="Info" size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">BreadCraft Manager v2.1.0</h3>
                    <p className="text-xs text-muted-foreground">
                      Sistema de gestão para padarias • Última atualização: 04/08/2025
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Sistema Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Database" size={14} />
                    <span>Banco: Conectado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Wifi" size={14} />
                    <span>API: Ativa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigurationPanel;