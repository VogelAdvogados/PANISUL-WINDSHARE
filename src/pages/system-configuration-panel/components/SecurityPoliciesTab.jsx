import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import { Checkbox } from '../../../components/ui/Checkbox';

const SecurityPoliciesTab = () => {
  const [policies, setPolicies] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiration: 90,
      preventReuse: 5
    },
    sessionManagement: {
      sessionTimeout: 30,
      maxConcurrentSessions: 3,
      autoLogoutEnabled: true,
      rememberMeEnabled: true,
      rememberMeDuration: 7
    },
    accessControl: {
      roleBasedAccess: true,
      twoFactorAuth: false,
      ipWhitelisting: false,
      allowedIPs: '',
      auditLogging: true,
      failedLoginAttempts: 5,
      lockoutDuration: 15
    },
    dataProtection: {
      encryptionEnabled: true,
      backupEncryption: true,
      dataRetentionDays: 365,
      anonymizeData: false,
      gdprCompliance: true,
      dataExportEnabled: true
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handlePolicyChange = (category, field, value) => {
    setPolicies(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Salvando políticas de segurança:', policies);
    setHasChanges(false);
  };

  const handleReset = () => {
    setPolicies({
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        passwordExpiration: 90,
        preventReuse: 5
      },
      sessionManagement: {
        sessionTimeout: 30,
        maxConcurrentSessions: 3,
        autoLogoutEnabled: true,
        rememberMeEnabled: true,
        rememberMeDuration: 7
      },
      accessControl: {
        roleBasedAccess: true,
        twoFactorAuth: false,
        ipWhitelisting: false,
        allowedIPs: '',
        auditLogging: true,
        failedLoginAttempts: 5,
        lockoutDuration: 15
      },
      dataProtection: {
        encryptionEnabled: true,
        backupEncryption: true,
        dataRetentionDays: 365,
        anonymizeData: false,
        gdprCompliance: true,
        dataExportEnabled: true
      }
    });
    setHasChanges(false);
  };

  const getPasswordStrength = () => {
    const { passwordPolicy } = policies;
    let strength = 0;

    if (passwordPolicy?.minLength >= 8) strength += 20;
    if (passwordPolicy?.requireUppercase) strength += 20;
    if (passwordPolicy?.requireLowercase) strength += 20;
    if (passwordPolicy?.requireNumbers) strength += 20;
    if (passwordPolicy?.requireSpecialChars) strength += 20;

    if (strength >= 80) return { level: 'Forte', color: 'text-success' };
    if (strength >= 60) return { level: 'Média', color: 'text-warning' };
    return { level: 'Fraca', color: 'text-error' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="space-y-8">
      {/* Password Policy */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Lock" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Política de Senhas</h3>
            <p className="text-sm text-muted-foreground">Configure requisitos de segurança para senhas</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Comprimento Mínimo"
              type="number"
              value={policies?.passwordPolicy?.minLength}
              onChange={(e) => handlePolicyChange('passwordPolicy', 'minLength', parseInt(e?.target?.value))}
              description="Número mínimo de caracteres"
              min="6"
              max="20"
              required
            />

            <Input
              label="Expiração da Senha (dias)"
              type="number"
              value={policies?.passwordPolicy?.passwordExpiration}
              onChange={(e) => handlePolicyChange('passwordPolicy', 'passwordExpiration', parseInt(e?.target?.value))}
              description="Quantos dias até a senha expirar"
              min="30"
              max="365"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Checkbox
                label="Exigir Letras Maiúsculas"
                description="Pelo menos uma letra maiúscula"
                checked={policies?.passwordPolicy?.requireUppercase}
                onChange={(e) => handlePolicyChange('passwordPolicy', 'requireUppercase', e?.target?.checked)}
              />

              <Checkbox
                label="Exigir Letras Minúsculas"
                description="Pelo menos uma letra minúscula"
                checked={policies?.passwordPolicy?.requireLowercase}
                onChange={(e) => handlePolicyChange('passwordPolicy', 'requireLowercase', e?.target?.checked)}
              />
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Exigir Números"
                description="Pelo menos um dígito numérico"
                checked={policies?.passwordPolicy?.requireNumbers}
                onChange={(e) => handlePolicyChange('passwordPolicy', 'requireNumbers', e?.target?.checked)}
              />

              <Checkbox
                label="Exigir Caracteres Especiais"
                description="Pelo menos um símbolo (!@#$%)"
                checked={policies?.passwordPolicy?.requireSpecialChars}
                onChange={(e) => handlePolicyChange('passwordPolicy', 'requireSpecialChars', e?.target?.checked)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">Força da Política Atual</p>
              <p className="text-sm text-muted-foreground">Baseada nos requisitos configurados</p>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${passwordStrength?.color}`}>
                {passwordStrength?.level}
              </span>
            </div>
          </div>

          <Input
            label="Prevenir Reutilização"
            type="number"
            value={policies?.passwordPolicy?.preventReuse}
            onChange={(e) => handlePolicyChange('passwordPolicy', 'preventReuse', parseInt(e?.target?.value))}
            description="Quantas senhas anteriores não podem ser reutilizadas"
            min="0"
            max="10"
            className="max-w-xs"
          />
        </div>
      </div>
      {/* Session Management */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Gerenciamento de Sessão</h3>
            <p className="text-sm text-muted-foreground">Configure tempo limite e controle de sessões</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Tempo Limite da Sessão (minutos)"
              type="number"
              value={policies?.sessionManagement?.sessionTimeout}
              onChange={(e) => handlePolicyChange('sessionManagement', 'sessionTimeout', parseInt(e?.target?.value))}
              description="Tempo de inatividade antes do logout automático"
              min="5"
              max="480"
              required
            />

            <Input
              label="Máximo de Sessões Simultâneas"
              type="number"
              value={policies?.sessionManagement?.maxConcurrentSessions}
              onChange={(e) => handlePolicyChange('sessionManagement', 'maxConcurrentSessions', parseInt(e?.target?.value))}
              description="Quantas sessões por usuário"
              min="1"
              max="10"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Checkbox
              label="Logout Automático"
              description="Desconectar automaticamente após inatividade"
              checked={policies?.sessionManagement?.autoLogoutEnabled}
              onChange={(e) => handlePolicyChange('sessionManagement', 'autoLogoutEnabled', e?.target?.checked)}
            />

            <Checkbox
              label="Lembrar-me"
              description="Permitir que usuários mantenham login"
              checked={policies?.sessionManagement?.rememberMeEnabled}
              onChange={(e) => handlePolicyChange('sessionManagement', 'rememberMeEnabled', e?.target?.checked)}
            />
          </div>

          {policies?.sessionManagement?.rememberMeEnabled && (
            <Input
              label="Duração do 'Lembrar-me' (dias)"
              type="number"
              value={policies?.sessionManagement?.rememberMeDuration}
              onChange={(e) => handlePolicyChange('sessionManagement', 'rememberMeDuration', parseInt(e?.target?.value))}
              description="Por quantos dias manter o login"
              min="1"
              max="30"
              className="max-w-xs"
            />
          )}
        </div>
      </div>
      {/* Access Control */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Controle de Acesso</h3>
            <p className="text-sm text-muted-foreground">Configure permissões e autenticação</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Checkbox
              label="Controle Baseado em Funções"
              description="Usar sistema de permissões por função"
              checked={policies?.accessControl?.roleBasedAccess}
              onChange={(e) => handlePolicyChange('accessControl', 'roleBasedAccess', e?.target?.checked)}
            />

            <Checkbox
              label="Autenticação de Dois Fatores"
              description="Exigir segundo fator de autenticação"
              checked={policies?.accessControl?.twoFactorAuth}
              onChange={(e) => handlePolicyChange('accessControl', 'twoFactorAuth', e?.target?.checked)}
            />

            <Checkbox
              label="Lista Branca de IPs"
              description="Permitir acesso apenas de IPs específicos"
              checked={policies?.accessControl?.ipWhitelisting}
              onChange={(e) => handlePolicyChange('accessControl', 'ipWhitelisting', e?.target?.checked)}
            />

            <Checkbox
              label="Log de Auditoria"
              description="Registrar todas as ações dos usuários"
              checked={policies?.accessControl?.auditLogging}
              onChange={(e) => handlePolicyChange('accessControl', 'auditLogging', e?.target?.checked)}
            />
          </div>

          {policies?.accessControl?.ipWhitelisting && (
            <Input
              label="IPs Permitidos"
              type="text"
              value={policies?.accessControl?.allowedIPs}
              onChange={(e) => handlePolicyChange('accessControl', 'allowedIPs', e?.target?.value)}
              description="Lista de IPs separados por vírgula"
              placeholder="192.168.1.1, 10.0.0.1"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Tentativas de Login Falhadas"
              type="number"
              value={policies?.accessControl?.failedLoginAttempts}
              onChange={(e) => handlePolicyChange('accessControl', 'failedLoginAttempts', parseInt(e?.target?.value))}
              description="Quantas tentativas antes de bloquear"
              min="3"
              max="10"
              required
            />

            <Input
              label="Duração do Bloqueio (minutos)"
              type="number"
              value={policies?.accessControl?.lockoutDuration}
              onChange={(e) => handlePolicyChange('accessControl', 'lockoutDuration', parseInt(e?.target?.value))}
              description="Tempo de bloqueio após tentativas falhadas"
              min="5"
              max="60"
              required
            />
          </div>
        </div>
      </div>
      {/* Data Protection */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Database" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Proteção de Dados</h3>
            <p className="text-sm text-muted-foreground">Configure criptografia e retenção de dados</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Checkbox
              label="Criptografia de Dados"
              description="Criptografar dados sensíveis no banco"
              checked={policies?.dataProtection?.encryptionEnabled}
              onChange={(e) => handlePolicyChange('dataProtection', 'encryptionEnabled', e?.target?.checked)}
            />

            <Checkbox
              label="Criptografia de Backup"
              description="Criptografar arquivos de backup"
              checked={policies?.dataProtection?.backupEncryption}
              onChange={(e) => handlePolicyChange('dataProtection', 'backupEncryption', e?.target?.checked)}
            />

            <Checkbox
              label="Conformidade LGPD"
              description="Seguir diretrizes da Lei Geral de Proteção de Dados"
              checked={policies?.dataProtection?.gdprCompliance}
              onChange={(e) => handlePolicyChange('dataProtection', 'gdprCompliance', e?.target?.checked)}
            />

            <Checkbox
              label="Exportação de Dados"
              description="Permitir que usuários exportem seus dados"
              checked={policies?.dataProtection?.dataExportEnabled}
              onChange={(e) => handlePolicyChange('dataProtection', 'dataExportEnabled', e?.target?.checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Retenção de Dados (dias)"
              type="number"
              value={policies?.dataProtection?.dataRetentionDays}
              onChange={(e) => handlePolicyChange('dataProtection', 'dataRetentionDays', parseInt(e?.target?.value))}
              description="Por quanto tempo manter os dados"
              min="30"
              max="2555"
              required
            />

            <Checkbox
              label="Anonimizar Dados Antigos"
              description="Remover informações pessoais de dados antigos"
              checked={policies?.dataProtection?.anonymizeData}
              onChange={(e) => handlePolicyChange('dataProtection', 'anonymizeData', e?.target?.checked)}
            />
          </div>

          <div className="p-4 bg-warning/10 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning mb-1">Aviso de Conformidade</p>
                <p className="text-sm text-muted-foreground">
                  Certifique-se de que as configurações estão em conformidade com as leis locais de proteção de dados.
                  Consulte um especialista jurídico se necessário.
                </p>
              </div>
            </div>
          </div>
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
            Salvar Políticas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityPoliciesTab;