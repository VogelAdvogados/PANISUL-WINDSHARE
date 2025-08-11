import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfigurationHeader = ({ onBackup, onRestore, lastBackup }) => {
  const formatLastBackup = (timestamp) => {
    if (!timestamp) return 'Nunca';
    const date = new Date(timestamp);
    return `${date?.toLocaleDateString('pt-BR')} às ${date?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configurações do Sistema</h1>
            <p className="text-muted-foreground">
              Gerencie parâmetros operacionais, integrações e políticas de segurança
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Clock" size={14} />
              <span>Último backup:</span>
            </div>
            <span className="font-medium">{formatLastBackup(lastBackup)}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBackup}
              iconName="Download"
              iconPosition="left"
            >
              Backup
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRestore}
              iconName="Upload"
              iconPosition="left"
            >
              Restaurar
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <div>
            <p className="text-sm font-medium text-foreground">Sistema Operacional</p>
            <p className="text-xs text-muted-foreground">Todas as configurações ativas</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
          <Icon name="AlertTriangle" size={20} className="text-warning" />
          <div>
            <p className="text-sm font-medium text-foreground">2 Integrações Pendentes</p>
            <p className="text-xs text-muted-foreground">Requer configuração</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
          <Icon name="Users" size={20} className="text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">5 Usuários Ativos</p>
            <p className="text-xs text-muted-foreground">Com diferentes permissões</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationHeader;