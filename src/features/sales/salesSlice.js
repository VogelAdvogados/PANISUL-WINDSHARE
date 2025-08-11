import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import salesApi from '../../services/api/salesApi';

// Async Thunks
export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (params = {}, thunkAPI) => {
    try {
      const response = await salesApi.getSales(params);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchCredits = createAsyncThunk(
  'sales/fetchCredits',
  async (params = {}, thunkAPI) => {
    try {
      const response = await salesApi.getCredits(params);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createSale = createAsyncThunk(
  'sales/createSale',
  async (saleData, thunkAPI) => {
    try {
      const response = await salesApi.createSale(saleData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createReturn = createAsyncThunk(
  'sales/createReturn',
  async ({ saleId, returnData }, thunkAPI) => {
    try {
      const response = await salesApi.createReturn(saleId, returnData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateCredit = createAsyncThunk(
  'sales/updateCredit',
  async ({ creditId, creditData }, thunkAPI) => {
    try {
      const response = await salesApi.updateCredit(creditId, creditData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    sales: [],
    credits: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Sales
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao carregar vendas';
      })

      // Fetch Credits
      .addCase(fetchCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.credits = action.payload;
      })
      .addCase(fetchCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao carregar créditos';
      })

      // Create Sale
      .addCase(createSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.loading = false;
        state.sales.push(action.payload);
      })
      .addCase(createSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao criar venda';
      })

      // Create Return
      .addCase(createReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReturn.fulfilled, (state, action) => {
        state.loading = false;
        const saleIndex = state.sales.findIndex(s => s.id === action.payload.saleId);
        if (saleIndex !== -1) {
          state.sales[saleIndex] = action.payload.sale;
          state.credits.push(action.payload.credit);
        }
      })
      .addCase(createReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao processar devolução';
      })

      // Update Credit
      .addCase(updateCredit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCredit.fulfilled, (state, action) => {
        state.loading = false;
        const creditIndex = state.credits.findIndex(c => c.id === action.payload.id);
        if (creditIndex !== -1) {
          state.credits[creditIndex] = action.payload;
        }
      })
      .addCase(updateCredit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao atualizar crédito';
      });
  },
});

export const { clearError } = salesSlice.actions;
export default salesSlice.reducer;
