import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import SupplierDirectory from './components/SupplierDirectory';
import PurchaseOrderTable from './components/PurchaseOrderTable';
import OrderDetailPanel from './components/OrderDetailPanel';
import CreateOrderModal from './components/CreateOrderModal';
import ReorderSuggestions from './components/ReorderSuggestions';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const PurchaseOrderManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [orders, setOrders] = useState([]);

  // Mock data for suppliers
  const suppliers = [
    {
      id: 'sup-001',
      name: 'Moinho São Paulo',
      category: 'farinha',
      status: 'active',
      rating: 4.8,
      deliveryTime: 3,
      phone: '(11) 3456-7890',
      location: 'São Paulo, SP',
      paymentTerms: '30 dias',
      contact: 'João Silva',
      email: 'joao@moinhosp.com.br'
    },
    {
      id: 'sup-002',
      name: 'Laticínios Vale Verde',
      category: 'laticínios',
      status: 'active',
      rating: 4.5,
      deliveryTime: 2,
      phone: '(11) 2345-6789',
      location: 'Campinas, SP',
      paymentTerms: '15 dias',
      contact: 'Maria Santos',
      email: 'maria@valeverde.com.br'
    },
    {
      id: 'sup-003',
      name: 'Açúcar Cristal Ltda',
      category: 'açúcar',
      status: 'active',
      rating: 4.2,
      deliveryTime: 5,
      phone: '(11) 4567-8901',
      location: 'Ribeirão Preto, SP',
      paymentTerms: '45 dias',
      contact: 'Carlos Oliveira',
      email: 'carlos@acucarcristal.com.br'
    },
    {
      id: 'sup-004',
      name: 'Fermento Premium',
      category: 'fermento',
      status: 'pending',
      rating: 4.0,
      deliveryTime: 7,
      phone: '(11) 5678-9012',
      location: 'Santos, SP',
      paymentTerms: '30 dias',
      contact: 'Ana Costa',
      email: 'ana@fermentopremium.com.br'
    },
    {
      id: 'sup-005',
      name: 'Distribuidora Geral',
      category: 'outros',
      status: 'active',
      rating: 3.8,
      deliveryTime: 4,
      phone: '(11) 6789-0123',
      location: 'Guarulhos, SP',
      paymentTerms: '60 dias',
      contact: 'Pedro Lima',
      email: 'pedro@distgeral.com.br'
    }
  ];

  // Mock data for purchase orders
  const mockOrders = [
    {
      id: 'po-001',
      poNumber: 'PO-2025-001',
      supplier: 'Moinho São Paulo',
      supplierContact: 'João Silva',
      supplierEmail: 'joao@moinhosp.com.br',
      supplierPhone: '(11) 3456-7890',
      orderDate: '2025-01-02',
      deliveryDate: '2025-01-05',
      status: 'pending',
      total: 2850.00,
      items: 3,
      paymentTerms: '30 dias',
      paymentMethod: 'Transferência Bancária',
      notes: 'Entrega urgente para produção especial',
      lineItems: [
        {
          name: 'Farinha de Trigo Tipo 1',
          description: 'Farinha especial para pães',
          quantity: 50,
          unit: 'kg',
          unitPrice: 4.50,
          total: 225.00,
          specifications: 'Marca Premium, embalagem 25kg'
        },
        {
          name: 'Farinha Integral',
          description: 'Farinha integral orgânica',
          quantity: 25,
          unit: 'kg',
          unitPrice: 6.80,
          total: 170.00,
          specifications: 'Certificação orgânica'
        },
        {
          name: 'Farinha de Centeio',
          description: 'Farinha importada',
          quantity: 20,
          unit: 'kg',
          unitPrice: 12.25,
          total: 245.00,
          specifications: 'Importada da Alemanha'
        }
      ],
      trackingHistory: [
        {
          status: 'Pedido Criado',
          description: 'Pedido de compra criado e aguardando aprovação',
          date: '2025-01-02',
          time: '09:30'
        },
        {
          status: 'Aguardando Aprovação',
          description: 'Pedido enviado para aprovação do gerente',
          date: '2025-01-02',
          time: '10:15'
        }
      ],
      trackingNumber: 'MSP-2025-001',
      documents: [
        {
          name: 'Cotação_Moinho_SP.pdf',
          size: '245 KB',
          uploadDate: '2025-01-02'
        }
      ]
    },
    {
      id: 'po-002',
      poNumber: 'PO-2025-002',
      supplier: 'Laticínios Vale Verde',
      supplierContact: 'Maria Santos',
      supplierEmail: 'maria@valeverde.com.br',
      supplierPhone: '(11) 2345-6789',
      orderDate: '2025-01-01',
      deliveryDate: '2025-01-03',
      status: 'approved',
      total: 1680.00,
      items: 4,
      paymentTerms: '15 dias',
      paymentMethod: 'Transferência Bancária',
      notes: 'Produtos refrigerados - cuidado no transporte',
      lineItems: [
        {
          name: 'Manteiga sem Sal',
          description: 'Manteiga premium',
          quantity: 10,
          unit: 'kg',
          unitPrice: 28.50,
          total: 285.00,
          specifications: 'Embalagem 500g, refrigerada'
        },
        {
          name: 'Leite Integral',
          description: 'Leite fresco pasteurizado',
          quantity: 50,
          unit: 'l',
          unitPrice: 4.20,
          total: 210.00,
          specifications: 'Embalagem 1L, validade mínima 5 dias'
        },
        {
          name: 'Creme de Leite',
          description: 'Creme fresco',
          quantity: 20,
          unit: 'l',
          unitPrice: 8.90,
          total: 178.00,
          specifications: 'Teor de gordura 35%'
        },
        {
          name: 'Queijo Mussarela',
          description: 'Queijo para recheios',
          quantity: 5,
          unit: 'kg',
          unitPrice: 32.40,
          total: 162.00,
          specifications: 'Fatiado, embalagem a vácuo'
        }
      ],
      trackingHistory: [
        {
          status: 'Pedido Aprovado',
          description: 'Pedido aprovado e enviado ao fornecedor',
          date: '2025-01-01',
          time: '14:20'
        },
        {
          status: 'Confirmado pelo Fornecedor',
          description: 'Fornecedor confirmou disponibilidade dos produtos',
          date: '2025-01-01',
          time: '16:45'
        }
      ],
      trackingNumber: 'VVL-2025-002',
      documents: [
        {
          name: 'Pedido_Aprovado.pdf',
          size: '189 KB',
          uploadDate: '2025-01-01'
        },
        {
          name: 'Certificado_Qualidade.pdf',
          size: '567 KB',
          uploadDate: '2025-01-01'
        }
      ]
    },
    {
      id: 'po-003',
      poNumber: 'PO-2025-003',
      supplier: 'Açúcar Cristal Ltda',
      supplierContact: 'Carlos Oliveira',
      supplierEmail: 'carlos@acucarcristal.com.br',
      supplierPhone: '(11) 4567-8901',
      orderDate: '2024-12-28',
      deliveryDate: '2025-01-06',
      status: 'sent',
      total: 945.00,
      items: 2,
      paymentTerms: '45 dias',
      paymentMethod: 'Boleto Bancário',
      notes: 'Verificar qualidade do açúcar na entrega',
      lineItems: [
        {
          name: 'Açúcar Cristal',
          description: 'Açúcar refinado especial',
          quantity: 100,
          unit: 'kg',
          unitPrice: 3.80,
          total: 380.00,
          specifications: 'Sacos de 50kg, cristais uniformes'
        },
        {
          name: 'Açúcar Refinado',
          description: 'Açúcar refinado premium',
          quantity: 75,
          unit: 'kg',
          unitPrice: 4.20,
          total: 315.00,
          specifications: 'Embalagem 1kg, grãos finos'
        }
      ],
      trackingHistory: [
        {
          status: 'Em Transporte',
          description: 'Produtos saíram do centro de distribuição',
          date: '2025-01-04',
          time: '08:00'
        },
        {
          status: 'Em Rota de Entrega',
          description: 'Veículo a caminho do destino',
          date: '2025-01-04',
          time: '13:30'
        }
      ],
      trackingNumber: 'ACL-2025-003',
      documents: [
        {
          name: 'Nota_Fiscal.pdf',
          size: '234 KB',
          uploadDate: '2025-01-04'
        }
      ]
    }
  ];

  // Mock reorder suggestions
  const reorderSuggestions = [
    {
      id: 'sug-001',
      supplier: 'Fermento Premium',
      category: 'Fermentos e Aditivos',
      priority: 'high',
      estimatedTotal: 890.00,
      deliveryTime: 7,
      paymentTerms: '30 dias',
      items: [
        {
          name: 'Fermento Biológico Seco',
          reason: 'Estoque crítico - apenas 2 dias restantes',
          currentStock: 0.5,
          minStock: 2.0,
          suggestedQuantity: 5.0,
          unit: 'kg',
          avgConsumption: 0.8,
          estimatedCost: 125.00
        },
        {
          name: 'Fermento Químico',
          reason: 'Abaixo do estoque mínimo',
          currentStock: 1.2,
          minStock: 3.0,
          suggestedQuantity: 10.0,
          unit: 'kg',
          avgConsumption: 0.4,
          estimatedCost: 180.00
        },
        {
          name: 'Melhorador de Massa',
          reason: 'Consumo acima da média',
          currentStock: 2.8,
          minStock: 2.0,
          suggestedQuantity: 8.0,
          unit: 'kg',
          avgConsumption: 0.3,
          estimatedCost: 320.00
        }
      ]
    },
    {
      id: 'sug-002',
      supplier: 'Distribuidora Geral',
      category: 'Ingredientes Diversos',
      priority: 'medium',
      estimatedTotal: 456.00,
      deliveryTime: 4,
      paymentTerms: '60 dias',
      items: [
        {
          name: 'Sal Refinado',
          reason: 'Reposição programada',
          currentStock: 8.0,
          minStock: 5.0,
          suggestedQuantity: 25.0,
          unit: 'kg',
          avgConsumption: 0.2,
          estimatedCost: 45.00
        },
        {
          name: 'Chocolate em Pó',
          reason: 'Promoção sazonal disponível',
          currentStock: 12.0,
          minStock: 8.0,
          suggestedQuantity: 20.0,
          unit: 'kg',
          avgConsumption: 1.5,
          estimatedCost: 380.00
        }
      ]
    }
  ];

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  const handleCreateOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
  };

  const handleCreateFromSuggestion = (suggestion) => {
    const supplier = suppliers?.find(s => s?.name === suggestion?.supplier);
    if (supplier) {
      setSelectedSupplier(supplier);
      setShowCreateModal(true);
      setShowSuggestions(false);
    }
  };

  const handleDismissSuggestion = (suggestionId) => {
    // In a real app, this would update the suggestions state
    console.log('Dismissing suggestion:', suggestionId);
  };

  const handleOrderApprove = (orderId) => {
    setOrders(prev => prev?.map(order =>
      order?.id === orderId
        ? {
            ...order,
            status: 'approved',
            trackingHistory: [
              ...order?.trackingHistory,
              {
                status: 'Pedido Aprovado',
                description: 'Pedido aprovado pelo gerente',
                date: new Date()?.toISOString(),
                time: new Date()?.toLocaleTimeString('pt-BR')
              }
            ]
          }
        : order
    ));
  };

  const handleOrderCancel = (orderId) => {
    setOrders(prev => prev?.map(order =>
      order?.id === orderId
        ? {
            ...order,
            status: 'cancelled',
            trackingHistory: [
              ...order?.trackingHistory,
              {
                status: 'Pedido Cancelado',
                description: 'Pedido cancelado pelo usuário',
                date: new Date()?.toISOString(),
                time: new Date()?.toLocaleTimeString('pt-BR')
              }
            ]
          }
        : order
    ));
  };

  const handleOrderUpdate = (orderId) => {
    // In a real app, this would open an edit modal
    console.log('Editing order:', orderId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={handleMenuToggle}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleSidebarToggle}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'content-with-sidebar-collapsed' : 'content-with-sidebar'
      } content-with-mobile-nav`}>
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          {/* Action Bar */}
          <div className="bg-card border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-foreground">Gestão de Pedidos de Compra</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Package" size={16} />
                  <span>{orders?.length} pedidos</span>
                  <span>•</span>
                  <span>{orders?.filter(o => o?.status === 'pending')?.length} pendentes</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={showSuggestions ? "default" : "outline"}
                  size="sm"
                  iconName="Lightbulb"
                  iconSize={16}
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  Sugestões ({reorderSuggestions?.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconSize={16}
                >
                  Relatório
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Plus"
                  iconSize={16}
                  onClick={() => setShowCreateModal(true)}
                >
                  Novo Pedido
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {showSuggestions ? (
            <div className="flex-1 p-6 overflow-y-auto">
              <ReorderSuggestions
                suggestions={reorderSuggestions}
                onCreateFromSuggestion={handleCreateFromSuggestion}
                onDismissSuggestion={handleDismissSuggestion}
              />
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Suppliers */}
              <div className="w-1/4 min-w-[300px] border-r border-border">
                <SupplierDirectory
                  suppliers={suppliers}
                  selectedSupplier={selectedSupplier}
                  onSupplierSelect={handleSupplierSelect}
                />
              </div>

              {/* Center Panel - Orders Table */}
              <div className="flex-1 min-w-0">
                <PurchaseOrderTable
                  orders={orders}
                  selectedOrder={selectedOrder}
                  onOrderSelect={handleOrderSelect}
                  onCreateOrder={() => setShowCreateModal(true)}
                />
              </div>

              {/* Right Panel - Order Details */}
              <div className="w-1/3 min-w-[400px]">
                <OrderDetailPanel
                  order={selectedOrder}
                  onOrderUpdate={handleOrderUpdate}
                  onOrderApprove={handleOrderApprove}
                  onOrderCancel={handleOrderCancel}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        suppliers={suppliers}
        onCreateOrder={handleCreateOrder}
      />
    </div>
  );
};

export default PurchaseOrderManagement;