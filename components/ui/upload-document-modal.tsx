"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, FileText, Loader2, CheckCircle, AlertCircle, Camera, FolderOpen } from "lucide-react";
import Image from "next/image";
import { useToast } from "./toast";
import { Button } from "./button";
import { Card } from "./card";
import { Progress } from "./progress";
import { Badge } from "./badge";

type UploadStatus = "idle" | "uploading" | "processing" | "completed" | "error";

type ProcessingStep = {
  name: string;
  status: "pending" | "processing" | "completed" | "error";
  description: string;
};

interface UploadedFile {
  file: File;
  preview?: string;
}

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentUploaded: (document: {
    id: number;
    nombre: string;
    tipo: string;
    cliente: string;
    fecha: string;
    categoria: string;
    estado: string;
    vencimiento: string;
  }) => void;
}

const generateRandomDocument = (fileName: string) => {
  const tipos = ["Contrato", "Póliza", "Escritura", "Acuerdo"];
  const clientes = [
    "Corporación ABC", "Seguros XYZ", "Inmobiliaria DEF", "Tech Solutions",
    "Bufete García & Asociados", "Consultora Estratégica", "Grupo Financiero Norte"
  ];
  const categorias = ["Legal", "Financiero", "Compliance", "Comercial"];
  const estados = ["Activo", "Vigente", "Revisión"];

  const tipo = tipos[Math.floor(Math.random() * tipos.length)];
  const cliente = clientes[Math.floor(Math.random() * clientes.length)];
  const categoria = categorias[Math.floor(Math.random() * categorias.length)];
  const estado = estados[Math.floor(Math.random() * estados.length)];

  const fechaCreacion = new Date();
  fechaCreacion.setDate(fechaCreacion.getDate() - Math.floor(Math.random() * 365));
  
  const fechaVencimiento = new Date(fechaCreacion);
  fechaVencimiento.setDate(fechaVencimiento.getDate() + Math.floor(Math.random() * 365) + 180);

  return {
    id: Date.now(),
    nombre: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
    tipo,
    cliente,
    fecha: fechaCreacion.toISOString().split('T')[0],
    categoria,
    estado,
    vencimiento: fechaVencimiento.toISOString().split('T')[0]
  };
};

const UploadDocumentModal = ({ isOpen, onClose, onDocumentUploaded }: UploadDocumentModalProps) => {
  const { addToast } = useToast();
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { name: "Subida de archivo", status: "pending", description: "Cargando documento al servidor" },
    { name: "Análisis inicial", status: "pending", description: "Verificando formato y estructura" },
    { name: "Procesamiento OCR", status: "pending", description: "Extrayendo texto del documento" },
    { name: "Análisis semántico", status: "pending", description: "Identificando cláusulas importantes" },
    { name: "Clasificación", status: "pending", description: "Categorizando tipo de documento" },
    { name: "Finalización", status: "pending", description: "Guardando en la base de datos" }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetModal = () => {
    setUploadStatus("idle");
    setUploadedFile(null);
    setUploadProgress(0);
    setProcessingSteps(prev => prev.map(step => ({ ...step, status: "pending" })));
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const startUploadProcess = useCallback(async (file: File) => {
    setUploadStatus("uploading");
    
    // Simular subida con progreso
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Cambiar a procesamiento
    setUploadStatus("processing");
    
    // Procesar cada paso
    for (let i = 0; i < processingSteps.length; i++) {
      // Marcar paso actual como procesando
      setProcessingSteps(prev => 
        prev.map((step, index) => ({
          ...step,
          status: index === i ? "processing" : index < i ? "completed" : "pending"
        }))
      );

      // Simular tiempo de procesamiento variable
      const processingTime = 800 + Math.random() * 1200;
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Marcar como completado
      setProcessingSteps(prev => 
        prev.map((step, index) => ({
          ...step,
          status: index <= i ? "completed" : "pending"
        }))
      );
    }

    // Completar proceso
    setUploadStatus("completed");
    
    // Mostrar notificación de éxito
    addToast({
      type: "success",
      title: "¡Documento procesado exitosamente!",
      description: `${file.name} ha sido analizado y agregado a tu lista de documentos.`,
      duration: 4000
    });
    
    // Generar documento simulado y notificar al componente padre
    const newDocument = generateRandomDocument(file.name);
    setTimeout(() => {
      onDocumentUploaded(newDocument);
      handleClose();
    }, 1500);
  }, [processingSteps.length, addToast, onDocumentUploaded, handleClose]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validar tipo de archivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus("error");
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus("error");
      return;
    }

    // Crear preview para imágenes
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedFile({
            file,
            preview: e.target.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedFile({ file });
    }

    // Iniciar proceso de subida
    startUploadProcess(file);
  }, [startUploadProcess]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Subir Documento
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sube un PDF o imagen para análisis automático
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {uploadStatus === "idle" && (
            <>
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Arrastra tu documento aquí
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  o haz clic para seleccionar un archivo
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Seleccionar Archivo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* File Types */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Documentos PDF</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Contratos, pólizas, escrituras</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Camera className="h-8 w-8 text-green-500" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Imágenes</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG de documentos</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Requirements */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Requisitos:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Tamaño máximo: 10MB</li>
                  <li>• Formatos: PDF, JPG, PNG</li>
                  <li>• Resolución mínima: 300 DPI (para imágenes)</li>
                </ul>
              </div>
            </>
          )}

          {(uploadStatus === "uploading" || uploadStatus === "processing" || uploadStatus === "completed" || uploadStatus === "error") && uploadedFile && (
            <>
              {/* File Preview */}
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  {uploadedFile.preview ? (
                    <Image 
                      src={uploadedFile.preview} 
                      alt="Preview" 
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover rounded border"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
                      <FileText className="h-8 w-8 text-red-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{uploadedFile.file.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Badge className={
                    uploadStatus === "completed" ? "bg-green-100 text-green-800" :
                    uploadStatus === "error" ? "bg-red-100 text-red-800" :
                    "bg-primary/10 text-primary"
                  }>
                    {uploadStatus === "uploading" ? "Subiendo..." :
                     uploadStatus === "processing" ? "Procesando..." :
                     uploadStatus === "completed" ? "Completado" : "Error"}
                  </Badge>
                </div>
              </Card>

              {/* Progress */}
              {uploadStatus === "uploading" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Subiendo archivo...</span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Processing Steps */}
              {(uploadStatus === "processing" || uploadStatus === "completed") && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Procesamiento con IA</h4>
                  <div className="space-y-3">
                    {processingSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {getStatusIcon(step.status)}
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            step.status === "completed" ? "text-green-600 dark:text-green-400" :
                            step.status === "processing" ? "text-primary" :
                            "text-gray-500 dark:text-gray-400"
                          }`}>
                            {step.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {uploadStatus === "completed" && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-200">
                        ¡Documento procesado exitosamente!
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Tu documento ha sido analizado y agregado a la tabla.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {uploadStatus === "error" && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-200">Error en la subida</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    El archivo no cumple con los requisitos. Verifica el formato y tamaño.
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 text-red-600 border-red-300 hover:bg-red-50"
                onClick={resetModal}
              >
                Intentar de nuevo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentModal; 