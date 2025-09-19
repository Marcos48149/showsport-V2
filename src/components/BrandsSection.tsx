export default function BrandsSection() {
  const brands = [
    {
      name: "Atomik",
      logo: "https://ext.same-assets.com/2022892511/617200229.png",
      url: "/atomik"
    },
    {
      name: "Under Armour",
      logo: "https://ext.same-assets.com/2022892511/1046026445.png",
      url: "/under-armour"
    },
    {
      name: "Salomon",
      logo: "https://ext.same-assets.com/2022892511/22309794.png",
      url: "/salomon"
    },
    {
      name: "Reebok",
      logo: "/api/placeholder/150/100",
      url: "/reebok"
    },
    {
      name: "New Balance",
      logo: "/api/placeholder/150/100",
      url: "/new-balance"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Las mejores marcas
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="bg-white rounded-full p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
            >
              <div className="aspect-square flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
