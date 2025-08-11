import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import RecipeSelector from './components/RecipeSelector';
import ProductionForm from './components/ProductionForm';
import BarcodeScanner from './components/BarcodeScanner';
import ProductionHistory from './components/ProductionHistory';
import Icon from '../../components/AppIcon';


const ProductionLoggingInterface = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [userRole, setUserRole] = useState('staff'); // 'staff' or 'manager'

  // Mock recipes data
  const recipes = [
    {
      id: 'pao-frances',
      name: 'Pão Francês',
      category: 'Pães Tradicionais',
      prepTime: 180,
      yield: 50,
      ingredients: [
        { id: 'farinha-trigo', name: 'Farinha de Trigo', amount: 1000, unit: 'g', minStock: 5000 },
        { id: 'fermento-biologico', name: 'Fermento Biológico', amount: 20, unit: 'g', minStock: 500 },
        { id: 'sal', name: 'Sal', amount: 20, unit: 'g', minStock: 1000 },
        { id: 'acucar', name: 'Açúcar', amount: 10, unit: 'g', minStock: 2000 }
      ]
    },
    {
      id: 'pao-forma',
      name: 'Pão de Forma',
      category: 'Pães Especiais',
      prepTime: 240,
      yield: 20,
      ingredients: [
        { id: 'farinha-trigo', name: 'Farinha de Trigo', amount: 800, unit: 'g', minStock: 5000 },
        { id: 'fermento-biologico', name: 'Fermento Biológico', amount: 15, unit: 'g', minStock: 500 },
        { id: 'sal', name: 'Sal', amount: 15, unit: 'g', minStock: 1000 },
        { id: 'acucar', name: 'Açúcar', amount: 30, unit: 'g', minStock: 2000 },
        { id: 'oleo-vegetal', name: 'Óleo Vegetal', amount: 50, unit: 'ml', minStock: 2000 },
        { id: 'leite', name: 'Leite', amount: 300, unit: 'ml', minStock: 5000 }
      ]
    },
    {
      id: 'pao-doce',
      name: 'Pão Doce',
      category: 'Pães Doces',
      prepTime: 200,
      yield: 30,
      ingredients: [
        { id: 'farinha-trigo', name: 'Farinha de Trigo', amount: 600, unit: 'g', minStock: 5000 },
        { id: 'fermento-biologico', name: 'Fermento Biológico', amount: 12, unit: 'g', minStock: 500 },
        { id: 'sal', name: 'Sal', amount: 8, unit: 'g', minStock: 1000 },
        { id: 'acucar', name: 'Açúcar', amount: 80, unit: 'g', minStock: 2000 },
        { id: 'ovos', name: 'Ovos', amount: 2, unit: 'unidades', minStock: 24 },
        { id: 'manteiga', name: 'Manteiga', amount: 60, unit: 'g', minStock: 1000 },
        { id: 'leite', name: 'Leite', amount: 200, unit: 'ml', minStock: 5000 }
      ]
    },
    {
      id: 'pao-integral',
      name: 'Pão Integral',
      category: 'Pães Saudáveis',
      prepTime: 220,
      yield: 40,
      ingredients: [
        { id: 'farinha-trigo', name: 'Farinha de Trigo Integral', amount: 900, unit: 'g', minStock: 5000 },
        { id: 'fermento-biologico', name: 'Fermento Biológico', amount: 18, unit: 'g', minStock: 500 },
        { id: 'sal', name: 'Sal', amount: 18, unit: 'g', minStock: 1000 },
        { id: 'acucar', name: 'Açúcar Mascavo', amount: 25, unit: 'g', minStock: 2000 },
        { id: 'oleo-vegetal', name: 'Óleo Vegetal', amount: 40, unit: 'ml', minStock: 2000 }
      ]
    },
    {
      id: 'croissant',
      name: 'Croissant',
      category: 'Folhados',
      prepTime: 360,
      yield: 24,
      ingredients: [
        { id: 'farinha-trigo', name: 'Farinha de Trigo', amount: 500, unit: 'g', minStock: 5000 },
        { id: 'fermento-biologico', name: 'Fermento Biológico', amount: 10, unit: 'g', minStock: 500 },
        { id: 'sal', name: 'Sal', amount: 10, unit: 'g', minStock: 1000 },
        { id: 'acucar', name: 'Açúcar', amount: 50, unit: 'g', minStock: 2000 },
        { id: 'manteiga', name: 'Manteiga', amount: 250, unit: 'g', minStock: 1000 },
        { id: 'leite', name: 'Leite', amount: 150, unit: 'ml', minStock: 5000 },
        { id: 'ovos', name: 'Ovos', amount: 1, unit: 'unidades', minStock: 24 }
      ]
    },
    {
      id: 'baguete',
      name: 'Baguete',
      category: 'Pães Artesanais',
      prepTime: 300,
      yield: 12,
      ingredients: [
        { id: 'farinha-trigo', name: 'Farinha de Trigo', amount: 800, unit: 'g', minStock: 5000 },
        { id: 'fermento-biologico', name: 'Fermento Biológico', amount: 8, unit: 'g', minStock: 500 },
        { id: 'sal', name: 'Sal', amount: 16, unit: 'g', minStock: 1000 }
      ]
    }
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + S to save (submit form)
      if ((e?.ctrlKey || e?.metaKey) && e?.key === 's') {
        e?.preventDefault();
        // Focus on submit button if form is filled
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton && !submitButton?.disabled) {
          submitButton?.click();
        }
      }

      // Ctrl/Cmd + H to toggle history
      if ((e?.ctrlKey || e?.metaKey) && e?.key === 'h') {
        e?.preventDefault();
        setIsHistoryVisible(!isHistoryVisible);
      }

      // Ctrl/Cmd + B to toggle barcode scanner
      if ((e?.ctrlKey || e?.metaKey) && e?.key === 'b') {
        e?.preventDefault();
        setIsScannerActive(!isScannerActive);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isHistoryVisible, isScannerActive]);

  // Auto-save functionality (mock)
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      // Mock auto-save logic
      const formData = localStorage.getItem('production-form-draft');
      if (formData) {
        console.log('Auto-saving form data...');
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, []);

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleProductionSubmit = async (productionData) => {
    try {
      // Mock API call
      console.log('Submitting production data:', productionData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock success response
      alert(`Produção registrada com sucesso!\nReceita: ${productionData?.recipeName}\nQuantidade: ${productionData?.quantity} unidades\nLote: ${productionData?.batchNumber}`);

      // Clear auto-save draft
      localStorage.removeItem('production-form-draft');

    } catch (error) {
      console.error('Error submitting production:', error);
      alert('Erro ao registrar produção. Tente novamente.');
    }
  };

  const handleBarcodeScanned = (scannedItem) => {
    console.log('Barcode scanned:', scannedItem);
    alert(`Ingrediente escaneado: ${scannedItem?.name}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <Helmet>
        <title>Registro de Produção - BreadCraft Manager</title>
        <meta name="description" content="Interface para registro de produção de pães com controle automático de estoque de ingredientes" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header
          onMenuToggle={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />

        {/* Main Content */}
        <main className={`pt-16 transition-all duration-300 ${
          isSidebarCollapsed ? 'content-with-sidebar-collapsed' : 'content-with-sidebar'
        } content-with-mobile-nav`}>
          <div className="h-[calc(100vh-4rem)] flex">
            {/* Recipe Selector Panel - 40% width on desktop */}
            <div className="w-full lg:w-2/5 border-r border-border">
              <RecipeSelector
                recipes={recipes}
                selectedRecipe={selectedRecipe}
                onRecipeSelect={handleRecipeSelect}
              />
            </div>

            {/* Production Form Panel - 60% width on desktop */}
            <div className="hidden lg:block lg:w-3/5">
              <ProductionForm
                selectedRecipe={selectedRecipe}
                onSubmit={handleProductionSubmit}
                userRole={userRole}
              />
            </div>
          </div>

          {/* Mobile Production Form - Full screen overlay */}
          {selectedRecipe && (
            <div className="lg:hidden fixed inset-0 bg-background z-40 pt-16">
              <div className="h-full">
                <ProductionForm
                  selectedRecipe={selectedRecipe}
                  onSubmit={handleProductionSubmit}
                  userRole={userRole}
                />
              </div>

              {/* Mobile Back Button */}
              <button
                onClick={() => setSelectedRecipe(null)}
                className="fixed top-20 left-4 z-50 p-2 bg-card border border-border rounded-lg shadow-lg"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
            </div>
          )}

          {/* Barcode Scanner */}
          {selectedRecipe && (
            <div className="fixed bottom-24 left-4 right-4 lg:bottom-6 lg:left-auto lg:right-80 lg:w-80 z-30">
              <BarcodeScanner
                onScan={handleBarcodeScanned}
                isActive={isScannerActive}
                onToggle={() => setIsScannerActive(!isScannerActive)}
              />
            </div>
          )}

          {/* Production History */}
          <ProductionHistory
            isVisible={isHistoryVisible}
            onToggle={() => setIsHistoryVisible(!isHistoryVisible)}
          />

          {/* Keyboard Shortcuts Help */}
          <div className="fixed bottom-6 left-6 z-20 hidden lg:block">
            <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">Atalhos do Teclado</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Ctrl+S - Salvar produção</div>
                <div>Ctrl+H - Histórico</div>
                <div>Ctrl+B - Scanner</div>
              </div>
            </div>
          </div>

          {/* User Role Toggle (for demo purposes) */}
          <div className="fixed top-20 right-6 z-20 hidden lg:block">
            <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">Modo de Usuário</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setUserRole('staff')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    userRole === 'staff' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Funcionário
                </button>
                <button
                  onClick={() => setUserRole('manager')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    userRole === 'manager' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Gerente
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductionLoggingInterface;