import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clientsApi from '../../services/api/clientsApi';

// Async Thunks
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (params = {}, thunkAPI) => {
    try {
      const response = await clientsApi.getClients(params);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (clientId, thunkAPI) => {
    try {
      const response = await clientsApi.getClientById(clientId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData, thunkAPI) => {
    try {
      const response = await clientsApi.createClient(clientData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, clientData }, thunkAPI) => {
    try {
      const response = await clientsApi.updateClient(id, clientData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (clientId, thunkAPI) => {
    try {
      await clientsApi.deleteClient(clientId);
      return clientId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchClientCredits = createAsyncThunk(
  'clients/fetchClientCredits',
  async (clientId, thunkAPI) => {
    try {
      const response = await clientsApi.getClientCredits(clientId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchClientHistory = createAsyncThunk(
  'clients/fetchClientHistory',
  async (clientId, thunkAPI) => {
    try {
      const response = await clientsApi.getClientHistory(clientId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    clients: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Clients
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao carregar clientes';
      })

      // Fetch Client by ID
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clients.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        } else {
          state.clients.push(action.payload);
        }
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao carregar cliente';
      })

      // Create Client
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients.push(action.payload);
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao adicionar cliente';
      })

      // Update Client
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clients.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao atualizar cliente';
      })

      // Delete Client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = state.clients.filter(c => c.id !== action.payload);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao deletar cliente';
      })

      // Fetch Client Credits
      .addCase(fetchClientCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientCredits.fulfilled, (state, action) => {
        state.loading = false;
        const client = state.clients.find(c => c.id === action.meta.clientId);
        if (client) {
          client.credits = action.payload;
        }
      })
      .addCase(fetchClientCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao carregar créditos do cliente';
      })

      // Fetch Client History
      .addCase(fetchClientHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientHistory.fulfilled, (state, action) => {
        state.loading = false;
        const client = state.clients.find(c => c.id === action.meta.clientId);
        if (client) {
          client.history = action.payload;
        }
      })
      .addCase(fetchClientHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao carregar histórico do cliente';
      });
  },
});

export const { clearError } = clientsSlice.actions;
export default clientsSlice.reducer;
