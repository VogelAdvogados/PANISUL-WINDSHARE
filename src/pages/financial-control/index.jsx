import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const FinancialControl = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Financial Data
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Caixa', type: 'cash', balance: 1250.00 },
    { id: 2, name: 'Conta Bancária - PIX', type: 'bank', balance: 3780.50 }
  ]);

  const [receivables, setReceivables] = useState([
    {
      id: 1,
      customer: 'Mercadinho da Maria',
      amount: 375.00,
      dueDate: '2025-08-06',
      description: 'Venda de Pão Baguete - 150 unidades',
      status: 'pending'
    },
    {
      id: 2,
      customer: 'Padaria do Centro',
      amount: 825.00,
      dueDate: '2025-08-08',
      description: 'Venda de Pães Diversos',
      status: 'pending'
    }
  ]);

  const [payables, setPayables] = useState([
    {
      id: 1,
      supplier: 'Moinho São Paulo',
      amount: 850.00,
      dueDate: '2025-08-10',
      description: 'Compra de Farinha de Trigo - 50kg',
      status: 'pending'
    },
    {
      id: 2,
      supplier: 'Distribuidora ABC',
      amount: 450.00,
      dueDate: '2025-08-12',
      description: 'Ingredientes Diversos',
      status: 'pending'
    }
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'income',
      description: 'Venda - Mercado do Seu Zé',
      amount: 750.00,
      account: 'Caixa',
      date: '2025-08-04',
      time: '14:00'
    },
    {
      id: 2,
      type: 'expense',
      description: 'Compra de Fermento',
      amount: 120.00,
      account: 'Caixa',
      date: '2025-08-04',
      time: '10:30'
    }
  ]);

  const [transactionForm, setTransactionForm] = useState({
    type: 'income',
    description: '',
    amount: '',
    account: 'Caixa',
    date: new Date()?.toISOString()?.split('T')?.[0],
    time: new Date()?.toTimeString()?.slice(0, 5)
  });

  const transactionTypes = [
    { value: 'income', label: 'Receita' },
    { value: 'expense', label: 'Despesa' }
  ];

  const accountOptions = accounts?.map(account => ({
    value: account?.name,
    label: account?.name
  }));

  const handleTransactionSubmit = (e) => {
    e?.preventDefault();
    if (!transactionForm?.description || !transactionForm?.amount) return;

    const amount = parseFloat(transactionForm?.amount);
    const newTransaction = {
      id: Date.now(),
      ...transactionForm,
      amount
    };

    setTransactions([newTransaction, ...transactions]);

    // Update account balance
    setAccounts(prev =>
      prev?.map(account => {
        if (account?.name === transactionForm?.account) {
          const newBalance = transactionForm?.type === 'income'
            ? account?.balance + amount
            : account?.balance - amount;
          return { ...account, balance: newBalance };
        }
        return account;
      })
    );

    setTransactionForm({
      type: 'income',
      description: '',
      amount: '',
      account: 'Caixa',
      date: new Date()?.toISOString()?.split('T')?.[0],
      time: new Date()?.toTimeString()?.slice(0, 5)
    });
  };

  const markAsReceived = (receivableId) => {
    const receivable = receivables?.find(r => r?.id === receivableId);
    if (receivable) {
      // Add transaction
      const newTransaction = {
        id: Date.now(),
        type: 'income',
        description: `Recebimento - ${receivable?.customer}`,
        amount: receivable?.amount,
        account: 'Conta Bancária - PIX',
        date: new Date()?.toISOString()?.split('T')?.[0],
        time: new Date()?.toTimeString()?.slice(0, 5)
      };
      setTransactions([newTransaction, ...transactions]);

      // Update account balance
      setAccounts(prev =>
        prev?.map(account =>
          account?.name === 'Conta Bancária - PIX'
            ? { ...account, balance: account?.balance + receivable?.amount }
            : account
        )
      );

      // Remove from receivables
      setReceivables(prev => prev?.filter(r => r?.id !== receivableId));
    }
  };

  const markAsPaid = (payableId) => {
    const payable = payables?.find(p => p?.id === payableId);
    if (payable) {
      // Add transaction
      const newTransaction = {
        id: Date.now(),
        type: 'expense',
        description: `Pagamento - ${payable?.supplier}`,
        amount: payable?.amount,
        account: 'Conta Bancária - PIX',
        date: new Date()?.toISOString()?.split('T')?.[0],
        time: new Date()?.toTimeString()?.slice(0, 5)
      };
      setTransactions([newTransaction, ...transactions]);

      // Update account balance
      setAccounts(prev =>
        prev?.map(account =>
          account?.name === 'Conta Bancária - PIX'
            ? { ...account, balance: account?.balance - payable?.amount }
            : account
        )
      );

      // Remove from payables
      setPayables(prev => prev?.filter(p => p?.id !== payableId));
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('pt-BR');
  };

  const getTotalBalance = () => {
    return accounts?.reduce((sum, account) => sum + account?.balance, 0);
  };

  const getTotalReceivables = () => {
    return receivables?.reduce((sum, receivable) => sum + receivable?.amount, 0);
  };

  const getTotalPayables = () => {
    return payables?.reduce((sum, payable) => sum + payable?.amount, 0);
  };

  return (
    <>
      <Helmet>
        <title>Controle Financeiro - Padaria Simples</title>
        <meta name="description" content="Controle financeiro simples para padaria" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header
          onMenuToggle={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />

        <main className={`pt-16 transition-all duration-300 ${
          isSidebarCollapsed ? 'content-with-sidebar-collapsed' : 'content-with-sidebar'
        } content-with-mobile-nav`}>
          <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Controle Financeiro</h1>
              <p className="text-muted-foreground">Gestão simples das finanças da padaria</p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-muted/20 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'overview' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Visão Geral
                </button>
                <button
                  onClick={() => setActiveTab('receivables')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'receivables' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  A Receber
                </button>
                <button
                  onClick={() => setActiveTab('payables')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'payables' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  A Pagar
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'transactions' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Movimentações
                </button>
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Saldo Total</h3>
                      <Icon name="Wallet" size={20} className="text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(getTotalBalance())}
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">A Receber</h3>
                      <Icon name="TrendingUp" size={20} className="text-success" />
                    </div>
                    <div className="text-2xl font-bold text-success">
                      {formatCurrency(getTotalReceivables())}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {receivables?.length} pendência(s)
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">A Pagar</h3>
                      <Icon name="TrendingDown" size={20} className="text-error" />
                    </div>
                    <div className="text-2xl font-bold text-error">
                      {formatCurrency(getTotalPayables())}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {payables?.length} pendência(s)
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Saldo Projetado</h3>
                      <Icon name="Calculator" size={20} className="text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(getTotalBalance() + getTotalReceivables() - getTotalPayables())}
                    </div>
                  </div>
                </div>

                {/* Account Balances */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="CreditCard" size={24} className="text-primary" />
                    Saldo por Conta
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {accounts?.map((account) => (
                      <div key={account?.id} className="p-4 bg-muted/20 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">{account?.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{account?.type === 'cash' ? 'Dinheiro' : 'Banco'}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-foreground">
                              {formatCurrency(account?.balance)}
                            </div>
                            <Icon
                              name={account?.type === 'cash' ? 'Banknote' : 'Building2'}
                              size={16}
                              className="text-muted-foreground ml-auto"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Receivables Tab */}
            {activeTab === 'receivables' && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} className="text-success" />
                  Contas a Receber
                </h2>

                <div className="space-y-4">
                  {receivables?.map((receivable) => (
                    <div key={receivable?.id} className="p-4 bg-muted/20 rounded-lg border border-border/50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{receivable?.customer}</h3>
                          <p className="text-sm text-muted-foreground">{receivable?.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-success">
                            {formatCurrency(receivable?.amount)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Venc: {formatDate(receivable?.dueDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsReceived(receivable?.id)}
                          iconName="Check"
                          iconPosition="left"
                        >
                          Marcar como Recebido
                        </Button>
                      </div>
                    </div>
                  ))}

                  {receivables?.length === 0 && (
                    <div className="text-center py-8">
                      <Icon name="CheckCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Nenhuma conta a receber</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payables Tab */}
            {activeTab === 'payables' && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Icon name="TrendingDown" size={24} className="text-error" />
                  Contas a Pagar
                </h2>

                <div className="space-y-4">
                  {payables?.map((payable) => (
                    <div key={payable?.id} className="p-4 bg-muted/20 rounded-lg border border-border/50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{payable?.supplier}</h3>
                          <p className="text-sm text-muted-foreground">{payable?.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-error">
                            {formatCurrency(payable?.amount)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Venc: {formatDate(payable?.dueDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsPaid(payable?.id)}
                          iconName="Check"
                          iconPosition="left"
                        >
                          Marcar como Pago
                        </Button>
                      </div>
                    </div>
                  ))}

                  {payables?.length === 0 && (
                    <div className="text-center py-8">
                      <Icon name="CheckCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Nenhuma conta a pagar</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transaction Form */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Icon name="Plus" size={24} className="text-primary" />
                    Nova Movimentação
                  </h2>

                  <form onSubmit={handleTransactionSubmit} className="space-y-4">
                    <Select
                      label="Tipo"
                      options={transactionTypes}
                      value={transactionForm?.type}
                      onChange={(value) => setTransactionForm(prev => ({ ...prev, type: value }))}
                      required
                    />

                    <Input
                      label="Descrição"
                      type="text"
                      placeholder="Ex: Venda de pães, Compra de ingredientes..."
                      value={transactionForm?.description}
                      onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e?.target?.value }))}
                      required
                    />

                    <Input
                      label="Valor (R$)"
                      type="number"
                      step="0.01"
                      placeholder="Ex: 150.00"
                      value={transactionForm?.amount}
                      onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e?.target?.value }))}
                      required
                    />

                    <Select
                      label="Conta"
                      options={accountOptions}
                      value={transactionForm?.account}
                      onChange={(value) => setTransactionForm(prev => ({ ...prev, account: value }))}
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Data"
                        type="date"
                        value={transactionForm?.date}
                        onChange={(e) => setTransactionForm(prev => ({ ...prev, date: e?.target?.value }))}
                        required
                      />

                      <Input
                        label="Horário"
                        type="time"
                        value={transactionForm?.time}
                        onChange={(e) => setTransactionForm(prev => ({ ...prev, time: e?.target?.value }))}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      iconName="Save"
                      iconPosition="left"
                    >
                      Registrar Movimentação
                    </Button>
                  </form>
                </div>

                {/* Recent Transactions */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Icon name="History" size={24} className="text-primary" />
                    Movimentações Recentes
                  </h2>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {transactions?.map((transaction) => (
                      <div key={transaction?.id} className="p-4 bg-muted/20 rounded-lg border border-border/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon
                                name={transaction?.type === 'income' ? 'TrendingUp' : 'TrendingDown'}
                                size={16}
                                className={transaction?.type === 'income' ? 'text-success' : 'text-error'}
                              />
                              <span className="text-sm font-medium text-muted-foreground">
                                {transaction?.type === 'income' ? 'Receita' : 'Despesa'}
                              </span>
                            </div>
                            <h3 className="font-medium text-foreground">{transaction?.description}</h3>
                            <p className="text-sm text-muted-foreground">{transaction?.account}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              transaction?.type === 'income' ? 'text-success' : 'text-error'
                            }`}>
                              {transaction?.type === 'income' ? '+' : '-'}{formatCurrency(transaction?.amount)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {transaction?.time} - {formatDate(transaction?.date)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {transactions?.length === 0 && (
                      <div className="text-center py-8">
                        <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhuma movimentação registrada</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default FinancialControl;