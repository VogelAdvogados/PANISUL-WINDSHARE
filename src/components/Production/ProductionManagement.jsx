import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProductionBatch, updateProductionBatch } from '../../features';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify';

const ProductionManagement = () => {
  const dispatch = useDispatch();
  const { batches, loading: productionLoading, error: productionError } = useSelector(state => state.production);
  const { rawMaterials, loading: inventoryLoading, error: inventoryError } = useSelector(state => state.inventory);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productionQuantity, setProductionQuantity] = useState(0);
  const [losses, setLosses] = useState(0);
  const [editBatch, setEditBatch] = useState(null);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchProductionBatches());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleAddProduction = async () => {
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

  const handleEditBatch = (batch) => {
    setEditBatch(batch);
  };

  const handleSaveBatch = async (batch) => {
    try {
      await dispatch(updateProductionBatch(batch)).unwrap();
      setEditBatch(null);
      toast.success('Lote atualizado com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao atualizar lote');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestão de Produção</h1>

      {/* Loading States */}
      {(productionLoading || inventoryLoading) ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Production Form */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">Nova Produção</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedProduct?.id || ''}
                onChange={(e) => {
                  const product = rawMaterials.find(p => p.id === e.target.value);
                  setSelectedProduct(product);
                }}
                className="w-full p-2 border rounded"
                disabled={productionLoading || inventoryLoading}
              >
                <option value="">Selecione um produto</option>
                {rawMaterials.map(material => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={productionQuantity}
                onChange={(e) => setProductionQuantity(Number(e.target.value))}
                placeholder="Quantidade"
                className="w-full p-2 border rounded"
                disabled={productionLoading || inventoryLoading}
              />
              <input
                type="number"
                value={losses}
                onChange={(e) => setLosses(Number(e.target.value))}
                placeholder="Perdas"
                className="w-full p-2 border rounded"
                disabled={productionLoading || inventoryLoading}
              />
              <button
                onClick={handleAddProduction}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={productionLoading || inventoryLoading}
              >
                {productionLoading || inventoryLoading ? 'Processando...' : 'Iniciar Produção'}
              </button>
            </div>
          </div>

          {/* Edit Batch Form */}
          {editBatch && (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h2 className="text-xl font-semibold mb-2">Editar Lote</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  value={editBatch.quantity}
                  onChange={(e) => setEditBatch({ ...editBatch, quantity: Number(e.target.value) })}
                  placeholder="Quantidade"
                  className="w-full p-2 border rounded"
                  disabled={productionLoading || inventoryLoading}
                />
                <input
                  type="number"
                  value={editBatch.losses}
                  onChange={(e) => setEditBatch({ ...editBatch, losses: Number(e.target.value) })}
                  placeholder="Perdas"
                  className="w-full p-2 border rounded"
                  disabled={productionLoading || inventoryLoading}
                />
                <button
                  onClick={() => handleSaveBatch(editBatch)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={productionLoading || inventoryLoading}
                >
                  {productionLoading || inventoryLoading ? 'Processando...' : 'Salvar'}
                </button>
                <button
                  onClick={() => setEditBatch(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
                  disabled={productionLoading || inventoryLoading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Error States */}
      {(productionError || inventoryError) && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {productionError || inventoryError}
        </div>
      )}

      {/* Production History */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Histórico de Produção</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 border-b">Produto</th>
                <th className="p-2 border-b">Quantidade</th>
                <th className="p-2 border-b">Perdas</th>
                <th className="p-2 border-b">Data</th>
                <th className="p-2 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {batches.map(batch => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{batch.productName}</td>
                  <td className="p-2 border-b">{batch.quantity} un</td>
                  <td className="p-2 border-b">{batch.losses} un</td>
                  <td className="p-2 border-b">{format(new Date(batch.productionDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                  <td className="p-2 border-b">
                    <button
                      onClick={() => handleEditBatch(batch)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      disabled={productionLoading || inventoryLoading}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteBatch(batch.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      disabled={productionLoading || inventoryLoading}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductionManagement;
