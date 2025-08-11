import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPurchases,
  fetchSuppliers,
  addPurchase,
  addSupplier,
  importPurchaseDocument,
} from '../../features/purchases/purchasesSlice';
import { toast } from 'react-toastify';

const PurchaseManagement = () => {
  const dispatch = useDispatch();
  const { purchases, suppliers, loading, error, selectedPurchase } = useSelector(
    (state) => state.purchases
  );

  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    cnpj: '',
    address: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    dispatch(fetchPurchases());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Preview file content
      const reader = new FileReader();
      reader.onload = () => {
        // Show import modal with file preview
        setShowImportModal(true);
      };
      reader.readAsText(file);
    }
  };

  const handleImportDocument = async () => {
    try {
      const result = await dispatch(importPurchaseDocument(selectedFile)).unwrap();
      setParsedData(result);
      toast.success('Documento analisado com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao analisar documento');
    }
  };

  const handleAddSupplier = async () => {
    try {
      await dispatch(addSupplier(newSupplier)).unwrap();
      setNewSupplier({
        name: '',
        cnpj: '',
        address: '',
        phone: '',
        email: '',
      });
      toast.success('Fornecedor cadastrado com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao cadastrar fornecedor');
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      await dispatch(addPurchase(parsedData)).unwrap();
      setParsedData(null);
      setShowImportModal(false);
      toast.success('Compra registrada com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao registrar compra');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestão de Compras</h1>

      {/* Document Import Section */}
      <div className="mb-6">
        <button
          onClick={() => document.getElementById('fileInput').click()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Importar Compra'}
        </button>
        <input
          type="file"
          id="fileInput"
          accept=".xml,.pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Purchase List */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Histórico de Compras</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 border-b">Data</th>
                <th className="p-2 border-b">Fornecedor</th>
                <th className="p-2 border-b">Valor Total</th>
                <th className="p-2 border-b">Status</th>
                <th className="p-2 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="border-b">
                  <td className="p-2">{new Date(purchase.date).toLocaleDateString('pt-BR')}</td>
                  <td className="p-2">{purchase.supplier.name}</td>
                  <td className="p-2">R$ {purchase.totalValue.toFixed(2)}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded ${
                      purchase.status === 'completed' ? 'bg-green-100 text-green-800' :
                      purchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => dispatch(setSelectedPurchase(purchase))}
                      className="text-blue-500 hover:text-blue-700"
                      disabled={loading}
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold mb-4">Análise do Documento</h2>

              {/* Document Preview */}
              {selectedFile && (
                <div className="mb-4">
                  <h3 className="font-semibold">Arquivo selecionado:</h3>
                  <p>{selectedFile.name}</p>
                </div>
              )}

              {/* Parsed Data Review */}
              {parsedData && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Dados Extraídos:</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="font-medium">Fornecedor:</label>
                      <p>{parsedData.supplier.name}</p>
                    </div>
                    <div>
                      <label className="font-medium">Valor Total:</label>
                      <p>R$ {parsedData.totalValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="font-medium">Itens:</label>
                      <ul className="list-disc pl-4">
                        {parsedData.items.map((item, index) => (
                          <li key={index}>
                            {item.name} - {item.quantity} {item.unit} - R$ {item.value.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Supplier Registration */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Cadastro de Fornecedor:</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="CNPJ"
                    value={newSupplier.cnpj}
                    onChange={(e) => setNewSupplier({ ...newSupplier, cnpj: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Endereço"
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Telefone"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={handleAddSupplier}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                  >
                    Cadastrar Fornecedor
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between w-full">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={!parsedData}
                >
                  Confirmar e Lançar Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default PurchaseManagement;
