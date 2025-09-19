export default function HeroSection() {
  return (
    <section className="bg-gray-900 text-white">
      {/* Free shipping banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-2">
          ENVÍOS GRATIS DESDE $149.000
        </h1>
        <p className="text-lg md:text-xl opacity-90">
          EN TODO EL PAÍS - MIRÁNDOLO DISTINTO
        </p>
      </div>

      {/* Under Armour promotional section */}
      <div className="relative">
        <div className="bg-gray-800 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  UNDER ARMOUR
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-6">
                  Descubrí la nueva colección deportiva
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  VER COLECCIÓN
                </button>
              </div>
              <div className="relative">
                <img
                  src="https://ext.same-assets.com/2022892511/4266877568.jpeg"
                  alt="Under Armour Collection"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
