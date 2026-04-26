import { useState } from "react";
import { inventoryItems, inventoryFilters } from "@/mocks/inventory";

export default function InventorySection() {
  const [activeFilter, setActiveFilter] = useState("All");


  const filtered =
    activeFilter === "All"
      ? inventoryItems
      : inventoryItems.filter(
          (item) =>
            item.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
            item.fuel.toLowerCase().includes(activeFilter.toLowerCase()),
        );

  return (
    <section id="inventory" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 border border-[#1a1a1a]/20 text-[#1a1a1a] text-xs font-semibold tracking-widest uppercase rounded-full mb-5">
              Browse Our Collection
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] leading-tight">
              Premium Vehicles
              <br />
              <span className="text-[#d4af37] italic">Curated for You</span>
            </h2>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {inventoryFilters.map((filter: string) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-[#f0f0f0] text-[#6b6b6b] hover:bg-[#e0e0e0]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item: (typeof inventoryItems)[number]) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-[#f8f8f8] cursor-pointer transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative w-full h-52 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                {/* Badge */}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 ${item.badgeColor} text-white text-xs font-semibold rounded-full whitespace-nowrap`}
                >
                  {item.badge}
                </span>
                {/* Fuel Type */}
                <span className="absolute top-3 right-3 px-3 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-medium rounded-full whitespace-nowrap">
                  {item.fuel}
                </span>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wider mb-1">
                      {item.category}
                    </p>
                    <h3 className="text-[#1a1a1a] font-bold text-lg leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[#d4af37] font-black text-lg">
                      {item.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 mb-4">
                  <span className="flex items-center gap-1.5 text-[#6b6b6b] text-xs">
                    <i className="ri-speed-line text-sm"></i>
                    {item.mileage}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#6b6b6b] text-xs">
                    <i className="ri-settings-3-line text-sm"></i>
                    {item.transmission}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#6b6b6b] text-xs">
                    <i className="ri-palette-line text-sm"></i>
                    {item.color}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 py-2.5 bg-[#1a1a1a] text-white text-sm font-semibold rounded-xl hover:bg-[#333] transition-colors cursor-pointer whitespace-nowrap"
                    onClick={() =>
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Inquire Now
                  </button>
                  <button
                    className="w-10 h-10 flex items-center justify-center bg-[#f0f0f0] text-[#1a1a1a] rounded-xl hover:bg-[#e0e0e0] transition-colors cursor-pointer"
                    aria-label="Save vehicle"
                  >
                    <i className="ri-heart-line text-base"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#1a1a1a] text-[#1a1a1a] font-semibold rounded-full hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap text-sm"
          >
            Request Full Inventory List
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
