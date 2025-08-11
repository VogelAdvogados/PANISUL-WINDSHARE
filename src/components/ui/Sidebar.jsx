import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isOpen, isCollapsed, onToggleCollapse, ChefHat, ShoppingCart, DollarSign, Users, Package, BookOpen, ClipboardList, Activity, Settings, Truck, navigationItems }) => {
  const location = useLocation();

  const navigation = [
  // Simplified navigation for bakery
  {
    name: 'Lançamento de Produção',
    href: '/simple-production',
    icon: ChefHat,
    description: 'Registre a produção de pães de forma simples'
  },
  {
    name: 'Gestão de Vendas',
    href: '/sales-management',
    icon: ShoppingCart,
    description: 'Controle vendas, trocas e estoque'
  },
  {
    name: 'Controle Financeiro',
    href: '/financial-control',
    icon: DollarSign,
    description: 'Contas a pagar, receber e movimentações'
  },
  {
    name: 'Histórico de Clientes',
    href: '/customer-history',
    icon: Users,
    description: 'Histórico de compras e trocas por cliente'
  },
  // Separator
  {
    name: 'separator',
    type: 'separator'
  },
  // Legacy complex features
  {
    name: 'Sistema Completo',
    type: 'section',
    description: 'Funcionalidades avançadas (para referência)'
  },
  {
    name: 'Painel de Inventário',
    href: '/inventory-management-dashboard',
    icon: Package,
    description: 'Controle avançado de estoque'
  },
  {
    name: 'Receitas',
    href: '/recipe-management-system',
    icon: BookOpen,
    description: 'Sistema de receitas e ingredientes'
  },
  {
    name: 'Produção Avançada',
    href: '/production-logging-interface',
    icon: ClipboardList,
    description: 'Sistema complexo de produção'
  },
  {
    name: 'Dashboard Produção',
    href: '/production-dashboard',
    icon: Activity,
    description: 'Métricas e monitoramento'
  },
  {
    name: 'Configurações',
    href: '/system-configuration-panel',
    icon: Settings,
    description: 'Configurações do sistema'
  },
  {
    name: 'Pedidos de Compra',
    href: '/purchase-order-management',
    icon: Truck,
    description: 'Gestão de fornecedores'
  }];


  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const Logo = () =>
  <div className="flex items-center gap-3 px-4 py-6 border-b border-border">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon name="Wheat" size={20} className="text-primary-foreground" />
      </div>
      {!isCollapsed &&
    <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">BreadCraft</h1>
          <p className="text-xs text-muted-foreground truncate">Manager</p>
        </div>
    }
    </div>;


  const NavigationSection = ({ section, items }) =>
  <div className="mb-6">
      {!isCollapsed &&
    <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {section}
        </h3>
    }
      <nav className="space-y-1 px-2">
        {items?.map((item) =>
      <Link
        key={item?.path}
        to={item?.path}
        className={`nav-item animate-press ${
        isActivePath(item?.path) ? 'active' : ''}`
        }
        title={isCollapsed ? item?.label : undefined}>

            <Icon
          name={item?.icon}
          size={20}
          className="nav-icon flex-shrink-0" />

            {!isCollapsed &&
        <span className="font-medium truncate">{item?.label}</span>
        }
          </Link>
      )}
      </nav>
    </div>;


  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`sidebar transition-all duration-300 ease-out ${
        isCollapsed ? 'sidebar-collapsed' : ''} ${

        isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`
        }>

        <Logo />

        <div className="flex-1 overflow-y-auto py-4">
          {navigationItems?.map((section) =>
          <NavigationSection
            key={section?.section}
            section={section?.section}
            items={section?.items} />

          )}
        </div>

        {/* Collapse Toggle - Desktop Only */}
        <div className="hidden lg:block p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full justify-center"
            iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
            iconSize={16}>

            {!isCollapsed && "Recolher"}
          </Button>
        </div>
      </aside>
      {/* Mobile Navigation */}
      <nav className="mobile-nav lg:hidden">
        {navigationItems?.slice(0, 4)?.map((section) =>
        section?.items?.map((item) =>
        <Link
          key={item?.path}
          to={item?.path}
          className={`mobile-nav-item animate-press ${
          isActivePath(item?.path) ? 'active' : ''}`
          }>

              <Icon name={item?.icon} size={20} />
              <span className="mobile-nav-label">{item?.label?.split(' ')?.[0]}</span>
            </Link>
        )
        )}
      </nav>
      {/* Mobile Overlay */}
      {isOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        onClick={() => {}} />

      }
    </>);

};

export default Sidebar;