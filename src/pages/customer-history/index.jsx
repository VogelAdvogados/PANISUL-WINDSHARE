import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';


const CustomerHistory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    {
      id: 1,
      name: 'Mercado do Seu Zé',
      type: 'business',
      phone: '(11) 99999-1111',
      address: 'Rua das Flores, 123',
      totalPurchases: 15420.50,
      lastPurchase: '2025-08-04',
      exchangeCount: 2
    },
    {
      id: 2,
      name: 'Mercadinho da Maria',
      type: 'business',
      phone: '(11) 99999-2222',
      address: 'Av. Central, 456',
      totalPurchases: 8750.00,
      lastPurchase: '2025-08-04',
      exchangeCount: 0
    },
    {
      id: 3,
      name: 'Mini Mercado da Joana',
      type: 'business',
      phone: '(11) 99999-3333',
      address: 'Rua da Padaria, 789',
      totalPurchases: 12300.00,
      lastPurchase: '2025-08-03',
      exchangeCount: 5
    },
    {
      id: 4,
      name: 'Padaria do Centro',
      type: 'business',
      phone: '(11) 99999-4444',
      address: 'Praça Principal, 100',
      totalPurchases: 22100.00,
      lastPurchase: '2025-08-02',
      exchangeCount: 1
    }
  ];

  const purchaseHistory = [
    {
      id: 1,
      customerId: 1,
      customerName: 'Mercado do Seu Zé',
      date: '2025-08-04',
      time: '14:00',
      items: [
        { product: 'Pão Baguete', quantity: 300, unitPrice: 2.50, total: 750.00 }
      ],
      total: 750.00,
      paymentMethod: 'cash',
      status: 'completed'
    },
    {
      id: 2,
      customerId: 2,
      customerName: 'Mercadinho da Maria',
      date: '2025-08-04',
      time: '14:35',
      items: [
        { product: 'Pão Baguete', quantity: 150, unitPrice: 2.50, total: 375.00 }
      ],
      total: 375.00,
      paymentMethod: 'credit',
      paymentDueDate: '2025-08-06',
      status: 'pending'
    },
    {
      id: 3,
      customerId: 1,
      customerName: 'Mercado do Seu Zé',
      date: '2025-08-03',
      time: '15:20',
      items: [
        { product: 'Pão Francês', quantity: 500, unitPrice: 0.80, total: 400.00 },
        { product: 'Pão de Forma', quantity: 50, unitPrice: 4.50, total: 225.00 }
      ],
      total: 625.00,
      paymentMethod: 'pix',
      status: 'completed'
    },
    {
      id: 4,
      customerId: 3,
      customerName: 'Mini Mercado da Joana',
      date: '2025-08-03',
      time: '10:15',
      items: [
        { product: 'Croissant', quantity: 100, unitPrice: 3.00, total: 300.00 }
      ],
      total: 300.00,
      paymentMethod: 'cash',
      status: 'completed'
    },
    {
      id: 5,
      customerId: 4,
      customerName: 'Padaria do Centro',
      date: '2025-08-02',
      time: '16:45',
      items: [
        { product: 'Pão Baguete', quantity: 200, unitPrice: 2.50, total: 500.00 },
        { product: 'Pão Doce', quantity: 75, unitPrice: 2.80, total: 210.00 }
      ],
      total: 710.00,
      paymentMethod: 'pix',
      status: 'completed'
    }
  ];

  const exchangeHistory = [
    {
      id: 1,
      customerId: 1,
      customerName: 'Mercado do Seu Zé',
      product: 'Pão Francês',
      quantity: 3,
      reason: 'Produto com defeito',
      date: '2025-08-02',
      time: '11:30'
    },
    {
      id: 2,
      customerId: 3,
      customerName: 'Mini Mercado da Joana',
      product: 'Pão Francês',
      quantity: 5,
      reason: 'Produto com defeito',
      date: '2025-08-04',
      time: '15:20'
    },
    {
      id: 3,
      customerId: 3,
      customerName: 'Mini Mercado da Joana',
      product: 'Pão de Forma',
      quantity: 2,
      reason: 'Troca comercial',
      date: '2025-08-01',
      time: '14:10'
    },
    {
      id: 4,
      customerId: 3,
      customerName: 'Mini Mercado da Joana',
      product: 'Croissant',
      quantity: 8,
      reason: 'Produto vencido',
      date: '2025-07-30',
      time: '16:00'
    }
  ];

  const paymentMethods = {
    cash: 'Dinheiro',
    pix: 'PIX',
    credit: 'A Prazo'
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

  const filteredCustomers = customers?.filter(customer =>
    customer?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const getCustomerPurchases = (customerId) => {
    return purchaseHistory?.filter(purchase => purchase?.customerId === customerId);
  };

  const getCustomerExchanges = (customerId) => {
    return exchangeHistory?.filter(exchange => exchange?.customerId === customerId);
  };

  const selectedCustomerData = customers?.find(c => c?.id === parseInt(selectedCustomer));

  return (
    <>
      <Helmet>
        <title>Histórico de Clientes - Padaria Simples</title>
        <meta name="description" content="Histórico de compras e trocas dos clientes" />
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Histórico de Clientes</h1>
              <p className="text-muted-foreground">Acompanhe o histórico de compras e trocas dos seus clientes</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer List */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Users" size={24} className="text-primary" />
                    Clientes
                  </h2>

                  <div className="mb-4">
                    <Input
                      type="text"
                      placeholder="Pesquisar cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e?.target?.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredCustomers?.map((customer) => (
                      <div
                        key={customer?.id}
                        onClick={() => setSelectedCustomer(customer?.id?.toString())}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedCustomer === customer?.id?.toString()
                            ? 'bg-primary/10 border-primary/20' :'bg-muted/20 border-border/50 hover:bg-muted/40'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{customer?.name}</h3>
                            <p className="text-sm text-muted-foreground">{customer?.phone}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-primary">
                              {formatCurrency(customer?.totalPurchases)}
                            </div>
                            {customer?.exchangeCount > 0 && (
                              <div className="text-xs text-warning">
                                {customer?.exchangeCount} troca(s)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Summary */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <h3 className="font-medium text-foreground mb-2">Resumo Geral</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total de Clientes:</span>
                        <span className="text-foreground font-medium">{customers?.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Faturamento Total:</span>
                        <span className="text-foreground font-medium">
                          {formatCurrency(customers?.reduce((sum, c) => sum + c?.totalPurchases, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total de Trocas:</span>
                        <span className="text-warning font-medium">
                          {customers?.reduce((sum, c) => sum + c?.exchangeCount, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="lg:col-span-2">
                {selectedCustomerData ? (
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-card rounded-lg border border-border p-6">
                      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="User" size={24} className="text-primary" />
                        {selectedCustomerData?.name}
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium text-foreground mb-2">Informações de Contato</h3>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Icon name="Phone" size={16} className="text-muted-foreground" />
                              <span className="text-foreground">{selectedCustomerData?.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="MapPin" size={16} className="text-muted-foreground" />
                              <span className="text-foreground">{selectedCustomerData?.address}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium text-foreground mb-2">Estatísticas</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Comprado:</span>
                              <span className="text-foreground font-bold">
                                {formatCurrency(selectedCustomerData?.totalPurchases)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Última Compra:</span>
                              <span className="text-foreground">
                                {formatDate(selectedCustomerData?.lastPurchase)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total de Trocas:</span>
                              <span className={`font-medium ${
                                selectedCustomerData?.exchangeCount > 0 ? 'text-warning' : 'text-success'
                              }`}>
                                {selectedCustomerData?.exchangeCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Purchase History */}
                    <div className="bg-card rounded-lg border border-border p-6">
                      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Icon name="ShoppingBag" size={24} className="text-primary" />
                        Histórico de Compras
                      </h2>

                      <div className="space-y-4">
                        {getCustomerPurchases(selectedCustomerData?.id)?.map((purchase) => (
                          <div key={purchase?.id} className="p-4 bg-muted/20 rounded-lg border border-border/50">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm text-muted-foreground">
                                    {formatDate(purchase?.date)} às {purchase?.time}
                                  </span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    purchase?.status === 'completed'
                                      ? 'bg-success/10 text-success' :'bg-warning/10 text-warning'
                                  }`}>
                                    {purchase?.status === 'completed' ? 'Pago' : 'Pendente'}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {paymentMethods?.[purchase?.paymentMethod]}
                                  {purchase?.paymentDueDate && (
                                    <span className="text-warning"> - Venc: {formatDate(purchase?.paymentDueDate)}</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">
                                  {formatCurrency(purchase?.total)}
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-border/50 pt-3">
                              <h4 className="text-sm font-medium text-foreground mb-2">Itens:</h4>
                              <div className="space-y-1">
                                {purchase?.items?.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      {item?.product} - {item?.quantity} unidades
                                    </span>
                                    <span className="text-foreground">
                                      {formatCurrency(item?.total)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}

                        {getCustomerPurchases(selectedCustomerData?.id)?.length === 0 && (
                          <div className="text-center py-8">
                            <Icon name="ShoppingBag" size={48} className="text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Nenhuma compra registrada</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Exchange History */}
                    {getCustomerExchanges(selectedCustomerData?.id)?.length > 0 && (
                      <div className="bg-card rounded-lg border border-border p-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                          <Icon name="RefreshCw" size={24} className="text-warning" />
                          Histórico de Trocas
                        </h2>

                        <div className="space-y-4">
                          {getCustomerExchanges(selectedCustomerData?.id)?.map((exchange) => (
                            <div key={exchange?.id} className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="font-medium text-foreground">
                                    {exchange?.product} - {exchange?.quantity} unidades
                                  </h3>
                                  <p className="text-sm text-warning">{exchange?.reason}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(exchange?.date)} às {exchange?.time}
                                  </p>
                                </div>
                                <Icon name="AlertTriangle" size={20} className="text-warning" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-card rounded-lg border border-border p-6">
                    <div className="text-center py-12">
                      <Icon name="Users" size={64} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Selecione um Cliente</h3>
                      <p className="text-muted-foreground">
                        Clique em um cliente na lista ao lado para ver seu histórico completo.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CustomerHistory;