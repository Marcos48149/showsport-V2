"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Package,
  Heart,
  MapPin,
  Edit2,
  Eye,
  Calendar,
  CreditCard,
  Truck
} from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: "profile", name: "Mi Perfil", icon: User },
    { id: "orders", name: "Mis Pedidos", icon: Package },
    { id: "wishlist", name: "Favoritos", icon: Heart },
    { id: "addresses", name: "Direcciones", icon: MapPin },
  ];

  const mockOrders = [
    {
      id: "ORD-001",
      date: "2024-03-15",
      status: "Entregado",
      total: "$298.000",
      items: 2,
      products: ["Nike Air Max 270", "Adidas Ultraboost 22"]
    },
    {
      id: "ORD-002",
      date: "2024-03-10",
      status: "En tránsito",
      total: "$179.000",
      items: 1,
      products: ["Puma RS-X Efekt"]
    },
    {
      id: "ORD-003",
      date: "2024-02-28",
      status: "Entregado",
      total: "$199.000",
      items: 1,
      products: ["Nike LeBron 20"]
    }
  ];

  const mockWishlist = [
    {
      id: 1,
      name: "Adidas Forum Low",
      brand: "Adidas",
      price: "$119.000",
      originalPrice: "$149.000",
      image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/9eb0467b7e7f4c6592b9af49013c19be_9366/Forum_Low_Shoes_White_FY7757_01_standard.jpg"
    },
    {
      id: 2,
      name: "Nike React Vision",
      brand: "Nike",
      price: "$139.000",
      originalPrice: "$179.000",
      image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/i1-1b0c9450-1e62-4962-a7e5-03c4c3e3841b/react-vision-shoes-9T0vLn.png"
    }
  ];

  const mockAddresses = [
    {
      id: 1,
      name: "Casa",
      address: "Av. Corrientes 1234, CABA",
      isDefault: true
    },
    {
      id: 2,
      name: "Trabajo",
      address: "Florida 456, CABA",
      isDefault: false
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Información Personal</h2>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <Input
                  defaultValue="Juan"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                <Input
                  defaultValue="Pérez"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  defaultValue="juan.perez@email.com"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <Input
                  defaultValue="+54 11 1234-5678"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento
                </label>
                <Input
                  type="date"
                  defaultValue="1990-01-15"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DNI
                </label>
                <Input
                  defaultValue="12.345.678"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Guardar Cambios
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Mis Pedidos</h2>

            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div key={order.id} className="bg-white border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Pedido #{order.id}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.date).toLocaleDateString('es-AR')}
                        </span>
                        <span>{order.items} producto{order.items > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-500">
                        {order.total}
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Entregado"
                          ? "bg-green-100 text-green-800"
                          : order.status === "En tránsito"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status === "En tránsito" && <Truck className="h-3 w-3" />}
                        {order.status}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Productos:</p>
                    <p className="font-medium">{order.products.join(", ")}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      Ver Detalles
                    </Button>
                    {order.status === "Entregado" && (
                      <Button variant="outline" size="sm">
                        Volver a Comprar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "wishlist":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Lista de Favoritos</h2>

            {mockWishlist.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Tu lista de favoritos está vacía</p>
                <p className="text-gray-400 mt-2">Agregá productos que te gusten para encontrarlos fácilmente</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockWishlist.map((item) => (
                  <div key={item.id} className="bg-white border rounded-lg overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-50 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-500 uppercase">
                          {item.brand}
                        </span>
                      </div>

                      <h3 className="font-semibold mb-2">{item.name}</h3>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-orange-500">
                          {item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-gray-400 line-through">
                            {item.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                          Agregar al Carrito
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "addresses":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mis Direcciones</h2>
              <Button className="bg-orange-500 hover:bg-orange-600">
                Agregar Dirección
              </Button>
            </div>

            <div className="space-y-4">
              {mockAddresses.map((address) => (
                <div key={address.id} className="bg-white border rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{address.name}</h3>
                        {address.isDefault && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-semibold rounded">
                            Principal
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {address.address}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      {!address.isDefault && (
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Cuenta</h1>
          <p className="text-gray-600">Gestiona tu información personal y pedidos</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold">Juan Pérez</p>
                  <p className="text-sm text-gray-600">juan.perez@email.com</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-orange-50 text-orange-500 border border-orange-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
