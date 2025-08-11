import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ProductionQueue from './components/ProductionQueue';
import LiveMetrics from './components/LiveMetrics';
import AlertsPanel from './components/AlertsPanel';
import QuickActions from './components/QuickActions';
import SystemStatus from './components/SystemStatus';
import Icon from '../../components/AppIcon';

const ProductionDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.target?.tagName === 'INPUT' || event.target?.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key) {
        case ' ':
          event.preventDefault();
          // Trigger batch status update
          break;
        case 'n': case'N':
          event.preventDefault();
          // Trigger new production note
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const formatCurrentDateTime = () => {
    return currentTime.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard de Produção - BreadCraft Manager</title>
        <meta name="description" content="Central de comando para operações diárias da padaria com visibilidade em tempo real do status de produção, níveis de estoque e métricas de eficiência." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header
          onMenuToggle={handleMenuToggle}
          isSidebarCollapsed={sidebarCollapsed}
        />

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
        />

        {/* Main Content */}
        <main className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        } pb-20 lg:pb-0`}>
          <div className="p-4 lg:p-6">
            {/* Dashboard Header */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    Dashboard de Produção
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={16} />
                      <span>{formatCurrentDateTime()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={16} />
                      <span>{formatCurrentTime()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-success/10 text-success rounded-lg">
                    <Icon name="Wifi" size={16} />
                    <span className="text-sm font-medium">Sistema Sincronizado</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg">
                    <Icon name="User" size={16} />
                    <span className="text-sm font-medium">Gerente de Produção</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Panel - Production Queue */}
              <div className="lg:col-span-3">
                <ProductionQueue />
              </div>

              {/* Center Panel - Live Metrics */}
              <div className="lg:col-span-6">
                <LiveMetrics />
              </div>

              {/* Right Panel - Alerts */}
              <div className="lg:col-span-3">
                <AlertsPanel />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Quick Actions */}
              <QuickActions />

              {/* System Status */}
              <SystemStatus />
            </div>

            {/* Performance Summary */}
            <div className="mt-6 bg-card rounded-lg border border-border p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Resumo de Performance</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon name="Target" size={20} className="text-success" />
                    <span className="text-2xl font-bold text-success">98%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Meta de Produção</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon name="TrendingUp" size={20} className="text-accent" />
                    <span className="text-2xl font-bold text-accent">87%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Eficiência</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon name="DollarSign" size={20} className="text-primary" />
                    <span className="text-2xl font-bold text-primary">R$ 2.450</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Receita Hoje</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon name="Package" size={20} className="text-warning" />
                    <span className="text-2xl font-bold text-warning">142kg</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Ingredientes Usados</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductionDashboard;