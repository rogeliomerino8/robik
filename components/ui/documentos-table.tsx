"use client";

import { useState } from "react";
import { Search, Upload, MoreHorizontal, Filter, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import DocumentDetailModal from "./document-detail-modal";
import UploadDocumentModal from "./upload-document-modal";

const mockDocuments = [
  {
    id: 1,
    nombre: "Contrato de Arrendamiento - Oficina Central",
    tipo: "Contrato",
    cliente: "Corporación ABC",
    fecha: "2024-01-15",
    categoria: "Legal",
    estado: "Activo",
    vencimiento: "2025-01-15"
  },
  {
    id: 2,
    nombre: "Póliza de Seguro Empresarial",
    tipo: "Póliza",
    cliente: "Seguros XYZ",
    fecha: "2024-02-20",
    categoria: "Financiero",
    estado: "Vigente",
    vencimiento: "2024-12-31"
  },
  {
    id: 3,
    nombre: "Escritura de Propiedad Industrial",
    tipo: "Escritura",
    cliente: "Inmobiliaria DEF",
    fecha: "2024-03-10",
    categoria: "Legal",
    estado: "Revisión",
    vencimiento: "2024-06-10"
  },
  {
    id: 4,
    nombre: "Acuerdo de Confidencialidad",
    tipo: "Acuerdo",
    cliente: "Tech Solutions",
    fecha: "2024-01-05",
    categoria: "Compliance",
    estado: "Activo",
    vencimiento: "2025-01-05"
  },
  {
    id: 5,
    nombre: "Contrato de Servicios Legales",
    tipo: "Contrato",
    cliente: "Bufete García & Asociados",
    fecha: "2024-02-28",
    categoria: "Legal",
    estado: "Vencido",
    vencimiento: "2024-11-28"
  },
  {
    id: 6,
    nombre: "Póliza de Responsabilidad Civil",
    tipo: "Póliza",
    cliente: "Constructora López",
    fecha: "2024-03-15",
    categoria: "Financiero",
    estado: "Vigente",
    vencimiento: "2025-03-15"
  },
  {
    id: 7,
    nombre: "Contrato de Compraventa Inmobiliaria",
    tipo: "Contrato",
    cliente: "Grupo Financiero Norte",
    fecha: "2024-04-02",
    categoria: "Legal",
    estado: "Activo",
    vencimiento: "2025-04-02"
  },
  {
    id: 8,
    nombre: "Acuerdo de Licencia de Software",
    tipo: "Acuerdo",
    cliente: "Transportes del Sur",
    fecha: "2024-01-20",
    categoria: "Compliance",
    estado: "Revisión",
    vencimiento: "2024-07-20"
  },
  {
    id: 9,
    nombre: "Contrato de Trabajo - Gerente General",
    tipo: "Contrato",
    cliente: "Manufactura Industrial",
    fecha: "2024-05-12",
    categoria: "Legal",
    estado: "Activo",
    vencimiento: "2025-05-12"
  },
  {
    id: 10,
    nombre: "Escritura de Constitución Societaria",
    tipo: "Escritura",
    cliente: "Servicios Profesionales",
    fecha: "2024-02-08",
    categoria: "Legal",
    estado: "Vigente",
    vencimiento: "2025-02-08"
  },
  {
    id: 11,
    nombre: "Póliza de Seguro de Vida Ejecutivos",
    tipo: "Póliza",
    cliente: "Comercializadora Este",
    fecha: "2024-03-22",
    categoria: "Financiero",
    estado: "Activo",
    vencimiento: "2025-03-22"
  },
  {
    id: 12,
    nombre: "Contrato de Distribución Exclusiva",
    tipo: "Contrato",
    cliente: "Consultora Estratégica",
    fecha: "2024-04-18",
    categoria: "Legal",
    estado: "Vencido",
    vencimiento: "2024-10-18"
  },
  {
    id: 13,
    nombre: "Acuerdo de Joint Venture",
    tipo: "Acuerdo",
    cliente: "Grupo Inmobiliario",
    fecha: "2024-01-30",
    categoria: "Compliance",
    estado: "Revisión",
    vencimiento: "2024-08-30"
  },
  {
    id: 14,
    nombre: "Contrato de Outsourcing IT",
    tipo: "Contrato",
    cliente: "Tecnología Avanzada",
    fecha: "2024-05-25",
    categoria: "Legal",
    estado: "Activo",
    vencimiento: "2025-05-25"
  },
  {
    id: 15,
    nombre: "Póliza de Seguro de Transporte",
    tipo: "Póliza",
    cliente: "Servicios Médicos",
    fecha: "2024-02-14",
    categoria: "Financiero",
    estado: "Vigente",
    vencimiento: "2025-02-14"
  },
  {
    id: 16,
    nombre: "Escritura de Hipoteca Comercial",
    tipo: "Escritura",
    cliente: "Distribuidora Nacional",
    fecha: "2024-06-03",
    categoria: "Legal",
    estado: "Activo",
    vencimiento: "2025-06-03"
  },
  {
    id: 17,
    nombre: "Contrato de Franquicia",
    tipo: "Contrato",
    cliente: "Empresa de Seguridad",
    fecha: "2024-03-07",
    categoria: "Legal",
    estado: "Revisión",
    vencimiento: "2024-09-07"
  },
  {
    id: 18,
    nombre: "Acuerdo de No Competencia",
    tipo: "Acuerdo",
    cliente: "Grupo Educativo",
    fecha: "2024-04-11",
    categoria: "Compliance",
    estado: "Activo",
    vencimiento: "2025-04-11"
  },
  {
    id: 19,
    nombre: "Contrato de Suministro de Materiales",
    tipo: "Contrato",
    cliente: "Servicios Legales Pro",
    fecha: "2024-01-25",
    categoria: "Legal",
    estado: "Vencido",
    vencimiento: "2024-07-25"
  },
  {
    id: 20,
    nombre: "Póliza de Seguro de Equipos",
    tipo: "Póliza",
    cliente: "Compañía de Seguros Premium",
    fecha: "2024-05-08",
    categoria: "Financiero",
    estado: "Vigente",
    vencimiento: "2025-05-08"
  },
  {
    id: 21,
    nombre: "Escritura de Fideicomiso",
    tipo: "Escritura",
    cliente: "Corporación ABC",
    fecha: "2024-02-29",
    categoria: "Legal",
    estado: "Activo",
    vencimiento: "2025-02-28"
  },
  {
    id: 22,
    nombre: "Contrato de Representación Legal",
    tipo: "Contrato",
    cliente: "Seguros XYZ",
    fecha: "2024-06-15",
    categoria: "Legal",
    estado: "Revisión",
    vencimiento: "2024-12-15"
  },
  {
    id: 23,
    nombre: "Acuerdo de Fusión Empresarial",
    tipo: "Acuerdo",
    cliente: "Inmobiliaria DEF",
    fecha: "2024-03-05",
    categoria: "Compliance",
    estado: "Activo",
    vencimiento: "2025-03-05"
  },
  {
    id: 24,
    nombre: "Contrato de Consultoría Estratégica",
    tipo: "Contrato",
    cliente: "Tech Solutions",
    fecha: "2024-04-20",
    categoria: "Legal",
    estado: "Vigente",
    vencimiento: "2025-04-20"
  },
  {
    id: 25,
    nombre: "Póliza de Seguro Cibernético",
    tipo: "Póliza",
    cliente: "Bufete García & Asociados",
    fecha: "2024-01-12",
    categoria: "Financiero",
    estado: "Activo",
    vencimiento: "2025-01-12"
  },
  {
    id: 26,
    nombre: "Escritura de Poder Notarial",
    tipo: "Escritura",
    cliente: "Constructora López",
    fecha: "2024-05-30",
    categoria: "Legal",
    estado: "Vencido",
    vencimiento: "2024-11-30"
  },
  {
    id: 27,
    nombre: "Contrato de Comodato de Equipos",
    tipo: "Contrato",
    cliente: "Grupo Financiero Norte",
    fecha: "2024-02-16",
    categoria: "Legal",
    estado: "Revisión",
    vencimiento: "2024-08-16"
  },
  {
    id: 28,
    nombre: "Acuerdo de Distribución Regional",
    tipo: "Acuerdo",
    cliente: "Transportes del Sur",
    fecha: "2024-06-08",
    categoria: "Compliance",
    estado: "Activo",
    vencimiento: "2025-06-08"
  },
  {
    id: 29,
    nombre: "Contrato de Servicios de Limpieza",
    tipo: "Contrato",
    cliente: "Manufactura Industrial",
    fecha: "2024-03-12",
    categoria: "Legal",
    estado: "Vigente",
    vencimiento: "2025-03-12"
  },
  {
    id: 30,
    nombre: "Póliza de Seguro de Errores y Omisiones",
    tipo: "Póliza",
    cliente: "Servicios Profesionales",
    fecha: "2024-04-25",
    categoria: "Financiero",
    estado: "Activo",
    vencimiento: "2025-04-25"
  },
  {
    id: 31,
    nombre: "Escritura de Usufructo",
    tipo: "Escritura",
    cliente: "Comercializadora Este",
    fecha: "2024-01-18",
    categoria: "Legal",
    estado: "Revisión",
    vencimiento: "2024-07-18"
  },
  {
    id: 32,
    nombre: "Contrato de Agencia Comercial",
    tipo: "Contrato",
    cliente: "Consultora Estratégica",
    fecha: "2024-05-14",
    categoria: "Legal",
    estado: "Activo",
    vencimiento: "2025-05-14"
  },
  {
    id: 33,
    nombre: "Acuerdo de Escrow",
    tipo: "Acuerdo",
    cliente: "Grupo Inmobiliario",
    fecha: "2024-02-22",
    categoria: "Compliance",
    estado: "Vencido",
    vencimiento: "2024-08-22"
  },
  {
    id: 34,
    nombre: "Contrato de Mantenimiento Técnico",
    tipo: "Contrato",
    cliente: "Tecnología Avanzada",
    fecha: "2024-06-18",
    categoria: "Legal",
    estado: "Vigente",
    vencimiento: "2025-06-18"
  },
  {
    id: 35,
    nombre: "Póliza de Seguro Médico Grupal",
    tipo: "Póliza",
    cliente: "Servicios Médicos",
    fecha: "2024-03-28",
    categoria: "Financiero",
    estado: "Activo",
    vencimiento: "2025-03-28"
  },
  {
    id: 36,
    nombre: "Escritura de Servidumbre",
    tipo: "Escritura",
    cliente: "Distribuidora Nacional",
    fecha: "2024-04-05",
    categoria: "Legal",
    estado: "Revisión",
    vencimiento: "2024-10-05"
  },
  {
    id: 37,
    nombre: "Contrato de Publicidad Digital",
    tipo: "Contrato",
    cliente: "Empresa de Seguridad",
    fecha: "2024-01-08",
    categoria: "Legal",
    estado: "Activo",
    vencimiento: "2025-01-08"
  },
  {
    id: 38,
    nombre: "Acuerdo de Transferencia de Tecnología",
    tipo: "Acuerdo",
    cliente: "Grupo Educativo",
    fecha: "2024-05-22",
    categoria: "Compliance",
    estado: "Vigente",
    vencimiento: "2025-05-22"
  },
  {
    id: 39,
    nombre: "Contrato de Auditoría Externa",
    tipo: "Contrato",
    cliente: "Servicios Legales Pro",
    fecha: "2024-02-11",
    categoria: "Legal",
    estado: "Vencido",
    vencimiento: "2024-08-11"
  },
  {
    id: 40,
    nombre: "Póliza de Seguro de Directores",
    tipo: "Póliza",
    cliente: "Compañía de Seguros Premium",
    fecha: "2024-06-26",
    categoria: "Financiero",
    estado: "Activo",
    vencimiento: "2025-06-26"
  },
  {
    id: 41,
    nombre: "Escritura de Anticresis",
    tipo: "Escritura",
    cliente: "Corporación ABC",
    fecha: "2024-03-18",
    categoria: "Legal",
    estado: "Revisión",
    vencimiento: "2024-09-18"
  },
  {
    id: 42,
    nombre: "Contrato de Hosting y Dominio",
    tipo: "Contrato",
    cliente: "Seguros XYZ",
    fecha: "2024-04-30",
    categoria: "Legal",
    estado: "Vigente",
    vencimiento: "2025-04-30"
  },
  {
    id: 43,
    nombre: "Acuerdo de Desarrollo de Software",
    tipo: "Acuerdo",
    cliente: "Inmobiliaria DEF",
    fecha: "2024-01-22",
    categoria: "Compliance",
    estado: "Activo",
    vencimiento: "2025-01-22"
  },
  {
    id: 44,
    nombre: "Contrato de Seguridad Privada",
    tipo: "Contrato",
    cliente: "Tech Solutions",
    fecha: "2024-05-16",
    categoria: "Legal",
    estado: "Vencido",
    vencimiento: "2024-11-16"
  },
  {
    id: 45,
    nombre: "Póliza de Seguro de Flota Vehicular",
    tipo: "Póliza",
    cliente: "Bufete García & Asociados",
    fecha: "2024-02-25",
    categoria: "Financiero",
    estado: "Activo",
    vencimiento: "2025-02-25"
  },
  {
    id: 46,
    nombre: "Escritura de Donación",
    tipo: "Escritura",
    cliente: "Constructora López",
    fecha: "2024-06-12",
    categoria: "Legal",
    estado: "Revisión",
    vencimiento: "2024-12-12"
  },
  {
    id: 47,
    nombre: "Contrato de Marketing Digital",
    tipo: "Contrato",
    cliente: "Grupo Financiero Norte",
    fecha: "2024-03-26",
    categoria: "Legal",
    estado: "Vigente",
    vencimiento: "2025-03-26"
  },
  {
    id: 48,
    nombre: "Acuerdo de Importación",
    tipo: "Acuerdo",
    cliente: "Transportes del Sur",
    fecha: "2024-04-14",
    categoria: "Compliance",
    estado: "Activo",
    vencimiento: "2025-04-14"
  },
  {
    id: 49,
    nombre: "Contrato de Capacitación Empresarial",
    tipo: "Contrato",
    cliente: "Manufactura Industrial",
    fecha: "2024-01-28",
    categoria: "Legal",
    estado: "Vencido",
    vencimiento: "2024-07-28"
  },
  {
    id: 50,
    nombre: "Póliza de Seguro Integral de Comercio",
    tipo: "Póliza",
    cliente: "Servicios Profesionales",
    fecha: "2024-05-20",
    categoria: "Financiero",
    estado: "Activo",
    vencimiento: "2025-05-20"
  },
  {
    id: 51,
    nombre: "Escritura de Cesión de Derechos",
    tipo: "Escritura",
    cliente: "Comercializadora Este",
    fecha: "2024-02-17",
    categoria: "Legal",
    estado: "Revisión",
    vencimiento: "2024-08-17"
  },
  {
    id: 52,
    nombre: "Contrato de Telecomunicaciones",
    tipo: "Contrato",
    cliente: "Consultora Estratégica",
    fecha: "2024-06-09",
    categoria: "Legal",
    estado: "Vigente",
    vencimiento: "2025-06-09"
  },
  {
    id: 53,
    nombre: "Acuerdo de Exportación",
    tipo: "Acuerdo",
    cliente: "Grupo Inmobiliario",
    fecha: "2024-03-31",
    categoria: "Compliance",
    estado: "Activo",
    vencimiento: "2025-03-31"
  }
];

const getEstadoBadge = (estado: string) => {
  const variants = {
    Activo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Vigente: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
    Revisión: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Vencido: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  };
  return variants[estado as keyof typeof variants] || "bg-gray-100 text-gray-800";
};

const getDocumentMetrics = () => {
  // Conteo por tipo
  const tiposCounts = mockDocuments.reduce((acc, doc) => {
    acc[doc.tipo] = (acc[doc.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Conteo por estado
  const estadosCounts = mockDocuments.reduce((acc, doc) => {
    acc[doc.estado] = (acc[doc.estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Conteo por categoría
  const categoriasCounts = mockDocuments.reduce((acc, doc) => {
    acc[doc.categoria] = (acc[doc.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Documentos en revisión vs sin revisión
  const enRevision = estadosCounts["Revisión"] || 0;
  const sinRevision = mockDocuments.length - enRevision;

  return {
    total: mockDocuments.length,
    tipos: tiposCounts,
    estados: estadosCounts,
    categorias: categoriasCounts,
    enRevision,
    sinRevision
  };
};

export const DocumentosTable = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");
  const [selectedDocument, setSelectedDocument] = useState<typeof mockDocuments[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleAction = (action: string, docId: number, docName: string) => {
    console.log(`${action} documento ${docId}: ${docName}`);
    
    if (action === 'ver') {
      const document = documents.find(doc => doc.id === docId);
      if (document) {
        setSelectedDocument(document);
        setIsModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  const handleDocumentUploaded = (newDocument: typeof mockDocuments[0]) => {
    setDocuments(prev => [newDocument, ...prev]);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "todos" || doc.tipo.toLowerCase() === tipoFilter;
    const matchesCategoria = categoriaFilter === "todas" || doc.categoria.toLowerCase() === categoriaFilter;
    
    return matchesSearch && matchesTipo && matchesCategoria;
  });

  const metrics = getDocumentMetrics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">
            Documentos
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestiona y analiza tus documentos legales
          </p>
        </div>
        <Button 
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium"
          aria-label="Cargar nuevo documento"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload size={18} className="mr-2" />
          Cargar Documento
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Documentos */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Documentos
            </CardTitle>
                                    <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.total}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Documentos registrados
            </p>
          </CardContent>
        </Card>

        {/* Estados Críticos */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Estados Críticos
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {(metrics.estados["Vencido"] || 0) + (metrics.estados["Revisión"] || 0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Vencidos: {metrics.estados["Vencido"] || 0} | En revisión: {metrics.estados["Revisión"] || 0}
            </p>
          </CardContent>
        </Card>

        {/* En Revisión */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              En Revisión
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.enRevision}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Sin revisión: {metrics.sinRevision}
            </p>
          </CardContent>
        </Card>

        {/* Activos */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Documentos Activos
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {(metrics.estados["Activo"] || 0) + (metrics.estados["Vigente"] || 0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Activos: {metrics.estados["Activo"] || 0} | Vigentes: {metrics.estados["Vigente"] || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipos de Documentos */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
              Tipos de Documentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(metrics.tipos).map(([tipo, count]) => (
              <div key={tipo} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{tipo}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(count / metrics.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Categorías */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
              Por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(metrics.categorias).map(([categoria, count]) => (
              <div key={categoria} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{categoria}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(count / metrics.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            aria-label="Buscar documentos"
          />
        </div>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="contrato">Contrato</SelectItem>
            <SelectItem value="póliza">Póliza</SelectItem>
            <SelectItem value="escritura">Escritura</SelectItem>
            <SelectItem value="acuerdo">Acuerdo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las categorías</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="financiero">Financiero</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10">
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableHead className="font-medium text-gray-900 dark:text-white">Documento</TableHead>
                <TableHead className="font-medium text-gray-900 dark:text-white">Tipo</TableHead>
                <TableHead className="font-medium text-gray-900 dark:text-white">Cliente</TableHead>
                <TableHead className="font-medium text-gray-900 dark:text-white">Fecha</TableHead>
                <TableHead className="font-medium text-gray-900 dark:text-white">Estado</TableHead>
                <TableHead className="font-medium text-gray-900 dark:text-white">Vencimiento</TableHead>
                <TableHead className="font-medium text-gray-900 dark:text-white text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow 
                  key={doc.id} 
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    <div className="max-w-xs truncate">{doc.nombre}</div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{doc.tipo}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">{doc.cliente}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {new Date(doc.fecha).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getEstadoBadge(doc.estado)} border-0 font-medium`}>
                      {doc.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {new Date(doc.vencimiento).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          aria-label={`Acciones para ${doc.nombre}`}
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem 
                          onClick={() => handleAction('ver', doc.id, doc.nombre)}
                          className="cursor-pointer"
                        >
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAction('descargar', doc.id, doc.nombre)}
                          className="cursor-pointer"
                        >
                          Descargar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAction('eliminar', doc.id, doc.nombre)}
                          className="cursor-pointer text-red-600 dark:text-red-400"
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
        Mostrando {filteredDocuments.length} de {documents.length} documentos
      </div>

      {/* Document Detail Modal */}
      <DocumentDetailModal
        document={selectedDocument}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentUploaded={handleDocumentUploaded}
      />
    </div>
  );
};

export default DocumentosTable; 