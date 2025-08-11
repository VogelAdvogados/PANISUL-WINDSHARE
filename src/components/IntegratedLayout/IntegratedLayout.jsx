import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dashboard from '../Dashboard/Dashboard';
import InventoryManagement from '../Inventory/InventoryManagement';
import ProductionManagement from '../Production/ProductionManagement';
import SalesManagement from '../Sales/SalesManagement';
import ClientManagement from '../Clients/ClientManagement';
import Modal from '../common/Modal';

const IntegratedLayout = () => {
  const dispatch = useDispatch();
  const { finishedProducts } = useSelector(state => state.inventory);

  // State for modals
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  // Handle production from dashboard
  const handleProduction = (product) => {
    setSelectedProduct(product);
    setShowProductionModal(true);
  };

  // Handle sales from dashboard
  const handleSale = (product) => {
    setSelectedProduct(product);
    setShowSalesModal(true);
  };

  // Handle client selection
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Dashboard Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Production Cards */}
          {finishedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {product.quantity} em estoque
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleProduction(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Produzir
                </button>
                <button
                  onClick={() => handleSale(product)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Vender
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Inventory Management Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Gestão de Estoque</h2>
          <InventoryManagement />
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
          <div className="bg-white rounded-lg shadow p-4">
            {/* This would show recent production, sales, and client interactions */}
          </div>
        </div>
      </div>

      {/* Production Modal */}
      <Modal
        isOpen={showProductionModal}
        onClose={() => setShowProductionModal(false)}
        title="Nova Produção"
      >
        <ProductionManagement
          initialProduct={selectedProduct}
          onClose={() => {
            setShowProductionModal(false);
            setSelectedProduct(null);
          }}
        />
      </Modal>

      {/* Sales Modal */}
      <Modal
        isOpen={showSalesModal}
        onClose={() => setShowSalesModal(false)}
        title="Nova Venda"
      >
        <SalesManagement
          initialProduct={selectedProduct}
          onClose={() => {
            setShowSalesModal(false);
            setSelectedProduct(null);
          }}
        />
      </Modal>

      {/* Client Modal */}
      <Modal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        title={selectedClient ? `Cliente: ${selectedClient.name}` : "Novo Cliente"}
      >
        <ClientManagement
          initialClient={selectedClient}
          onClose={() => {
            setShowClientModal(false);
            setSelectedClient(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default IntegratedLayout;
