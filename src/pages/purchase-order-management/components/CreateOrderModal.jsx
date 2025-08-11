import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateOrderModal = ({ isOpen, onClose, suppliers, onCreateOrder }) => {
  const [formData, setFormData] = useState({
    supplier: '',
    deliveryDate: '',
    paymentTerms: '30 dias',
    notes: ''
  });
  const [lineItems, setLineItems] = useState([
    { ingredient: '', quantity: '', unit: 'kg', unitPrice: '', specifications: '' }
  ]);

  const supplierOptions = suppliers?.map(supplier => ({
    value: supplier?.id,
    label: supplier?.name
  }));

  const paymentTermsOptions = [
    { value: '15 dias', label: '15 dias' },
    { value: '30 dias', label: '30 dias' },
    { value: '45 dias', label: '45 dias' },
    { value: '60 dias', label: '60 dias' },
    { value: 'À vista', label: 'À vista' }
  ];

  const unitOptions = [
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'g', label: 'Grama (g)' },
    { value: 'l', label: 'Litro (l)' },
    { value: 'ml', label: 'Mililitro (ml)' },
    { value: 'un', label: 'Unidade' },
    { value: 'cx', label: 'Caixa' },
    { value: 'sc', label: 'Saco' }
  ];

  const ingredientOptions = [
    { value: 'farinha-trigo', label: 'Farinha de Trigo' },
    { value: 'farinha-integral', label: 'Farinha Integral' },
    { value: 'acucar-cristal', label: 'Açúcar Cristal' },
    { value: 'acucar-refinado', label: 'Açúcar Refinado' },
    { value: 'fermento-biologico', label: 'Fermento Biológico' },
    { value: 'fermento-quimico', label: 'Fermento Químico' },
    { value: 'sal-refinado', label: 'Sal Refinado' },
    { value: 'oleo-soja', label: 'Óleo de Soja' },
    { value: 'manteiga', label: 'Manteiga' },
    { value: 'ovos', label: 'Ovos' },
    { value: 'leite', label: 'Leite' },
    { value: 'chocolate-po', label: 'Chocolate em Pó' }
  ];

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedItems = [...lineItems];
    updatedItems[index][field] = value;
    setLineItems(updatedItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { ingredient: '', quantity: '', unit: 'kg', unitPrice: '', specifications: '' }]);
  };

  const removeLineItem = (index) => {
    if (lineItems?.length > 1) {
      setLineItems(lineItems?.filter((_, i) => i !== index));
    }
  };

  const calculateLineTotal = (quantity, unitPrice) => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    return qty * price;
  };

  const calculateTotal = () => {
    return lineItems?.reduce((total, item) => {
      return total + calculateLineTotal(item?.quantity, item?.unitPrice);
    }, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    const selectedSupplier = suppliers?.find(s => s?.id === formData?.supplier);
    const total = calculateTotal();

    const newOrder = {
      id: Date.now()?.toString(),
      poNumber: `PO-${Date.now()}`,
      supplier: selectedSupplier?.name || '',
      supplierContact: selectedSupplier?.contact || '',
      supplierEmail: selectedSupplier?.email || '',
      supplierPhone: selectedSupplier?.phone || '',
      orderDate: new Date()?.toISOString(),
      deliveryDate: formData?.deliveryDate,
      status: 'draft',
      total: total,
      items: lineItems?.length,
      paymentTerms: formData?.paymentTerms,
      paymentMethod: 'Transferência Bancária',
      notes: formData?.notes,
      lineItems: lineItems?.map(item => ({
        name: ingredientOptions?.find(ing => ing?.value === item?.ingredient)?.label || item?.ingredient,
        description: item?.specifications,
        quantity: parseFloat(item?.quantity),
        unit: item?.unit,
        unitPrice: parseFloat(item?.unitPrice),
        total: calculateLineTotal(item?.quantity, item?.unitPrice),
        specifications: item?.specifications
      })),
      trackingHistory: [
        {
          status: 'Pedido Criado',
          description: 'Pedido de compra criado como rascunho',
          date: new Date()?.toISOString(),
          time: new Date()?.toLocaleTimeString('pt-BR')
        }
      ],
      documents: []
    };

    onCreateOrder(newOrder);
    onClose();

    // Reset form
    setFormData({
      supplier: '',
      deliveryDate: '',
      paymentTerms: '30 dias',
      notes: ''
    });
    setLineItems([
      { ingredient: '', quantity: '', unit: 'kg', unitPrice: '', specifications: '' }
    ]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Novo Pedido de Compra</h2>
          <Button variant="ghost" size="icon" onClick={onClose} iconName="X" iconSize={20} />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Fornecedor"
                options={supplierOptions}
                value={formData?.supplier}
                onChange={(value) => handleInputChange('supplier', value)}
                required
                searchable
              />
              <Input
                label="Data de Entrega"
                type="date"
                value={formData?.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e?.target?.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Condições de Pagamento"
                options={paymentTermsOptions}
                value={formData?.paymentTerms}
                onChange={(value) => handleInputChange('paymentTerms', value)}
              />
              <Input
                label="Observações"
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
                placeholder="Observações adicionais..."
              />
            </div>

            {/* Line Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Itens do Pedido</h3>
                <Button type="button" variant="outline" size="sm" iconName="Plus" iconSize={16} onClick={addLineItem}>
                  Adicionar Item
                </Button>
              </div>

              <div className="space-y-4">
                {lineItems?.map((item, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-foreground">Item {index + 1}</h4>
                      {lineItems?.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          iconName="Trash2"
                          iconSize={16}
                          onClick={() => removeLineItem(index)}
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Select
                        label="Ingrediente"
                        options={ingredientOptions}
                        value={item?.ingredient}
                        onChange={(value) => handleLineItemChange(index, 'ingredient', value)}
                        searchable
                        required
                      />
                      <Input
                        label="Especificações"
                        value={item?.specifications}
                        onChange={(e) => handleLineItemChange(index, 'specifications', e?.target?.value)}
                        placeholder="Marca, qualidade, etc..."
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <Input
                        label="Quantidade"
                        type="number"
                        step="0.01"
                        value={item?.quantity}
                        onChange={(e) => handleLineItemChange(index, 'quantity', e?.target?.value)}
                        required
                      />
                      <Select
                        label="Unidade"
                        options={unitOptions}
                        value={item?.unit}
                        onChange={(value) => handleLineItemChange(index, 'unit', value)}
                      />
                      <Input
                        label="Preço Unitário"
                        type="number"
                        step="0.01"
                        value={item?.unitPrice}
                        onChange={(e) => handleLineItemChange(index, 'unitPrice', e?.target?.value)}
                        placeholder="0,00"
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Total</label>
                        <div className="h-10 flex items-center px-3 bg-muted rounded-md text-foreground font-medium">
                          {formatCurrency(calculateLineTotal(item?.quantity, item?.unitPrice))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total do Pedido:</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="default" iconName="Save" iconSize={16}>
              Criar Pedido
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;