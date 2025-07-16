"use client";

import { useState, useEffect } from "react";
import { X, FileText, Eye, Download, Loader2, CheckCircle, AlertCircle, Clock, User, Calendar, Building, Tag, Shield } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Separator } from "./separator";
import { Progress } from "./progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

type Document = {
  id: number;
  nombre: string;
  tipo: string;
  cliente: string;
  fecha: string;
  categoria: string;
  estado: string;
  vencimiento: string;
};

type ProcessingStatus = "idle" | "processing" | "completed" | "error";

type DocumentSummary = {
  informacionGeneral: {
    titulo: string;
    tipo: string;
    cliente: string;
    fechaCreacion: string;
    fechaVencimiento: string;
    categoria: string;
    estado: string;
  };
  clausulasImportantes: Array<{
    titulo: string;
    contenido: string;
    tipo: string;
  }>;
  alertas: Array<{
    tipo: "error" | "warning" | "info";
    mensaje: string;
    fecha: string;
  }>;
  estadisticas: {
    diasRestantes: number;
    diasVigencia: number;
    progreso: number;
  };
};

const generateDocumentSummary = (doc: Document): DocumentSummary => {
  return {
    informacionGeneral: {
      titulo: doc.nombre,
      tipo: doc.tipo,
      cliente: doc.cliente,
      fechaCreacion: doc.fecha,
      fechaVencimiento: doc.vencimiento,
      categoria: doc.categoria,
      estado: doc.estado
    },
    clausulasImportantes: [
      {
        titulo: "Duración del Contrato",
        contenido: `El contrato tiene vigencia desde ${new Date(doc.fecha).toLocaleDateString('es-ES')} hasta ${new Date(doc.vencimiento).toLocaleDateString('es-ES')}.`,
        tipo: "duracion"
      },
      {
        titulo: "Obligaciones Principales",
        contenido: "Cumplimiento de pagos mensuales, mantenimiento de confidencialidad y entrega de reportes trimestrales.",
        tipo: "obligaciones"
      },
      {
        titulo: "Condiciones de Terminación",
        contenido: "El contrato puede ser terminado por cualquiera de las partes con 30 días de anticipación mediante notificación escrita.",
        tipo: "terminacion"
      },
      {
        titulo: "Penalizaciones",
        contenido: "En caso de incumplimiento, se aplicará una penalización del 2% mensual sobre el monto adeudado.",
        tipo: "penalizaciones"
      }
    ],
    alertas: [
      ...(doc.estado === 'Vencido' ? [{
        tipo: "error" as const,
        mensaje: "Este documento ya ha vencido",
        fecha: doc.vencimiento
      }] : []),
      ...(doc.estado === 'Revisión' ? [{
        tipo: "warning" as const,
        mensaje: "Documento en proceso de revisión",
        fecha: new Date().toISOString()
      }] : []),
      ...((new Date(doc.vencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) < 30 && doc.estado !== 'Vencido' ? [{
        tipo: "warning" as const,
        mensaje: "Documento próximo a vencer",
        fecha: doc.vencimiento
      }] : [])
    ],
    estadisticas: {
      diasRestantes: Math.ceil((new Date(doc.vencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      diasVigencia: Math.ceil((new Date(doc.vencimiento).getTime() - new Date(doc.fecha).getTime()) / (1000 * 60 * 60 * 24)),
      progreso: Math.max(0, Math.min(100, ((new Date().getTime() - new Date(doc.fecha).getTime()) / (new Date(doc.vencimiento).getTime() - new Date(doc.fecha).getTime())) * 100))
    }
  };
};

interface DocumentDetailModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentDetailModal = ({ document, isOpen, onClose }: DocumentDetailModalProps) => {
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>("idle");
  const [documentSummary, setDocumentSummary] = useState<DocumentSummary | null>(null);
  const [activeTab, setActiveTab] = useState("resumen");

  useEffect(() => {
    if (isOpen && document && processingStatus === "idle") {
      startProcessing();
    }
  }, [isOpen, document]);

  const startProcessing = async () => {
    setProcessingStatus("processing");
    
    // Simular procesamiento (2-3 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    if (document) {
      setDocumentSummary(generateDocumentSummary(document));
    }
    
    setProcessingStatus("completed");
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      Activo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Vigente: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
      Revisión: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Vencido: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return variants[estado as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case "error": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning": return <Clock className="h-4 w-4 text-yellow-500" />;
              default: return <CheckCircle className="h-4 w-4 text-primary" />;
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {document.nombre}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {document.cliente} • {document.tipo}
                </span>
                <Badge className={`${getEstadoBadge(document.estado)} border-0 text-xs`}>
                  {document.estado}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {processingStatus === "processing" && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analizando documento...</span>
              </div>
            )}
            {processingStatus === "completed" && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span>Análisis completado</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(90vh-120px)] overflow-hidden">
          {processingStatus === "processing" ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Analizando tu documento
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Estamos extrayendo y organizando la información más importante...
                  </p>
                </div>
                <div className="w-64 mx-auto">
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-gray-400 mt-2">Esto tomará solo unos segundos</p>
                </div>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="resumen" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Resumen
                  </TabsTrigger>
                  <TabsTrigger value="detalles" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Información Detallada
                  </TabsTrigger>
                  <TabsTrigger value="original" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Documento Original
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="resumen" className="p-6 space-y-6 m-0">
                  {documentSummary && (
                    <>
                      {/* Alertas */}
                      {documentSummary.alertas.length > 0 && (
                        <div className="space-y-3">
                                                     {documentSummary.alertas.map((alerta, index: number) => (
                            <div key={index} className={`p-4 rounded-lg border-l-4 ${
                              alerta.tipo === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                              'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                            }`}>
                              <div className="flex items-center gap-3">
                                {getAlertIcon(alerta.tipo)}
                                <span className={`font-medium ${
                                  alerta.tipo === 'error' ? 'text-red-900 dark:text-red-200' :
                                  'text-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {alerta.mensaje}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Información General */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-primary" />
                            Información General
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                                  <p className="font-medium">{documentSummary.informacionGeneral.cliente}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Tag className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Categoría</p>
                                  <p className="font-medium">{documentSummary.informacionGeneral.categoria}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Vigencia</p>
                                  <p className="font-medium">
                                    {documentSummary.estadisticas.diasRestantes > 0 
                                      ? `${documentSummary.estadisticas.diasRestantes} días restantes`
                                      : 'Vencido'
                                    }
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Shield className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                                  <Badge className={`${getEstadoBadge(documentSummary.informacionGeneral.estado)} border-0`}>
                                    {documentSummary.informacionGeneral.estado}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Progreso de vigencia */}
                          <div className="mt-6">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-500 dark:text-gray-400">Progreso de vigencia</span>
                              <span className="font-medium">{Math.round(documentSummary.estadisticas.progreso)}%</span>
                            </div>
                            <Progress value={documentSummary.estadisticas.progreso} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>{new Date(documentSummary.informacionGeneral.fechaCreacion).toLocaleDateString('es-ES')}</span>
                              <span>{new Date(documentSummary.informacionGeneral.fechaVencimiento).toLocaleDateString('es-ES')}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Cláusulas Importantes */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-green-500" />
                            Puntos Clave del Documento
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                                                         {documentSummary.clausulasImportantes.map((clausula, index: number) => (
                              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{clausula.titulo}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{clausula.contenido}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="detalles" className="p-6 m-0">
                  {documentSummary && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Información Completa del Documento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Detalles del Contrato</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Nombre del documento:</span>
                                <p className="font-medium">{documentSummary.informacionGeneral.titulo}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Tipo:</span>
                                <p className="font-medium">{documentSummary.informacionGeneral.tipo}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Fecha de creación:</span>
                                <p className="font-medium">{new Date(documentSummary.informacionGeneral.fechaCreacion).toLocaleDateString('es-ES')}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Fecha de vencimiento:</span>
                                <p className="font-medium">{new Date(documentSummary.informacionGeneral.fechaVencimiento).toLocaleDateString('es-ES')}</p>
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Términos y Condiciones Principales</h3>
                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                              <p>• <strong>Duración:</strong> {documentSummary.estadisticas.diasVigencia} días de vigencia total</p>
                              <p>• <strong>Renovación:</strong> Automática por períodos iguales salvo notificación contraria</p>
                              <p>• <strong>Modificaciones:</strong> Requieren acuerdo escrito de ambas partes</p>
                              <p>• <strong>Jurisdicción:</strong> Tribunales competentes del domicilio del contratante</p>
                              <p>• <strong>Notificaciones:</strong> Se realizarán por correo electrónico y carta certificada</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="original" className="p-6 m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Documento Original</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-4">
                        <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Documento PDF Original
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Ver el documento original en formato PDF para referencia completa
                          </p>
                          <div className="space-y-3">
                            <Button className="w-full max-w-xs">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver PDF Original
                            </Button>
                            <Button variant="outline" className="w-full max-w-xs">
                              <Download className="h-4 w-4 mr-2" />
                              Descargar PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailModal; 