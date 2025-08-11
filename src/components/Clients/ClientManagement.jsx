import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addClient, updateClient, addClientCredit, addClientHistory } from '../../features';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify';

const ClientManagement = () => {
  const dispatch = useDispatch();
  const { clients, loading: clientsLoading, error: clientsError } = useSelector(state => state.clients);
  const [selectedTab, setSelectedTab] = useState('clients');
  const [editClient, setEditClient] = useState(null);
  const [newCredit, setNewCredit] = useState({
    amount: 0,
    dueDate: new Date(),
    description: '',
  });

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchClients());
  }, [dispatch]);

  const handleAddClient = () => {
    setEditClient({
      id: null,
      name: '',
      phone: '',
      email: '',
      address: '',
      credits: [],
      history: [],
      totalPurchases: 0,
      totalReturns: 0,
    });
  };

  const handleSaveClient = async (client) => {
    try {
      if (client.id) {
        await dispatch(updateClient(client)).unwrap();
      } else {
        await dispatch(addClient(client)).unwrap();
      }
      setEditClient(null);
      toast.success(client.id ? 'Cliente atualizado com sucesso!' : 'Cliente adicionado com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao salvar cliente');
    }
  };

  const handleAddCredit = async (clientId) => {
    try {
      await dispatch(addClientCredit({
        clientId,
        credit: {
          amount: newCredit.amount,
          dueDate: newCredit.dueDate,
          description: newCredit.description,
          status: 'pending',
          createdAt: new Date(),
        },
      })).unwrap();
      setNewCredit({
        amount: 0,
        dueDate: new Date(),
        description: '',
      });
      toast.success('Crédito adicionado com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao adicionar crédito');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestão de Clientes</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setSelectedTab('clients')}
          className={`px-4 py-2 rounded ${
            selectedTab === 'clients' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Clientes
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
      {clientsLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Clients Section */}
          {selectedTab === 'clients' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Clientes</h2>
                <button
                  onClick={handleAddClient}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={clientsLoading}
                >
                  {clientsLoading ? 'Processando...' : 'Adicionar Cliente'}
                </button>
              </div>

              {/* Client Form */}
              {editClient && (
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <h2 className="text-xl font-semibold mb-2">{editClient.id ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editClient.name}
                      onChange={(e) => setEditClient({ ...editClient, name: e.target.value })}
                      placeholder="Nome"
                      className="w-full p-2 border rounded"
                      disabled={clientsLoading}
                    />
                    <input
                      type="text"
                      value={editClient.phone}
                      onChange={(e) => setEditClient({ ...editClient, phone: e.target.value })}
                      placeholder="Telefone"
                      className="w-full p-2 border rounded"
                      disabled={clientsLoading}
                    />
                    <input
                      type="email"
                      value={editClient.email}
                      onChange={(e) => setEditClient({ ...editClient, email: e.target.value })}
                      placeholder="Email"
                      className="w-full p-2 border rounded"
                      disabled={clientsLoading}
                    />
                    <input
                      type="text"
                      value={editClient.address}
                      onChange={(e) => setEditClient({ ...editClient, address: e.target.value })}
                      placeholder="Endereço"
                      className="w-full p-2 border rounded"
                      disabled={clientsLoading}
                    />
                    <button
                      onClick={() => handleSaveClient(editClient)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      disabled={clientsLoading}
                    >
                      {clientsLoading ? 'Processando...' : (editClient.id ? 'Salvar' : 'Adicionar')}
                    </button>
                    <button
                      onClick={() => setEditClient(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
                      disabled={clientsLoading}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Client List */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 border-b">Nome</th>
                        <th className="p-2 border-b">Telefone</th>
                        <th className="p-2 border-b">Email</th>
                        <th className="p-2 border-b">Total Compras</th>
                        <th className="p-2 border-b">Total Devoluções</th>
                        <th className="p-2 border-b">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map(client => (
                        <tr key={client.id} className="border-b">
                          <td className="p-2">{client.name}</td>
                          <td className="p-2">{client.phone}</td>
                          <td className="p-2">{client.email}</td>
                          <td className="p-2">R$ {client.totalPurchases.toFixed(2)}</td>
                          <td className="p-2">R$ {client.totalReturns.toFixed(2)}</td>
                          <td className="p-2">
                            <button
                              onClick={() => setEditClient(client)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                              disabled={clientsLoading}
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
                placeholder="Descrição"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={() => handleAddCredit(newCredit.clientId)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Adicionar Crédito
              </button>
            </div>
          </div>

          {/* Credits List */}
          <div className="bg-white rounded-lg shadow p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 border-b">Cliente</th>
                  <th className="p-2 border-b">Valor</th>
                  <th className="p-2 border-b">Vencimento</th>
                  <th className="p-2 border-b">Status</th>
                  <th className="p-2 border-b">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {clients.flatMap(client =>
                  client.credits?.map(credit => (
                    <tr key={credit.id} className={`border-b ${
                      credit.status === 'overdue' ? 'bg-red-50' : ''
                    }`}>
                      <td className="p-2">{client.name}</td>
                      <td className="p-2">R$ {credit.amount.toFixed(2)}</td>
                      <td className="p-2">
                        {format(credit.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded ${
                          credit.status === 'paid' ? 'bg-green-100 text-green-800' :
                          credit.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {credit.status === 'paid' ? 'Pago' :
                           credit.status === 'overdue' ? 'Vencido' :
                           'Pendente'}
                        </span>
                      </td>
                      <td className="p-2">{credit.description}</td>
                    </tr>
                  )) || []
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
