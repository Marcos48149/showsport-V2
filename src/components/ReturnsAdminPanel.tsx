"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReturns, type ReturnRequest } from "@/contexts/ReturnsContext";
import {
  Package,
  RefreshCw,
  CheckCircle,
  XCircle,
  Truck,
  Search,
  Filter,
  Download,
  Mail,
  MessageCircle,
  Eye,
  Edit
} from "lucide-react";

export default function ReturnsAdminPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReturnRequest['status']>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "change" | "return">("all");
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { state, updateReturnStatus, processRefund, generateShippingLabel, generateCoupon } = useReturns();

  // Mock data for demonstration - in real app this would come from API
  const mockRequests: ReturnRequest[] = [
    {
      id: "RET-001",
      orderNumber: "ORD-123456",
      customerEmail: "juan.perez@email.com",
      customerName: "Juan Pérez",
      type: "change",
      resolution: "coupon",
      status: "pending",
      reason: "Talle incorrecto",
      items: [
        {
          productId: "1",
          productName: "Adidas Ultraboost 22",
          productImage: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8ea578f6c07847fca2e0af4901531b95_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
          size: "42",
          quantity: 1,
          price: 149000,
          reason: "Talle muy pequeño"
        }
      ],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "RET-002",
      orderNumber: "ORD-789012",
      customerEmail: "maria.garcia@email.com",
      customerName: "María García",
      type: "return",
      resolution: "refund",
      status: "approved",
      reason: "Producto defectuoso",
      items: [
        {
          productId: "2",
          productName: "Nike Air Max 270",
          productImage: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-shoes-9B8Tsx.png",
          size: "38",
          quantity: 1,
          price: 159000,
          reason: "Defecto en la suela"
        }
      ],
      shippingLabel: "https://shipping.andreani.com/label/AR12345678",
      trackingNumber: "AR12345678",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "RET-003",
      orderNumber: "ORD-345678",
      customerEmail: "carlos.lopez@email.com",
      customerName: "Carlos López",
      type: "change",
      resolution: "coupon",
      status: "completed",
      reason: "Cambio de color",
      items: [
        {
          productId: "3",
          productName: "Puma RS-X Efekt",
          productImage: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/393161/02/sv01/fnd/PNA/fmt/png/RS-X-Efekt-Sneakers",
          size: "41",
          quantity: 1,
          price: 129000,
          reason: "No me gustó el color"
        }
      ],
      couponCode: "CAMBIO-567890",
      couponAmount: 129000,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const allRequests = [...state.requests, ...mockRequests];

  // Filter requests
  const filteredRequests = allRequests.filter(request => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: ReturnRequest['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'received': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: ReturnRequest['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobada';
      case 'shipped': return 'Enviado';
      case 'received': return 'Recibido';
      case 'completed': return 'Completada';
      case 'rejected': return 'Rechazada';
      default: return status;
    }
  };

  const handleApprove = async (request: ReturnRequest) => {
    try {
      await updateReturnStatus(request.id, 'approved');

      // If it's a change with coupon, generate coupon
      if (request.type === 'change' && request.resolution === 'coupon') {
        const totalAmount = request.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        await generateCoupon(request.id, totalAmount);
      }

      // Generate shipping label
      await generateShippingLabel(request.id);

      alert('Solicitud aprobada exitosamente');
    } catch (error) {
      alert('Error al aprobar la solicitud');
    }
  };

  const handleReject = async (request: ReturnRequest) => {
    const reason = prompt('Motivo del rechazo:');
    if (reason) {
      try {
        await updateReturnStatus(request.id, 'rejected', reason);
        alert('Solicitud rechazada');
      } catch (error) {
        alert('Error al rechazar la solicitud');
      }
    }
  };

  const handleMarkReceived = async (request: ReturnRequest) => {
    try {
      await updateReturnStatus(request.id, 'received');

      // If it's a refund, process the refund
      if (request.resolution === 'refund') {
        const totalAmount = request.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        await processRefund(request.id, totalAmount);
      } else {
        // Mark as completed for changes
        await updateReturnStatus(request.id, 'completed');
      }

      alert('Producto marcado como recibido');
    } catch (error) {
      alert('Error al procesar la recepción');
    }
  };

  const exportToCSV = () => {
    const csvData = filteredRequests.map(req => ({
      ID: req.id,
      Pedido: req.orderNumber,
      Cliente: req.customerName,
      Email: req.customerEmail,
      Tipo: req.type === 'change' ? 'Cambio' : 'Devolución',
      Estado: getStatusText(req.status),
      Monto: req.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      Fecha: new Date(req.createdAt).toLocaleDateString('es-AR')
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devoluciones.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Devoluciones</h1>
          <p className="text-gray-600">Administra las solicitudes de cambios y devoluciones</p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Solicitudes</p>
              <p className="text-2xl font-bold">{allRequests.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold">
                {allRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <RefreshCw className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold">
                {allRequests.filter(r => ['approved', 'shipped', 'received', 'completed'].includes(r.status)).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rechazadas</p>
              <p className="text-2xl font-bold">
                {allRequests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-64">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por ID, pedido, cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobada</option>
              <option value="shipped">Enviado</option>
              <option value="received">Recibido</option>
              <option value="completed">Completada</option>
              <option value="rejected">Rechazada</option>
            </select>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todos los tipos</option>
            <option value="change">Cambios</option>
            <option value="return">Devoluciones</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Solicitud
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Productos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{request.id}</div>
                      <div className="text-sm text-gray-600">{request.orderNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{request.customerName}</div>
                      <div className="text-sm text-gray-600">{request.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      request.type === 'change' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {request.type === 'change' ? 'Cambio' : 'Devolución'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {request.items.length} producto{request.items.length > 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">
                      ${request.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(request.createdAt).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {request.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleApprove(request)}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleReject(request)}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {(request.status === 'shipped' || request.status === 'approved') && (
                        <Button
                          onClick={() => handleMarkReceived(request)}
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay solicitudes
            </h3>
            <p className="text-gray-600">
              No se encontraron solicitudes con los filtros aplicados
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedRequest && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Detalle de Solicitud</h2>
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    size="sm"
                  >
                    Cerrar
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Request Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">ID Solicitud</label>
                      <div className="font-semibold">{selectedRequest.id}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Número de Pedido</label>
                      <div className="font-semibold">{selectedRequest.orderNumber}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Cliente</label>
                      <div>{selectedRequest.customerName}</div>
                      <div className="text-sm text-gray-600">{selectedRequest.customerEmail}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estado</label>
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                          {getStatusText(selectedRequest.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <h3 className="font-medium mb-3">Productos</h3>
                    <div className="space-y-3">
                      {selectedRequest.items.map((item, index) => (
                        <div key={index} className="flex gap-4 border rounded-lg p-4">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-16 h-16 object-contain bg-gray-50 rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.productName}</h4>
                            <p className="text-sm text-gray-600">Talle: {item.size}</p>
                            <p className="text-sm text-gray-600">Motivo: {item.reason}</p>
                            <p className="font-semibold">${item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coupon or Tracking Info */}
                  {selectedRequest.couponCode && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Cupón Generado</h4>
                      <div className="text-lg font-bold text-green-700">{selectedRequest.couponCode}</div>
                      <div className="text-sm text-green-600">${selectedRequest.couponAmount?.toLocaleString()}</div>
                    </div>
                  )}

                  {selectedRequest.trackingNumber && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Información de Envío</h4>
                      <div className="text-sm">
                        <div>Número de seguimiento: <span className="font-mono">{selectedRequest.trackingNumber}</span></div>
                        {selectedRequest.shippingLabel && (
                          <div className="mt-2">
                            <a
                              href={selectedRequest.shippingLabel}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Ver etiqueta de envío
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reason */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Motivo</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedRequest.reason}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedRequest.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Notas Internas</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                        {selectedRequest.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
