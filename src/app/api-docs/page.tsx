"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Code,
  Copy,
  ExternalLink,
  Key,
  Globe,
  Shield,
  Zap,
  Check,
  Book,
  Terminal,
  ArrowRight
} from "lucide-react";

export default function APIDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState("products");
  const [copiedCode, setCopiedCode] = useState("");

  const endpoints = [
    {
      id: "products",
      name: "Products",
      methods: ["GET", "POST", "PUT", "DELETE"],
      description: "Manage product catalog and inventory"
    },
    {
      id: "orders",
      name: "Orders",
      methods: ["GET", "POST", "PUT"],
      description: "Process and manage customer orders"
    },
    {
      id: "payments",
      name: "Payments",
      methods: ["POST"],
      description: "Process payments via Stripe and PayPal"
    },
    {
      id: "customers",
      name: "Customers",
      methods: ["GET", "POST", "PUT"],
      description: "Customer management and authentication"
    }
  ];

  const apiExamples = {
    products: `// Get all products
fetch('https://api.showsport.com/v1/products', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`,

    orders: `// Create new order
fetch('https://api.showsport.com/v1/orders', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customer_id: "CUST-123",
    items: [{ product_id: 1, quantity: 2, size: "42" }]
  })
});`,

    payments: `// Process Stripe payment
fetch('https://api.showsport.com/v1/payments/stripe', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    order_id: "ORD-001",
    payment_method_id: "pm_1234567890",
    amount: 298000,
    currency: "ars"
  })
});`,

    customers: `// Get customer profile
fetch('https://api.showsport.com/v1/customers/CUST-123', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Code className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Showsport API</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive REST API for integrating with Showsport's e-commerce platform.
            Build custom integrations, process payments, and manage inventory.
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Quick Start</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Get API Key</h3>
                <p className="text-sm text-gray-600">
                  Generate your API key from the admin dashboard
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Make Requests</h3>
                <p className="text-sm text-gray-600">
                  Send HTTP requests with your API key in headers
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Handle Responses</h3>
                <p className="text-sm text-gray-600">
                  Process JSON responses and handle errors gracefully
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3">Base URL</h4>
            <code className="text-sm bg-white px-3 py-2 rounded border">
              https://api.showsport.com/v1
            </code>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Book className="h-5 w-5" />
                Endpoints
              </h3>

              <nav className="space-y-2">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => setActiveEndpoint(endpoint.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeEndpoint === endpoint.id
                        ? "bg-orange-50 text-orange-600 border border-orange-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{endpoint.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {endpoint.methods.join(", ")}
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* API Documentation */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold">
                  {endpoints.find(e => e.id === activeEndpoint)?.name} API
                </h3>
                <p className="text-gray-600 mt-1">
                  {endpoints.find(e => e.id === activeEndpoint)?.description}
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Example Request</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(apiExamples[activeEndpoint as keyof typeof apiExamples])}
                    className="flex items-center gap-2"
                  >
                    {copiedCode === apiExamples[activeEndpoint as keyof typeof apiExamples] ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedCode === apiExamples[activeEndpoint as keyof typeof apiExamples] ? "Copied!" : "Copy"}
                  </Button>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{apiExamples[activeEndpoint as keyof typeof apiExamples]}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Payment Integrations */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-blue-500" />
                <h3 className="text-xl font-bold">Payment Integrations</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-3">Stripe</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Process credit card payments securely with Stripe's robust infrastructure.
                  </p>
                  <div className="space-y-2 mb-4">
                    {["Credit/Debit Cards", "Apple Pay", "Google Pay", "Bank Transfers"].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Stripe Docs
                  </Button>
                </div>

                <div className="border rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-3">PayPal</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Accept PayPal payments and reach customers worldwide.
                  </p>
                  <div className="space-y-2 mb-4">
                    {["PayPal Balance", "Credit Cards", "PayPal Credit", "Venmo"].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    PayPal Docs
                  </Button>
                </div>
              </div>
            </div>

            {/* Authentication */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Key className="h-6 w-6 text-purple-500" />
                <h3 className="text-xl font-bold">Authentication</h3>
              </div>

              <p className="text-gray-600 mb-6">
                All API requests require authentication using Bearer tokens. Include your API key in the Authorization header.
              </p>

              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <pre className="text-green-400 text-sm">
                  <code>{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.showsport.com/v1/products`}</code>
                </pre>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Security Best Practices</h4>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>• Never expose API keys in client-side code</li>
                      <li>• Use environment variables to store keys</li>
                      <li>• Rotate keys regularly</li>
                      <li>• Use HTTPS for all requests</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
