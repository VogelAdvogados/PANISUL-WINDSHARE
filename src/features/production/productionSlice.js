import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productionApi from '../../services/api/productionApi';

// Async Thunks
export const fetchProductionBatches = createAsyncThunk(
  'production/fetchProductionBatches',
  async (params = {}, thunkAPI) => {
    try {
      const response = await productionApi.getProductionBatches(params);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createProductionBatch = createAsyncThunk(
  'production/createProductionBatch',
  async (batchData, thunkAPI) => {
    try {
      const response = await productionApi.createProductionBatch(batchData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateProductionBatch = createAsyncThunk(
  'production/updateProductionBatch',
  async ({ id, batchData }, thunkAPI) => {
    try {
      const response = await productionApi.updateProductionBatch(id, batchData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const productionSlice = createSlice({
  name: 'production',
  initialState: {
    batches: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Production Batches
    builder
      .addCase(fetchProductionBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductionBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload;
      })
      .addCase(fetchProductionBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao carregar lotes de produção';
      })

      // Create Production Batch
      .addCase(createProductionBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductionBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.batches.push(action.payload);
      })
      .addCase(createProductionBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao criar lote de produção';
      })

      // Update Production Batch
      .addCase(updateProductionBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductionBatch.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.batches.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.batches[index] = action.payload;
        }
      })
      .addCase(updateProductionBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao atualizar lote de produção';
      });
  },
});

export const { clearError } = productionSlice.actions;
export default productionSlice.reducer;
