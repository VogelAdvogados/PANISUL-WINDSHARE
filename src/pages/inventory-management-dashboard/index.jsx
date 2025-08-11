import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import InventoryMetrics from './components/InventoryMetrics';
import InventoryFilters from './components/InventoryFilters';
import InventoryTable from './components/InventoryTable';
import QuickActions from './components/QuickActions';

const InventoryManagementDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({});

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case 'f':
            event.preventDefault();
            // Focus search input
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) searchInput?.focus();
            break;
          case 'n':
            event.preventDefault();
            console.log('Novo ajuste de estoque');
            break;
          case 'e':
            event.preventDefault();
            console.log('Exportar dados');
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard de Estoque - BreadCraft Manager</title>
        <meta name="description" content="Gerencie o estoque de ingredientes da sua padaria com visibilidade completa sobre níveis de estoque, fornecedores e prazos de validade." />
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
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard de Estoque
              </h1>
              <p className="text-muted-foreground">
                Gerencie ingredientes, monitore níveis de estoque e controle fornecedores
              </p>
            </div>

            {/* Metrics Section */}
            <InventoryMetrics />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                <InventoryFilters
                  onFiltersChange={handleFiltersChange}
                  activeFilters={filters}
                />
                <div className="hidden xl:block">
                  <QuickActions />
                </div>
              </div>

              {/* Inventory Table */}
              <div className="xl:col-span-3">
                <InventoryTable filters={filters} />
              </div>
            </div>

            {/* Mobile Quick Actions */}
            <div className="xl:hidden mt-6">
              <QuickActions />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default InventoryManagementDashboard;