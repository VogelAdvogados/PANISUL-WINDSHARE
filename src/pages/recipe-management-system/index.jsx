import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import RecipeLibrary from './components/RecipeLibrary';
import RecipeForm from './components/RecipeForm';
import BatchScalingCalculator from './components/BatchScalingCalculator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RecipeManagementSystem = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showScalingCalculator, setShowScalingCalculator] = useState(false);
  const [userRole, setUserRole] = useState('manager'); // 'admin', 'manager', 'production'

  // Mock data for recipes
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: "Pão Francês Tradicional",
      description: "Receita clássica de pão francês com crosta crocante e miolo macio",
      category: "Pães Salgados",
      yield: 20,
      prepTime: 45,
      cookTime: 25,
      totalTime: 70,
      difficulty: "medium",
      status: "active",
      totalCost: 8.50,
      costPerUnit: 0.425,
      lastModified: "2025-01-03T10:30:00Z",
      modifiedBy: "Maria Silva",
      ingredients: [
        { id: 1, ingredientId: 1, quantity: 1000, unit: "g", notes: "Farinha de trigo especial" },
        { id: 2, ingredientId: 2, quantity: 600, unit: "ml", notes: "Água filtrada em temperatura ambiente" },
        { id: 3, ingredientId: 3, quantity: 10, unit: "g", notes: "Fermento biológico seco" },
        { id: 4, ingredientId: 4, quantity: 20, unit: "g", notes: "Sal refinado" },
        { id: 5, ingredientId: 5, quantity: 15, unit: "ml", notes: "Óleo de soja" }
      ],
      instructions: `1. Em uma tigela grande, misture a farinha com o sal.\n2. Dissolva o fermento na água morna.\n3. Adicione a água com fermento à farinha e misture bem.\n4. Adicione o óleo e sove a massa por 10 minutos até ficar lisa.\n5. Deixe descansar por 1 hora em local abrigado.\n6. Divida a massa em 20 porções e modele os pães.\n7. Deixe crescer por mais 30 minutos.\n8. Asse em forno pré-aquecido a 220°C por 25 minutos.`,
      notes: "Para uma crosta mais dourada, borrife água no forno nos primeiros 5 minutos de cozimento.",
      tags: ["tradicional", "básico", "popular"]
    },
    {
      id: 2,
      name: "Pão Doce com Goiabada",
      description: "Pão doce macio recheado com goiabada cremosa",
      category: "Pães Doces",
      yield: 15,
      prepTime: 60,
      cookTime: 30,
      totalTime: 90,
      difficulty: "medium",
      status: "active",
      totalCost: 12.75,
      costPerUnit: 0.85,
      lastModified: "2025-01-02T14:15:00Z",
      modifiedBy: "João Santos",
      ingredients: [
        { id: 1, ingredientId: 1, quantity: 800, unit: "g", notes: "Farinha de trigo especial" },
        { id: 2, ingredientId: 6, quantity: 300, unit: "ml", notes: "Leite integral morno" },
        { id: 3, ingredientId: 7, quantity: 100, unit: "g", notes: "Açúcar cristal" },
        { id: 4, ingredientId: 8, quantity: 80, unit: "g", notes: "Manteiga sem sal" },
        { id: 5, ingredientId: 9, quantity: 2, unit: "unidade", notes: "Ovos grandes" },
        { id: 6, ingredientId: 10, quantity: 300, unit: "g", notes: "Goiabada cremosa" }
      ],
      instructions: `1. Misture a farinha, açúcar e sal em uma tigela.\n2. Aqueça o leite e dissolva o fermento.\n3. Adicione o leite, ovos e manteiga à farinha.\n4. Sove até obter uma massa lisa e elástica.\n5. Deixe crescer por 1 hora.\n6. Abra a massa, adicione a goiabada e modele os pães.\n7. Deixe crescer por 45 minutos.\n8. Pincele com ovo batido e asse a 180°C por 30 minutos.`,
      notes: "Pode substituir a goiabada por doce de leite ou chocolate.",
      tags: ["doce", "recheado", "festa"]
    },
    {
      id: 3,
      name: "Pão Integral com Sementes",
      description: "Pão nutritivo com farinha integral e mix de sementes",
      category: "Pães Integrais",
      yield: 12,
      prepTime: 50,
      cookTime: 40,
      totalTime: 90,
      difficulty: "medium",
      status: "active",
      totalCost: 15.60,
      costPerUnit: 1.30,
      lastModified: "2025-01-01T09:20:00Z",
      modifiedBy: "Ana Costa",
      ingredients: [
        { id: 1, ingredientId: 11, quantity: 600, unit: "g", notes: "Farinha de trigo integral" },
        { id: 2, ingredientId: 1, quantity: 200, unit: "g", notes: "Farinha de trigo branca" },
        { id: 3, ingredientId: 2, quantity: 450, unit: "ml", notes: "Água morna" },
        { id: 4, ingredientId: 12, quantity: 30, unit: "g", notes: "Mix de sementes (girassol, linhaça, gergelim)" },
        { id: 5, ingredientId: 13, quantity: 15, unit: "ml", notes: "Mel" }
      ],
      instructions: `1. Misture as farinhas e as sementes.\n2. Dissolva o fermento na água morna com mel.\n3. Combine todos os ingredientes e sove bem.\n4. Deixe crescer por 1h30.\n5. Modele os pães e deixe crescer por 1 hora.\n6. Asse a 200°C por 40 minutos.`,
      notes: "Rico em fibras e proteínas. Ideal para café da manhã saudável.",
      tags: ["integral", "saudável", "sementes"]
    }
  ]);

  // Mock data for available ingredients
  const availableIngredients = [
    { id: 1, name: "Farinha de Trigo Especial", unit: "kg", stock: 50, costPerUnit: 4.50 },
    { id: 2, name: "Água", unit: "l", stock: 100, costPerUnit: 0.01 },
    { id: 3, name: "Fermento Biológico Seco", unit: "g", stock: 500, costPerUnit: 0.08 },
    { id: 4, name: "Sal Refinado", unit: "kg", stock: 10, costPerUnit: 2.00 },
    { id: 5, name: "Óleo de Soja", unit: "l", stock: 5, costPerUnit: 6.50 },
    { id: 6, name: "Leite Integral", unit: "l", stock: 20, costPerUnit: 4.20 },
    { id: 7, name: "Açúcar Cristal", unit: "kg", stock: 25, costPerUnit: 3.80 },
    { id: 8, name: "Manteiga sem Sal", unit: "kg", stock: 8, costPerUnit: 18.00 },
    { id: 9, name: "Ovos", unit: "unidade", stock: 60, costPerUnit: 0.75 },
    { id: 10, name: "Goiabada Cremosa", unit: "kg", stock: 5, costPerUnit: 12.00 },
    { id: 11, name: "Farinha de Trigo Integral", unit: "kg", stock: 15, costPerUnit: 6.20 },
    { id: 12, name: "Mix de Sementes", unit: "kg", stock: 3, costPerUnit: 25.00 },
    { id: 13, name: "Mel", unit: "l", stock: 2, costPerUnit: 35.00 }
  ];

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setIsEditing(false);
  };

  const handleCreateNew = () => {
    const newRecipe = {
      id: Date.now(),
      name: '',
      description: '',
      category: '',
      yield: 1,
      prepTime: 30,
      cookTime: 0,
      totalTime: 30,
      difficulty: 'medium',
      status: 'active',
      ingredients: [],
      instructions: '',
      notes: '',
      tags: [],
      totalCost: 0,
      costPerUnit: 0,
      lastModified: new Date()?.toISOString(),
      modifiedBy: userRole === 'admin' ? 'Admin User' : 'Manager User'
    };
    setSelectedRecipe(newRecipe);
    setIsEditing(true);
  };

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setIsEditing(true);
  };

  const handleDuplicateRecipe = (recipe) => {
    const duplicatedRecipe = {
      ...recipe,
      id: Date.now(),
      name: `${recipe?.name} (Cópia)`,
      lastModified: new Date()?.toISOString(),
      modifiedBy: userRole === 'admin' ? 'Admin User' : 'Manager User'
    };
    setSelectedRecipe(duplicatedRecipe);
    setIsEditing(true);
  };

  const handleDeleteRecipe = (recipe) => {
    if (window.confirm(`Tem certeza que deseja excluir a receita "${recipe?.name}"?`)) {
      setRecipes(prev => prev?.filter(r => r?.id !== recipe?.id));
      if (selectedRecipe?.id === recipe?.id) {
        setSelectedRecipe(null);
        setIsEditing(false);
      }
    }
  };

  const handleSaveRecipe = (recipeData) => {
    if (recipeData?.id && recipes?.find(r => r?.id === recipeData?.id)) {
      // Update existing recipe
      setRecipes(prev => prev?.map(r => r?.id === recipeData?.id ? recipeData : r));
    } else {
      // Add new recipe
      const newRecipe = {
        ...recipeData,
        id: recipeData?.id || Date.now()
      };
      setRecipes(prev => [...prev, newRecipe]);
    }

    setSelectedRecipe(recipeData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (selectedRecipe && !recipes?.find(r => r?.id === selectedRecipe?.id)) {
      // If it's a new recipe that wasn't saved, clear selection
      setSelectedRecipe(null);
    }
    setIsEditing(false);
  };

  const handleShowScalingCalculator = () => {
    setShowScalingCalculator(true);
  };

  const handleApplyScaling = (scaledRecipe) => {
    setSelectedRecipe(scaledRecipe);
    setIsEditing(true);
    setShowScalingCalculator(false);
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={handleMenuToggle}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleSidebarToggle}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      }`}>
        <div className="h-[calc(100vh-4rem)] flex">
          {/* Recipe Library - Left Panel */}
          <div className="w-full lg:w-[30%] flex-shrink-0">
            <RecipeLibrary
              recipes={recipes}
              selectedRecipe={selectedRecipe}
              onSelectRecipe={handleSelectRecipe}
              onCreateNew={handleCreateNew}
              onEditRecipe={handleEditRecipe}
              onDuplicateRecipe={handleDuplicateRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              userRole={userRole}
            />
          </div>

          {/* Main Content Area - Right Panel */}
          <div className="hidden lg:block flex-1 border-l border-border">
            {isEditing ? (
              <RecipeForm
                recipe={selectedRecipe}
                availableIngredients={availableIngredients}
                onSave={handleSaveRecipe}
                onCancel={handleCancelEdit}
                userRole={userRole}
                isNew={!selectedRecipe || !recipes?.find(r => r?.id === selectedRecipe?.id)}
              />
            ) : selectedRecipe ? (
              <div className="h-full flex flex-col">
                {/* Recipe Header */}
                <div className="flex-shrink-0 p-6 border-b border-border bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-foreground mb-2">
                        {selectedRecipe?.name}
                      </h1>
                      <p className="text-muted-foreground mb-4">
                        {selectedRecipe?.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Icon name="Clock" size={16} />
                          <span>{selectedRecipe?.prepTime + selectedRecipe?.cookTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Users" size={16} />
                          <span>{selectedRecipe?.yield} unidades</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="DollarSign" size={16} />
                          <span>R$ {selectedRecipe?.costPerUnit?.toFixed(2)}/unidade</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {userRole !== 'production' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShowScalingCalculator}
                            iconName="Calculator"
                            iconPosition="left"
                            iconSize={16}
                          >
                            Escalar
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleEditRecipe(selectedRecipe)}
                            iconName="Edit"
                            iconPosition="left"
                            iconSize={16}
                          >
                            Editar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <RecipeForm
                    recipe={selectedRecipe}
                    availableIngredients={availableIngredients}
                    onSave={() => {}}
                    onCancel={() => {}}
                    userRole="production" // Force read-only mode for viewing
                    isNew={false}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <Icon name="BookOpen" size={64} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Selecione uma receita
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Escolha uma receita da biblioteca para visualizar ou editar
                  </p>
                  {userRole !== 'production' && (
                    <Button
                      variant="default"
                      onClick={handleCreateNew}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Criar Nova Receita
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Recipe View Overlay */}
        {(selectedRecipe || isEditing) && (
          <div className="lg:hidden fixed inset-0 bg-background z-50 pt-16">
            {isEditing ? (
              <RecipeForm
                recipe={selectedRecipe}
                availableIngredients={availableIngredients}
                onSave={handleSaveRecipe}
                onCancel={handleCancelEdit}
                userRole={userRole}
                isNew={!selectedRecipe || !recipes?.find(r => r?.id === selectedRecipe?.id)}
              />
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex-shrink-0 p-4 border-b border-border bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRecipe(null)}
                      iconName="ArrowLeft"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Voltar
                    </Button>
                    {userRole !== 'production' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleEditRecipe(selectedRecipe)}
                        iconName="Edit"
                        iconPosition="left"
                        iconSize={16}
                      >
                        Editar
                      </Button>
                    )}
                  </div>
                  <h1 className="text-xl font-bold text-foreground mb-2">
                    {selectedRecipe?.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecipe?.description}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <RecipeForm
                    recipe={selectedRecipe}
                    availableIngredients={availableIngredients}
                    onSave={() => {}}
                    onCancel={() => {}}
                    userRole="production" // Force read-only mode
                    isNew={false}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Batch Scaling Calculator Modal */}
        {showScalingCalculator && (
          <BatchScalingCalculator
            recipe={selectedRecipe}
            onClose={() => setShowScalingCalculator(false)}
            onApplyScaling={handleApplyScaling}
          />
        )}
      </main>
    </div>
  );
};

export default RecipeManagementSystem;