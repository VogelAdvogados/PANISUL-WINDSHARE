import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderDetailPanel = ({ order, onOrderUpdate, onOrderApprove, onOrderCancel }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!order) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-card border-l border-border">
        <Icon name="FileText" size={64} className="text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">
          Selecione um pedido para ver os detalhes
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'pending': return 'bg-warning/10 text-warning';
      case 'approved': return 'bg-success/10 text-success';
      case 'sent': return 'bg-primary/10 text-primary';
      case 'delivered': return 'bg-success/20 text-success';
      case 'cancelled': return 'bg-error/10 text-error';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Rascunho',
      pending: 'Pendente',
      approved: 'Aprovado',
      sent: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return labels?.[status] || status;
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

  const tabs = [
    { id: 'details', label: 'Detalhes', icon: 'FileText' },
    { id: 'items', label: 'Itens', icon: 'Package' },
    { id: 'tracking', label: 'Rastreamento', icon: 'Truck' },
    { id: 'documents', label: 'Documentos', icon: 'Paperclip' }
  ];

  const renderDetails = () => (
    <div className="space-y-6">
      {/* Order Info */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Informações do Pedido</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Número PO:</span>
            <div className="font-medium text-foreground">{order?.poNumber}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Data do Pedido:</span>
            <div className="font-medium text-foreground">{formatDate(order?.orderDate)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Entrega Prevista:</span>
            <div className="font-medium text-foreground">{formatDate(order?.deliveryDate)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Valor Total:</span>
            <div className="font-medium text-foreground">{formatCurrency(order?.total)}</div>
          </div>
        </div>
      </div>

      {/* Supplier Info */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Informações do Fornecedor</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Nome:</span>
            <div className="font-medium text-foreground">{order?.supplier}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Contato:</span>
            <div className="font-medium text-foreground">{order?.supplierContact}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span>
            <div className="font-medium text-foreground">{order?.supplierEmail}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Telefone:</span>
            <div className="font-medium text-foreground">{order?.supplierPhone}</div>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Condições de Pagamento</h3>
        <div className="text-sm">
          <div className="font-medium text-foreground">{order?.paymentTerms}</div>
          <div className="text-muted-foreground mt-1">{order?.paymentMethod}</div>
        </div>
      </div>
    </div>
  );

  const renderItems = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Itens do Pedido</h3>
        <span className="text-sm text-muted-foreground">{order?.lineItems?.length} itens</span>
      </div>

      <div className="space-y-3">
        {order?.lineItems?.map((item, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{item?.name}</h4>
                <p className="text-sm text-muted-foreground">{item?.description}</p>
              </div>
              <div className="text-right">
                <div className="font-medium text-foreground">{formatCurrency(item?.total)}</div>
                <div className="text-sm text-muted-foreground">
                  {item?.quantity} {item?.unit} × {formatCurrency(item?.unitPrice)}
                </div>
              </div>
            </div>

            {item?.specifications && (
              <div className="text-xs text-muted-foreground mt-2">
                <span className="font-medium">Especificações:</span> {item?.specifications}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span className="text-foreground">Total:</span>
          <span className="text-foreground">{formatCurrency(order?.total)}</span>
        </div>
      </div>
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Status de Entrega</h3>

      <div className="space-y-3">
        {order?.trackingHistory?.map((event, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={16} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground">{event.status}</div>
              <div className="text-sm text-muted-foreground">{event.description}</div>
              <div className="text-xs text-muted-foreground">{formatDate(event.date)} - {event.time}</div>
            </div>
          </div>
        ))}
      </div>

      {order?.trackingNumber && (
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Código de Rastreamento:</span>
            <div className="font-medium text-foreground font-mono">{order?.trackingNumber}</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Documentos Anexados</h3>

      <div className="space-y-3">
        {order?.documents?.map((doc, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Icon name="FileText" size={20} className="text-muted-foreground" />
            <div className="flex-1">
              <div className="font-medium text-foreground">{doc?.name}</div>
              <div className="text-sm text-muted-foreground">{doc?.size} - {formatDate(doc?.uploadDate)}</div>
            </div>
            <Button variant="ghost" size="sm" iconName="Download" iconSize={16}>
              Baixar
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" iconName="Upload" iconSize={16} className="w-full">
        Adicionar Documento
      </Button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details': return renderDetails();
      case 'items': return renderItems();
      case 'tracking': return renderTracking();
      case 'documents': return renderDocuments();
      default: return renderDetails();
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{order?.poNumber}</h2>
            <p className="text-sm text-muted-foreground">{order?.supplier}</p>
          </div>
          <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order?.status)}`}>
            {getStatusLabel(order?.status)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {order?.status === 'pending' && (
            <>
              <Button variant="success" size="sm" iconName="Check" iconSize={16} onClick={() => onOrderApprove(order?.id)}>
                Aprovar
              </Button>
              <Button variant="outline" size="sm" iconName="Edit" iconSize={16} onClick={() => onOrderUpdate(order?.id)}>
                Editar
              </Button>
            </>
          )}
          {(order?.status === 'draft' || order?.status === 'pending') && (
            <Button variant="destructive" size="sm" iconName="X" iconSize={16} onClick={() => onOrderCancel(order?.id)}>
              Cancelar
            </Button>
          )}
          <Button variant="ghost" size="sm" iconName="Printer" iconSize={16}>
            Imprimir
          </Button>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              {tab?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default OrderDetailPanel;