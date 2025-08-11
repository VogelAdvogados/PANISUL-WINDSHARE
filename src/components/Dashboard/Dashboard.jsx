import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProductionBatch, addSale } from '../../features';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { finishedProducts, loading: inventoryLoading, error: inventoryError } = useSelector(state => state.inventory);
  const { batches, loading: productionLoading, error: productionError } = useSelector(state => state.production);
  const { sales, loading: salesLoading, error: salesError } = useSelector(state => state.sales);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productionQuantity, setProductionQuantity] = useState(0);
  const [losses, setLosses] = useState(0);
  const [saleQuantity, setSaleQuantity] = useState(0);
  const [paymentType, setPaymentType] = useState('cash');
  const [paymentDate, setPaymentDate] = useState(new Date());

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
    dispatch(fetchProductionBatches());
    dispatch(fetchSales());
  }, [dispatch]);

  const handleProduction = async () => {
    if (!selectedProduct || productionQuantity <= 0) return;

    try {
      await dispatch(createProductionBatch({
        productId: selectedProduct.id,
        quantity: productionQuantity,
        losses,
      })).unwrap();

      // Reset form
      setSelectedProduct(null);
      setProductionQuantity(0);
      setLosses(0);
      toast.success('Produção iniciada com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao iniciar produção');
    }
  };

  const handleSale = async () => {
    if (!selectedProduct || saleQuantity <= 0) return;

    try {
      await dispatch(createSale({
        productId: selectedProduct.id,
        quantity: saleQuantity,
        paymentType,
        paymentDate,
        clientId: null, // Would be selected from client list
      })).unwrap();

      // Reset form
      setSelectedProduct(null);
      setSaleQuantity(0);
      setPaymentType('cash');
      setPaymentDate(new Date());
      toast.success('Venda realizada com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao realizar venda');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Painel de Controle</h1>

      {/* Production Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Produção</h2>
        {productionLoading ? (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const product = finishedProducts.find(p => p.id === e.target.value);
                setSelectedProduct(product);
              }}
              className="w-full p-2 border rounded"
              disabled={productionLoading}
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
              value={productionQuantity}
              onChange={(e) => setProductionQuantity(Number(e.target.value))}
              placeholder="Quantidade"
              className="w-full p-2 border rounded"
              disabled={productionLoading}
            />
            <input
              type="number"
              value={losses}
              onChange={(e) => setLosses(Number(e.target.value))}
              placeholder="Perdas"
              className="w-full p-2 border rounded"
              disabled={productionLoading}
            />
            <button
              onClick={handleProduction}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={productionLoading}
            >
              {productionLoading ? 'Processando...' : 'Iniciar Produção'}
            </button>
          </div>
        )}
        {productionError && (
          <div className="mt-2 text-red-500 text-sm">
            {productionError}
          </div>
        )}
      </div>

      {/* Sales Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Vendas</h2>
        {salesLoading ? (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const product = finishedProducts.find(p => p.id === e.target.value);
                setSelectedProduct(product);
              }}
              className="w-full p-2 border rounded"
              disabled={salesLoading}
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
              disabled={salesLoading}
            />
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={salesLoading}
            >
              <option value="cash">Dinheiro</option>
              <option value="credit">Crédito</option>
            </select>
            <input
              type="date"
              value={format(paymentDate, 'yyyy-MM-dd')}
              onChange={(e) => setPaymentDate(new Date(e.target.value))}
              className="w-full p-2 border rounded"
              disabled={salesLoading}
            />
            <button
              onClick={handleSale}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={salesLoading}
            >
              {salesLoading ? 'Processando...' : 'Realizar Venda'}
            </button>
          </div>
        )}
        {salesError && (
          <div className="mt-2 text-red-500 text-sm">
            {salesError}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Atividades Recentes</h2>
        <div className="space-y-2">
          {batches.slice(-5).map(batch => (
            <div key={batch.id} className="flex justify-between items-center p-2 border-b">
              <span>
                Produção de {batch.quantity} {selectedProduct?.name}
                {batch.losses > 0 && ` (${batch.losses} perdas)`}
              </span>
              <span>{format(batch.productionDate, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
            </div>
          ))}
          {sales.slice(-5).map(sale => (
            <div key={sale.id} className="flex justify-between items-center p-2 border-b">
              <span>
                Venda de {sale.quantity} {selectedProduct?.name}
                {sale.paymentType === 'credit' && ` (Crédito)`}
              </span>
              <span>{format(sale.saleDate, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
