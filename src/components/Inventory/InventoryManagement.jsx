import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addRawMaterial, updateRawMaterial, addFinishedProduct, deductRawMaterial } from '../../features';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify';

const InventoryManagement = () => {
  const dispatch = useDispatch();
  const { rawMaterials, finishedProducts, alerts, loading: inventoryLoading, error: inventoryError } = useSelector(state => state.inventory);
  const [selectedTab, setSelectedTab] = useState('raw-materials');
  const [editMaterial, setEditMaterial] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const handleAddRawMaterial = () => {
    const newMaterial = {
      id: Date.now(),
      name: '',
      quantity: 0,
      unit: 'kg',
      minimumQuantity: 0,
      lastPurchasePrice: 0,
      purchaseDate: new Date(),
    };
    setEditMaterial(newMaterial);
  };

  const handleAddFinishedProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: '',
      quantity: 0,
      unit: 'un',
      price: 0,
    };
    setEditProduct(newProduct);
  };

  const handleSaveMaterial = async (material) => {
    try {
      if (material.id) {
        await dispatch(updateRawMaterial(material)).unwrap();
      } else {
        await dispatch(addRawMaterial(material)).unwrap();
      }
      setEditMaterial(null);
      toast.success(material.id ? 'Materia-prima atualizada com sucesso!' : 'Materia-prima adicionada com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao salvar materia-prima');
    }
  };

  const handleSaveProduct = async (product) => {
    try {
      if (product.id) {
        await dispatch(updateRawMaterial(product)).unwrap();
      } else {
        await dispatch(addFinishedProduct(product)).unwrap();
      }
      setEditProduct(null);
      toast.success(product.id ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao salvar produto');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestão de Estoque</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setSelectedTab('raw-materials')}
          className={`px-4 py-2 rounded ${
            selectedTab === 'raw-materials' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Matérias-Primas
        </button>
        <button
          onClick={() => setSelectedTab('finished-products')}
          className={`px-4 py-2 rounded ${
            selectedTab === 'finished-products' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Produtos Prontos
        </button>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold mb-2">Alertas de Estoque</h3>
          <ul>
            {alerts.map(alert => (
              <li key={alert.id} className="mb-1">
                {alert.message} - {format(alert.timestamp, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Raw Materials Section */}
      {selectedTab === 'raw-materials' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Matérias-Primas</h2>
            <button
              onClick={handleAddRawMaterial}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Adicionar Matéria-Prima
            </button>
          </div>

          {/* Edit Material Form */}
          {editMaterial && (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">Editar Matéria-Prima</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editMaterial.name}
                  onChange={(e) => setEditMaterial({ ...editMaterial, name: e.target.value })}
                  placeholder="Nome"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  value={editMaterial.quantity}
                  onChange={(e) => setEditMaterial({ ...editMaterial, quantity: Number(e.target.value) })}
                  placeholder="Quantidade"
                  className="w-full p-2 border rounded"
                />
                <select
                  value={editMaterial.unit}
                  onChange={(e) => setEditMaterial({ ...editMaterial, unit: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="kg">Kg</option>
                  <option value="g">g</option>
                  <option value="l">L</option>
                  <option value="ml">ml</option>
                </select>
                <input
                  type="number"
                  value={editMaterial.minimumQuantity}
                  onChange={(e) => setEditMaterial({ ...editMaterial, minimumQuantity: Number(e.target.value) })}
                  placeholder="Quantidade Mínima"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  value={editMaterial.lastPurchasePrice}
                  onChange={(e) => setEditMaterial({ ...editMaterial, lastPurchasePrice: Number(e.target.value) })}
                  placeholder="Preço de Compra"
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={() => handleSaveMaterial(editMaterial)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditMaterial(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Materials List */}
          <div className="bg-white rounded-lg shadow p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 border-b">Nome</th>
                  <th className="p-2 border-b">Quantidade</th>
                  <th className="p-2 border-b">Unidade</th>
                  <th className="p-2 border-b">Preço de Compra</th>
                  <th className="p-2 border-b">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rawMaterials.map(material => (
                  <tr key={material.id} className={`border-b ${
                    material.quantity < material.minimumQuantity ? 'bg-red-50' : ''
                  }`}>
                    <td className="p-2">{material.name}</td>
                    <td className="p-2">{material.quantity}</td>
                    <td className="p-2">{material.unit}</td>
                    <td className="p-2">R$ {material.lastPurchasePrice.toFixed(2)}</td>
                    <td className="p-2">
                      <button
                        onClick={() => setEditMaterial(material)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Finished Products Section */}
      {selectedTab === 'finished-products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Produtos Prontos</h2>
            <button
              onClick={handleAddFinishedProduct}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Adicionar Produto
            </button>
          </div>

          {/* Edit Product Form */}
          {editProduct && (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">Editar Produto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  placeholder="Nome"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  value={editProduct.quantity}
                  onChange={(e) => setEditProduct({ ...editProduct, quantity: Number(e.target.value) })}
                  placeholder="Quantidade"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                  placeholder="Preço de Venda"
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={() => handleSaveProduct(editProduct)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditProduct(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Products List */}
          <div className="bg-white rounded-lg shadow p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 border-b">Nome</th>
                  <th className="p-2 border-b">Quantidade</th>
                  <th className="p-2 border-b">Preço de Venda</th>
                  <th className="p-2 border-b">Ações</th>
                </tr>
              </thead>
              <tbody>
                {finishedProducts.map(product => (
                  <tr key={product.id} className="border-b">
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">{product.quantity}</td>
                    <td className="p-2">R$ {product.price.toFixed(2)}</td>
                    <td className="p-2">
                      <button
                        onClick={() => setEditProduct(product)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
