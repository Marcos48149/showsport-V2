import { Button } from "@/components/ui/button";

export default function PromoBanner() {
  return (
    <section className="py-12 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Text content */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¡Ofertas de Temporada!
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-6">
              Hasta 40% de descuento en zapatillas seleccionadas
            </p>
            <ul className="space-y-2 mb-8 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span>
                Envío gratis en compras superiores a $149.000
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span>
                6 cuotas sin interés con tarjetas bancarias
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span>
                Cambios y devoluciones sin cargo
              </li>
            </ul>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 font-semibold">
              Ver ofertas
            </Button>
          </div>

          {/* Right side - Featured products grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <img
                src="https://assets.adidas.com/images/w_600,f_auto,q_auto/8ea578f6c07847fca2e0af4901531b95_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg"
                alt="Adidas Ultraboost"
                className="w-full h-32 object-contain mb-2"
              />
              <p className="text-sm font-semibold text-gray-900">Adidas Ultraboost</p>
              <p className="text-orange-500 font-bold">40% OFF</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-lg">
              <img
                src="https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-shoes-9B8Tsx.png"
                alt="Nike Air Max"
                className="w-full h-32 object-contain mb-2"
              />
              <p className="text-sm font-semibold text-gray-900">Nike Air Max</p>
              <p className="text-orange-500 font-bold">35% OFF</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-lg">
              <img
                src="https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/393161/02/sv01/fnd/PNA/fmt/png/RS-X-Efekt-Sneakers"
                alt="Puma RS-X"
                className="w-full h-32 object-contain mb-2"
              />
              <p className="text-sm font-semibold text-gray-900">Puma RS-X</p>
              <p className="text-orange-500 font-bold">30% OFF</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-lg">
              <img
                src="https://assets.adidas.com/images/w_600,f_auto,q_auto/9eb0467b7e7f4c6592b9af49013c19be_9366/Forum_Low_Shoes_White_FY7757_01_standard.jpg"
                alt="Adidas Forum"
                className="w-full h-32 object-contain mb-2"
              />
              <p className="text-sm font-semibold text-gray-900">Adidas Forum</p>
              <p className="text-orange-500 font-bold">25% OFF</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
