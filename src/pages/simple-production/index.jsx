import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const SimpleProduction = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [productions, setProductions] = useState([
    {
      id: 1,
      productName: 'Pão Baguete',
      quantity: 1000,
      date: '2025-08-04',
      time: '06:00'
    },
    {
      id: 2,
      productName: 'Pão Francês',
      quantity: 500,
      date: '2025-08-04',
      time: '07:30'
    }
  ]);

  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    date: new Date()?.toISOString()?.split('T')?.[0],
    time: new Date()?.toTimeString()?.slice(0, 5)
  });

  const breadTypes = [
    { value: 'Pão Baguete', label: 'Pão Baguete' },
    { value: 'Pão Francês', label: 'Pão Francês' },
    { value: 'Pão de Forma', label: 'Pão de Forma' },
    { value: 'Pão Doce', label: 'Pão Doce' },
    { value: 'Pão Integral', label: 'Pão Integral' },
    { value: 'Croissant', label: 'Croissant' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!formData?.productName || !formData?.quantity) return;

    const newProduction = {
      id: Date.now(),
      ...formData,
      quantity: parseInt(formData?.quantity)
    };

    setProductions([newProduction, ...productions]);
    setFormData({
      productName: '',
      quantity: '',
      date: new Date()?.toISOString()?.split('T')?.[0],
      time: new Date()?.toTimeString()?.slice(0, 5)
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <Helmet>
        <title>Lançamento de Produção - Padaria Simples</title>
        <meta name="description" content="Sistema simples para lançamento de produção de pães" />
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
          <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Lançamento de Produção</h1>
              <p className="text-muted-foreground">Registre de forma simples os pães produzidos</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Production Form */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Icon name="Plus" size={24} className="text-primary" />
                  Nova Produção
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select
                    label="Tipo de Pão"
                    options={breadTypes}
                    value={formData?.productName}
                    onChange={(value) => setFormData(prev => ({ ...prev, productName: value }))}
                    placeholder="Selecione o tipo de pão"
                    required
                  />

                  <Input
                    label="Quantidade Produzida"
                    type="number"
                    placeholder="Ex: 1000"
                    value={formData?.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e?.target?.value }))}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Data"
                      type="date"
                      value={formData?.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e?.target?.value }))}
                      required
                    />

                    <Input
                      label="Horário"
                      type="time"
                      value={formData?.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e?.target?.value }))}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    iconName="Save"
                    iconPosition="left"
                  >
                    Registrar Produção
                  </Button>
                </form>
              </div>

              {/* Production History */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Icon name="Clock" size={24} className="text-primary" />
                  Produção de Hoje
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {productions?.map((production) => (
                    <div key={production?.id} className="p-4 bg-muted/20 rounded-lg border border-border/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-foreground">{production?.productName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {production?.quantity} unidades
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{production?.time}</p>
                          <p className="text-xs text-muted-foreground">{production?.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {productions?.length === 0 && (
                    <div className="text-center py-8">
                      <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Nenhuma produção registrada hoje</p>
                    </div>
                  )}
                </div>

                {/* Total Summary */}
                {productions?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="bg-primary/10 rounded-lg p-4">
                      <h3 className="font-medium text-foreground mb-2">Resumo do Dia</h3>
                      <div className="space-y-1">
                        {breadTypes?.map((breadType) => {
                          const total = productions?.filter(p => p?.productName === breadType?.value)?.reduce((sum, p) => sum + p?.quantity, 0);

                          if (total > 0) {
                            return (
                              <div key={breadType?.value} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{breadType?.label}:</span>
                                <span className="text-foreground font-medium">{total} unidades</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
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

export default SimpleProduction;