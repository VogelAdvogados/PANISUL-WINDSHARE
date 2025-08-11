import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BarcodeScanner = ({ onScan, isActive, onToggle }) => {
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);

  // Mock barcode scanning functionality
  const mockBarcodes = {
    '7891234567890': { id: 'farinha-trigo', name: 'Farinha de Trigo', type: 'ingredient' },
    '7891234567891': { id: 'fermento-biologico', name: 'Fermento Biológico', type: 'ingredient' },
    '7891234567892': { id: 'sal', name: 'Sal Refinado', type: 'ingredient' },
    '7891234567893': { id: 'acucar', name: 'Açúcar Cristal', type: 'ingredient' },
    '7891234567894': { id: 'oleo-vegetal', name: 'Óleo Vegetal', type: 'ingredient' }
  };

  const startScanning = async () => {
    setIsScanning(true);

    // Mock camera access and scanning
    try {
      // Simulate camera initialization delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful scan after 3 seconds
      setTimeout(() => {
        const mockBarcode = '7891234567890';
        const scannedItem = mockBarcodes?.[mockBarcode];

        if (scannedItem) {
          setScanResult(mockBarcode);
          onScan(scannedItem);
          setIsScanning(false);
        }
      }, 3000);

    } catch (error) {
      console.error('Camera access denied:', error);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanResult('');
  };

  const handleManualEntry = () => {
    const manualCode = prompt('Digite o código de barras:');
    if (manualCode && mockBarcodes?.[manualCode]) {
      setScanResult(manualCode);
      onScan(mockBarcodes?.[manualCode]);
    } else if (manualCode) {
      alert('Código de barras não encontrado no sistema.');
    }
  };

  if (!isActive) {
    return (
      <div className="p-4 bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Scan" size={20} className="text-muted-foreground" />
            <div>
              <h3 className="font-medium text-foreground">Scanner de Código de Barras</h3>
              <p className="text-sm text-muted-foreground">Verificação rápida de ingredientes</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            iconName="Camera"
            iconPosition="left"
          >
            Ativar Scanner
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon name="Camera" size={20} className="text-primary" />
          <div>
            <h3 className="font-medium text-foreground">Scanner Ativo</h3>
            <p className="text-sm text-muted-foreground">
              {isScanning ? 'Escaneando...' : 'Pronto para escanear'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          iconName="X"
        >
          Fechar
        </Button>
      </div>
      {/* Scanner Interface */}
      <div className="space-y-4">
        {/* Mock Camera View */}
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {isScanning ? (
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white text-sm">Escaneando código de barras...</p>
              </div>
            ) : (
              <div className="text-center">
                <Icon name="Scan" size={48} className="text-white/60 mx-auto mb-4" />
                <p className="text-white/80 text-sm">Posicione o código de barras na área de captura</p>
              </div>
            )}
          </div>

          {/* Scanning Overlay */}
          {isScanning && (
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-64 h-32 border-2 border-primary rounded-lg">
                  <div className="w-full h-0.5 bg-primary animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scan Result */}
        {scanResult && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-2 text-success">
              <Icon name="CheckCircle" size={16} />
              <span className="font-medium">Código escaneado: {scanResult}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {!isScanning ? (
            <>
              <Button
                onClick={startScanning}
                iconName="Play"
                iconPosition="left"
                className="flex-1"
              >
                Iniciar Escaneamento
              </Button>
              <Button
                variant="outline"
                onClick={handleManualEntry}
                iconName="Keyboard"
                iconPosition="left"
              >
                Entrada Manual
              </Button>
            </>
          ) : (
            <Button
              variant="destructive"
              onClick={stopScanning}
              iconName="Square"
              iconPosition="left"
              className="flex-1"
            >
              Parar Escaneamento
            </Button>
          )}
        </div>

        {/* Available Mock Barcodes for Testing */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">Códigos de Teste Disponíveis:</h4>
          <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
            {Object.entries(mockBarcodes)?.map(([code, item]) => (
              <div key={code} className="flex justify-between">
                <span>{item?.name}</span>
                <span className="font-mono">{code}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;