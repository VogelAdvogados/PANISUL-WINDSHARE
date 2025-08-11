import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ onMenuToggle, isSidebarCollapsed = false }) => {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getPageTitle = () => {
    const pathTitles = {
      '/production-dashboard': 'Dashboard de Produção',
      '/production-logging-interface': 'Registro de Produção',
      '/recipe-management-system': 'Gestão de Receitas',
      '/inventory-management-dashboard': 'Dashboard de Estoque',
      '/purchase-order-management': 'Gestão de Pedidos',
      '/system-configuration-panel': 'Configurações do Sistema'
    };
    return pathTitles?.[location.pathname] || 'BreadCraft Manager';
  };

  const getCurrentUser = () => {
    return {
      name: 'Maria Silva',
      role: 'Gerente de Produção',
      avatar: '/assets/images/user-avatar.png'
    };
  };

  const user = getCurrentUser();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section - Menu Toggle & Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
            iconName="Menu"
            iconSize={20}
          >
            <span className="sr-only">Toggle menu</span>
          </Button>

          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-foreground truncate">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right Section - User Menu */}
        <div className="flex items-center gap-3">
          {/* Sync Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success text-sm rounded-lg">
            <Icon name="Wifi" size={14} />
            <span className="font-medium">Sincronizado</span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 h-auto"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-primary" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-foreground">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.role}</div>
              </div>
              <Icon
                name="ChevronDown"
                size={16}
                className={`text-muted-foreground transition-transform duration-200 ${
                  showUserMenu ? 'rotate-180' : ''
                }`}
              />
            </Button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 animate-scale-in">
                <div className="p-3 border-b border-border">
                  <div className="font-medium text-foreground">{user?.name}</div>
                  <div className="text-sm text-muted-foreground">{user?.role}</div>
                </div>

                <div className="p-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                    <Icon name="User" size={16} />
                    Meu Perfil
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                    <Icon name="Settings" size={16} />
                    Configurações
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                    <Icon name="HelpCircle" size={16} />
                    Ajuda
                  </button>
                  <div className="border-t border-border my-1"></div>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors">
                    <Icon name="LogOut" size={16} />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;