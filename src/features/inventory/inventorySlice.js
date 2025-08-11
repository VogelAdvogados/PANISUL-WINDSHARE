import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryApi from '../../services/api/inventoryApi';

// Async Thunks
export const fetchRawMaterials = createAsyncThunk(
  'inventory/fetchRawMaterials',
  async (params = {}, thunkAPI) => {
    try {
      const response = await inventoryApi.getRawMaterials(params);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchProductionBatches = createAsyncThunk(
  'inventory/fetchProductionBatches',
  async (params = {}, thunkAPI) => {
    try {
      const response = await inventoryApi.getProductionBatches(params);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addRawMaterial = createAsyncThunk(
  'inventory/addRawMaterial',
  async (materialData, thunkAPI) => {
    try {
      const response = await inventoryApi.createRawMaterial(materialData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateRawMaterial = createAsyncThunk(
  'inventory/updateRawMaterial',
  async ({ id, materialData }, thunkAPI) => {
    try {
      const response = await inventoryApi.updateRawMaterial(id, materialData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createProductionBatch = createAsyncThunk(
  'inventory/createProductionBatch',
  async (batchData, thunkAPI) => {
    try {
      const response = await inventoryApi.createProductionBatch(batchData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getInventoryAlerts = createAsyncThunk(
  'inventory/getInventoryAlerts',
  async (_, thunkAPI) => {
    try {
      const response = await inventoryApi.getInventoryAlerts();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    rawMaterials: [],
    productionBatches: [],
    alerts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Raw Materials
    builder
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.rawMaterials = action.payload;
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao carregar materiais';
      })

      // Fetch Production Batches
      .addCase(fetchProductionBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductionBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.productionBatches = action.payload;
      })
      .addCase(fetchProductionBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao carregar lotes de produção';
      })

      // Add Raw Material
      .addCase(addRawMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.rawMaterials.push(action.payload);
      })
      .addCase(addRawMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao adicionar material';
      })

      // Update Raw Material
      .addCase(updateRawMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rawMaterials.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.rawMaterials[index] = action.payload;
        }
      })
      .addCase(updateRawMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao atualizar material';
      })

      // Create Production Batch
      .addCase(createProductionBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductionBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.productionBatches.push(action.payload);
        // Update raw material quantity based on batch
        const material = state.rawMaterials.find(m => m.id === action.payload.raw_material_id);
        if (material) {
          material.quantity -= action.payload.quantity;
          // Check if below minimum and add alert
          if (material.quantity < material.minimum_quantity) {
            state.alerts.push({
              id: Date.now(),
              materialId: material.id,
              message: `Material ${material.name} abaixo do nível mínimo!`,
              timestamp: new Date(),
            });
          }
        }
      })
      .addCase(createProductionBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao criar lote de produção';
      })

      // Get Inventory Alerts
      .addCase(getInventoryAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInventoryAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(getInventoryAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Erro ao carregar alertas';
      });
  },
});

export const {
  clearError,
} = inventorySlice.actions;

export default inventorySlice.reducer;
