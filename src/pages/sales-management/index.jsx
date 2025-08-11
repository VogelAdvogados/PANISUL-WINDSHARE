import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const SalesManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('sales');

  // Mock production data
  const [availableProducts, setAvailableProducts] = useState([
    { name: 'Pão Baguete', quantity: 1000, price: 2.50 },
    { name: 'Pão Francês', quantity: 500, price: 0.80 },
    { name: 'Pão de Forma', quantity: 200, price: 4.50 },
    { name: 'Croissant', quantity: 150, price: 3.00 }
  ]);

  const [customers] = useState([
    { id: 1, name: 'Mercado do Seu Zé', type: 'business' },
    { id: 2, name: 'Mercadinho da Maria', type: 'business' },
    { id: 3, name: 'Mini Mercado da Joana', type: 'business' },
    { id: 4, name: 'Cliente Avulso', type: 'individual' }
  ]);

  const [sales, setSales] = useState([
    {
      id: 1,
      customerName: 'Mercado do Seu Zé',
      product: 'Pão Baguete',
      quantity: 300,
      unitPrice: 2.50,
      total: 750.00,
      paymentMethod: 'cash',
      date: '2025-08-04',
      time: '14:00',
      status: 'completed'
    },
    {
      id: 2,
      customerName: 'Mercadinho da Maria',
      product: 'Pão Baguete',
      quantity: 150,
      unitPrice: 2.50,
      total: 375.00,
      paymentMethod: 'credit',
      paymentDueDate: '2025-08-06',
      date: '2025-08-04',
      time: '14:35',
      status: 'pending'
    }
  ]);

  const [exchanges, setExchanges] = useState([
    {
      id: 1,
      customerName: 'Mini Mercado da Joana',
      product: 'Pão Francês',
      quantity: 5,
      reason: 'Produto com defeito',
      date: '2025-08-04',
      time: '15:20'
    }
  ]);

  const [saleForm, setSaleForm] = useState({
    customerName: '',
    product: '',
    quantity: '',
    unitPrice: '',
    paymentMethod: 'cash',
    paymentDueDate: ''
  });

  const [exchangeForm, setExchangeForm] = useState({
    customerName: '',
    product: '',
    quantity: '',
    reason: ''
  });

  const paymentMethods = [
    { value: 'cash', label: 'Dinheiro' },
    { value: 'pix', label: 'PIX' },
    { value: 'credit', label: 'A Prazo' }
  ];

  const exchangeReasons = [
    { value: 'Produto com defeito', label: 'Produto com defeito' },
    { value: 'Produto vencido', label: 'Produto vencido' },
    { value: 'Troca comercial', label: 'Troca comercial' },
    { value: 'Outros', label: 'Outros' }
  ];

  useEffect(() => {
    if (saleForm?.product) {
      const product = availableProducts?.find(p => p?.name === saleForm?.product);
      if (product) {
        setSaleForm(prev => ({ ...prev, unitPrice: product?.price?.toString() }));
      }
    }
  }, [saleForm?.product, availableProducts]);

  const handleSaleSubmit = (e) => {
    e?.preventDefault();
    if (!saleForm?.customerName || !saleForm?.product || !saleForm?.quantity) return;

    const quantity = parseInt(saleForm?.quantity);
    const unitPrice = parseFloat(saleForm?.unitPrice);
    const total = quantity * unitPrice;

    const newSale = {
      id: Date.now(),
      ...saleForm,
      quantity,
      unitPrice,
      total,
      date: new Date()?.toISOString()?.split('T')?.[0],
      time: new Date()?.toTimeString()?.slice(0, 5),
      status: saleForm?.paymentMethod === 'credit' ? 'pending' : 'completed'
    };

    setSales([newSale, ...sales]);

    // Update available products
    setAvailableProducts(prev =>
      prev?.map(p =>
        p?.name === saleForm?.product
          ? { ...p, quantity: p?.quantity - quantity }
          : p
      )
    );

    setSaleForm({
      customerName: '',
      product: '',
      quantity: '',
      unitPrice: '',
      paymentMethod: 'cash',
      paymentDueDate: ''
    });
  };

  const handleExchangeSubmit = (e) => {
    e?.preventDefault();
    if (!exchangeForm?.customerName || !exchangeForm?.product || !exchangeForm?.quantity) return;

    const newExchange = {
      id: Date.now(),
      ...exchangeForm,
      quantity: parseInt(exchangeForm?.quantity),
      date: new Date()?.toISOString()?.split('T')?.[0],
      time: new Date()?.toTimeString()?.slice(0, 5)
    };

    setExchanges([newExchange, ...exchanges]);
    setExchangeForm({
      customerName: '',
      product: '',
      quantity: '',
      reason: ''
    });
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

  return (
    <>
      <Helmet>
        <title>Gestão de Vendas - Padaria Simples</title>
        <meta name="description" content="Sistema de vendas simples para padaria" />
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Vendas</h1>
              <p className="text-muted-foreground">Controle de vendas e trocas de produtos</p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-muted/20 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab('sales')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'sales' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Vendas
                </button>
                <button
                  onClick={() => setActiveTab('exchanges')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'exchanges' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Trocas
                </button>
                <button
                  onClick={() => setActiveTab('stock')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'stock' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Estoque
                </button>
              </div>
            </div>

            {/* Sales Tab */}
            {activeTab === 'sales' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Form */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Icon name="ShoppingCart" size={24} className="text-primary" />
                    Nova Venda
                  </h2>

                  <form onSubmit={handleSaleSubmit} className="space-y-4">
                    <Select
                      label="Cliente"
                      options={customers?.map(c => ({ value: c?.name, label: c?.name }))}
                      value={saleForm?.customerName}
                      onChange={(value) => setSaleForm(prev => ({ ...prev, customerName: value }))}
                      placeholder="Selecione o cliente"
                      required
                    />

                    <Select
                      label="Produto"
                      options={availableProducts?.map(p => ({
                        value: p?.name,
                        label: `${p?.name} (${p?.quantity} disponíveis)`,
                        disabled: p?.quantity === 0
                      }))}
                      value={saleForm?.product}
                      onChange={(value) => setSaleForm(prev => ({ ...prev, product: value }))}
                      placeholder="Selecione o produto"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Quantidade"
                        type="number"
                        placeholder="Ex: 100"
                        value={saleForm?.quantity}
                        onChange={(e) => setSaleForm(prev => ({ ...prev, quantity: e?.target?.value }))}
                        required
                      />

                      <Input
                        label="Preço Unitário (R$)"
                        type="number"
                        step="0.01"
                        placeholder="Ex: 2.50"
                        value={saleForm?.unitPrice}
                        onChange={(e) => setSaleForm(prev => ({ ...prev, unitPrice: e?.target?.value }))}
                        required
                      />
                    </div>

                    <Select
                      label="Forma de Pagamento"
                      options={paymentMethods}
                      value={saleForm?.paymentMethod}
                      onChange={(value) => setSaleForm(prev => ({ ...prev, paymentMethod: value }))}
                      required
                    />

                    {saleForm?.paymentMethod === 'credit' && (
                      <Input
                        label="Data de Vencimento"
                        type="date"
                        value={saleForm?.paymentDueDate}
                        onChange={(e) => setSaleForm(prev => ({ ...prev, paymentDueDate: e?.target?.value }))}
                        required
                      />
                    )}

                    {saleForm?.quantity && saleForm?.unitPrice && (
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-foreground font-medium">Total:</span>
                          <span className="text-xl font-bold text-primary">
                            {formatCurrency(parseInt(saleForm?.quantity || 0) * parseFloat(saleForm?.unitPrice || 0))}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      iconName="ShoppingCart"
                      iconPosition="left"
                    >
                      Registrar Venda
                    </Button>
                  </form>
                </div>

                {/* Recent Sales */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Icon name="Receipt" size={24} className="text-primary" />
                    Vendas Recentes
                  </h2>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {sales?.map((sale) => (
                      <div key={sale?.id} className="p-4 bg-muted/20 rounded-lg border border-border/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-foreground">{sale?.customerName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {sale?.product} - {sale?.quantity} unidades
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{formatCurrency(sale?.total)}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              sale?.status === 'completed'
                                ? 'bg-success/10 text-success' :'bg-warning/10 text-warning'
                            }`}>
                              {sale?.status === 'completed' ? 'Pago' : 'A Receber'}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{paymentMethods?.find(p => p?.value === sale?.paymentMethod)?.label}</span>
                          <span>{sale?.time} - {sale?.date}</span>
                        </div>
                        {sale?.paymentDueDate && (
                          <p className="text-xs text-warning mt-1">
                            Vencimento: {sale?.paymentDueDate}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Exchanges Tab */}
            {activeTab === 'exchanges' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Exchange Form */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Icon name="RefreshCw" size={24} className="text-primary" />
                    Nova Troca
                  </h2>

                  <form onSubmit={handleExchangeSubmit} className="space-y-4">
                    <Select
                      label="Cliente"
                      options={customers?.map(c => ({ value: c?.name, label: c?.name }))}
                      value={exchangeForm?.customerName}
                      onChange={(value) => setExchangeForm(prev => ({ ...prev, customerName: value }))}
                      placeholder="Selecione o cliente"
                      required
                    />

                    <Select
                      label="Produto"
                      options={availableProducts?.map(p => ({ value: p?.name, label: p?.name }))}
                      value={exchangeForm?.product}
                      onChange={(value) => setExchangeForm(prev => ({ ...prev, product: value }))}
                      placeholder="Selecione o produto"
                      required
                    />

                    <Input
                      label="Quantidade"
                      type="number"
                      placeholder="Ex: 5"
                      value={exchangeForm?.quantity}
                      onChange={(e) => setExchangeForm(prev => ({ ...prev, quantity: e?.target?.value }))}
                      required
                    />

                    <Select
                      label="Motivo da Troca"
                      options={exchangeReasons}
                      value={exchangeForm?.reason}
                      onChange={(value) => setExchangeForm(prev => ({ ...prev, reason: value }))}
                      placeholder="Selecione o motivo"
                      required
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      iconName="RefreshCw"
                      iconPosition="left"
                    >
                      Registrar Troca
                    </Button>
                  </form>
                </div>

                {/* Recent Exchanges */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Icon name="History" size={24} className="text-primary" />
                    Trocas Recentes
                  </h2>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {exchanges?.map((exchange) => (
                      <div key={exchange?.id} className="p-4 bg-muted/20 rounded-lg border border-border/50">
                        <div className="mb-2">
                          <h3 className="font-medium text-foreground">{exchange?.customerName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {exchange?.product} - {exchange?.quantity} unidades
                          </p>
                          <p className="text-sm text-warning mt-1">{exchange?.reason}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {exchange?.time} - {exchange?.date}
                        </div>
                      </div>
                    ))}

                    {exchanges?.length === 0 && (
                      <div className="text-center py-8">
                        <Icon name="RefreshCw" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhuma troca registrada</p>
                      </div>
                    )}
                  </div>

                  {/* Exchange Summary by Customer */}
                  {exchanges?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h3 className="font-medium text-foreground mb-2">Clientes com Mais Trocas</h3>
                      <div className="space-y-1">
                        {customers?.map((customer) => {
                          const customerExchanges = exchanges?.filter(e => e?.customerName === customer?.name);
                          const totalExchanges = customerExchanges?.reduce((sum, e) => sum + e?.quantity, 0);

                          if (totalExchanges > 0) {
                            return (
                              <div key={customer?.id} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{customer?.name}:</span>
                                <span className="text-warning font-medium">{totalExchanges} unidades</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stock Tab */}
            {activeTab === 'stock' && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Icon name="Package" size={24} className="text-primary" />
                  Estoque Disponível
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableProducts?.map((product, index) => (
                    <div key={index} className="p-4 bg-muted/20 rounded-lg border border-border/50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-foreground">{product?.name}</h3>
                        <span className="text-primary font-bold">{formatCurrency(product?.price)}</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {product?.quantity}
                      </div>
                      <div className="text-sm text-muted-foreground">unidades disponíveis</div>
                      <div className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product?.quantity === 0
                          ? 'bg-error/10 text-error'
                          : product?.quantity < 100
                            ? 'bg-warning/10 text-warning' :'bg-success/10 text-success'
                      }`}>
                        {product?.quantity === 0
                          ? 'Esgotado'
                          : product?.quantity < 100
                            ? 'Estoque Baixo' :'Disponível'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default SalesManagement;