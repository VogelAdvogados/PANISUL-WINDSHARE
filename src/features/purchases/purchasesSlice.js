import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import purchasesApi from './purchasesApi';

const initialState = {
  purchases: [],
  suppliers: [],
  loading: false,
  error: null,
  selectedPurchase: null,
};

export const fetchPurchases = createAsyncThunk(
  'purchases/fetchPurchases',
  async () => {
    const response = await purchasesApi.getPurchases();
    return response.data;
  }
);

export const fetchSuppliers = createAsyncThunk(
  'purchases/fetchSuppliers',
  async () => {
    const response = await purchasesApi.getSuppliers();
    return response.data;
  }
);

export const addPurchase = createAsyncThunk(
  'purchases/addPurchase',
  async (purchaseData) => {
    const response = await purchasesApi.addPurchase(purchaseData);
    return response.data;
  }
);

export const addSupplier = createAsyncThunk(
  'purchases/addSupplier',
  async (supplierData) => {
    const response = await purchasesApi.addSupplier(supplierData);
    return response.data;
  }
);

export const importPurchaseDocument = createAsyncThunk(
  'purchases/importPurchaseDocument',
  async (file) => {
    const response = await purchasesApi.importDocument(file);
    return response.data;
  }
);

const purchasesSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedPurchase: (state, action) => {
      state.selectedPurchase = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.suppliers = action.payload;
      })
      .addCase(addPurchase.fulfilled, (state, action) => {
        state.purchases.push(action.payload);
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.suppliers.push(action.payload);
      })
      .addCase(importPurchaseDocument.fulfilled, (state, action) => {
        state.purchases.push(action.payload);
      });
  },
});

export const { clearError, setSelectedPurchase } = purchasesSlice.actions;
export default purchasesSlice.reducer;
