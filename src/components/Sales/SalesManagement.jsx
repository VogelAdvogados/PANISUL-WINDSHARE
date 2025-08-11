import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSale, addReturn, processCredit } from '../../features';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify';

const SalesManagement = () => {
  const dispatch = useDispatch();
  const { sales, pendingCredits, loading: salesLoading, error: salesError } = useSelector(state => state.sales);
  const { finishedProducts, loading: inventoryLoading, error: inventoryError } = useSelector(state => state.inventory);
  const { clients, loading: clientsLoading, error: clientsError } = useSelector(state => state.clients);
  const [selectedTab, setSelectedTab] = useState('sales');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saleQuantity, setSaleQuantity] = useState(0);
  const [paymentType, setPaymentType] = useState('cash');
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchSales());
    dispatch(fetchFinishedProducts());
    dispatch(fetchClients());
  }, [dispatch]);

  const handleSale = async () => {
    if (!selectedProduct || saleQuantity <= 0) return;

    try {
      await dispatch(createSale({
        productId: selectedProduct.id,
        quantity: saleQuantity,
        paymentType,
        paymentDate,
        clientId: selectedClient?.id,
      })).unwrap();

      // Reset form
      setSelectedProduct(null);
      setSaleQuantity(0);
      setPaymentType('cash');
      setPaymentDate(new Date());
      setSelectedClient(null);
      toast.success('Venda realizada com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao realizar venda');
    }
  };

  const handleReturn = async (saleId, quantity) => {
    try {
      await dispatch(createReturn({
        saleId,
        quantity,
        reason: 'Troca/Devolução',
      })).unwrap();
      toast.success('Devolução registrada com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao registrar devolução');
    }
  };

  const handleProcessCredit = async (creditId, action) => {
    try {
      await dispatch(updateCredit({
        creditId,
        action,
      })).unwrap();
      toast.success(action === 'approve' ? 'Crédito aprovado com sucesso!' : 'Crédito rejeitado com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao processar crédito');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestão de Vendas</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setSelectedTab('sales')}
          className={`px-4 py-2 rounded ${
            selectedTab === 'sales' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Vendas
        </button>
        <button
          onClick={() => setSelectedTab('returns')}
          className={`px-4 py-2 rounded ${
            selectedTab === 'returns' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Trocas/Devoluções
        </button>
        <button
          onClick={() => setSelectedTab('credits')}
          className={`px-4 py-2 rounded ${
            selectedTab === 'credits' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Créditos
        </button>
      </div>

      {/* Loading States */}
      {(salesLoading || inventoryLoading || clientsLoading) ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {/* Sales Section */}
          {selectedTab === 'sales' && (
            <div>
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <h2 className="text-xl font-semibold mb-2">Nova Venda</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={selectedProduct?.id || ''}
                    onChange={(e) => {
                      const product = finishedProducts.find(p => p.id === e.target.value);
                      setSelectedProduct(product);
                    }}
                    className="w-full p-2 border rounded"
                    disabled={salesLoading || inventoryLoading || clientsLoading}
                  >
                    <option value="">Selecione um produto</option>
                    {finishedProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={saleQuantity}
                    onChange={(e) => setSaleQuantity(Number(e.target.value))}
                    placeholder="Quantidade"
                    className="w-full p-2 border rounded"
                    disabled={salesLoading || inventoryLoading || clientsLoading}
                  />
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-full p-2 border rounded"
                    disabled={salesLoading || inventoryLoading || clientsLoading}
                  >
                    <option value="cash">À Vista (Dinheiro/Pix)</option>
                    <option value="credit">A Prazo</option>
                  </select>
                  {paymentType === 'credit' && (
                    <input
                      type="date"
                      value={format(paymentDate, 'yyyy-MM-dd')}
                      onChange={(e) => setPaymentDate(new Date(e.target.value))}
                      className="w-full p-2 border rounded"
                      disabled={salesLoading || inventoryLoading || clientsLoading}
                    />
                  )}
                  <select
                    value={selectedClient?.id || ''}
                    onChange={(e) => {
                      const client = clients.find(c => c.id === e.target.value);
                      setSelectedClient(client);
                    }}
                    className="w-full p-2 border rounded"
                    disabled={salesLoading || inventoryLoading || clientsLoading}
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSale}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    disabled={salesLoading || inventoryLoading || clientsLoading}
                  >
                    {salesLoading || inventoryLoading || clientsLoading ? 'Processando...' : 'Realizar Venda'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Histórico de Vendas</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 border-b">Produto</th>
                        <th className="p-2 border-b">Cliente</th>
                        <th className="p-2 border-b">Quantidade</th>
                        <th className="p-2 border-b">Tipo de Pagamento</th>
                        <th className="p-2 border-b">Data de Pagamento</th>
                        <th className="p-2 border-b">Data da Venda</th>
                        <th className="p-2 border-b">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map(sale => (
                        <tr key={sale.id} className="border-b">
                          <td className="p-2">{sale.productName}</td>
                          <td className="p-2">{sale.clientName}</td>
                          <td className="p-2">{sale.quantity}</td>
                          <td className="p-2">{sale.paymentType === 'cash' ? 'À Vista' : 'A Prazo'}</td>
                          <td className="p-2">{sale.paymentDate ? format(new Date(sale.paymentDate), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</td>
                          <td className="p-2">{format(new Date(sale.saleDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                          <td className="p-2">
                            <button
                              onClick={() => handleReturn(sale.id, sale.quantity)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                              disabled={salesLoading || inventoryLoading || clientsLoading}
                            >
                              Devolver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Returns Section */}
          {selectedTab === 'returns' && (
            <div>
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Histórico de Devoluções</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 border-b">Venda</th>
                        <th className="p-2 border-b">Quantidade</th>
                        <th className="p-2 border-b">Motivo</th>
                        <th className="p-2 border-b">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales
                        .filter(sale => sale.status === 'returned')
                        .map(sale => (
                          <tr key={sale.id} className="border-b">
                            <td className="p-2">{sale.productName}</td>
                            <td className="p-2">{sale.quantity}</td>
                            <td className="p-2">{sale.returnReason}</td>
                            <td className="p-2">{format(new Date(sale.returnDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Credits Section */}
          {selectedTab === 'credits' && (
            <div>
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Créditos Pendentes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 border-b">Cliente</th>
                        <th className="p-2 border-b">Quantidade</th>
                        <th className="p-2 border-b">Status</th>
                        <th className="p-2 border-b">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingCredits.map(credit => (
                        <tr key={credit.id} className="border-b">
                          <td className="p-2">{credit.clientName}</td>
                          <td className="p-2">{credit.quantity}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded ${
                              credit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              credit.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {credit.status === 'pending' ? 'Pendente' :
                               credit.status === 'approved' ? 'Aprovado' :
                               'Rejeitado'}
                            </span>
                          </td>
                          <td className="p-2">
                            {credit.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleProcessCredit(credit.id, 'approve')}
                                  className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                                  disabled={salesLoading || inventoryLoading || clientsLoading}
                                >
                                  Aprovar
                                </button>
                                <button
                                  onClick={() => handleProcessCredit(credit.id, 'reject')}
                                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                  disabled={salesLoading || inventoryLoading || clientsLoading}
                                >
                                  Rejeitar
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Error States */}
      {(salesError || inventoryError || clientsError) && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {salesError || inventoryError || clientsError}
        </div>
      )}
    </div>
  );
};

export default SalesManagement;
