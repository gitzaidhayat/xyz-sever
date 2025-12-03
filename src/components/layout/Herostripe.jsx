import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";

// Helper to create URL-safe slugs
const slugify = (str) =>
  String(str)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Categories with links to ProductList via category query
const categories = [
  { label: "NEW ARRIVALS", path: "/products?category=new-arrivals" },
  { label: "ABAYAS", path: "/products?category=abayas", items: ["On Sale", "Back In Stock", "Bridal Abaya", "Essential Abaya", "Hajj/Umrah Collection", "Eid Abaya Collection", "Ramadaan Abayas Collection", "Modest Dresses"] },
  { label: "THOBES", path: "/products?category=thobes", items: ["Emirati Thobes", "Omani Thobes", "Kuwaiti Thobes", "Short Sleeve Thobes", "Ihrams", "Keffiyeh Scarves", "View All"] },
  { label: "KIDS", path: "/products?category=kids", hasColumns: true,
    columns: [
      {
        title: "Junior Girls",
        items: ["Essential Abayas", "Jilbabs/Prayer Abayas", "Khimar/Khimar Sets", "Occasion Abayas", "Inner Slip Dresses", "Hijabs", "View All Junior Girls"]
      },
      {
        title: "Junior Boys",
        items: ["Omani Thobes", "Emirati Thobes", "Short Sleeve Thobes", "View All Junior Boys"]
      },
      {
        title: "Mother & Daughter Matching",
        items: ["View All Mother & Daughter Matching"]
      },
      {
        title: "Father & Son Matching",
        items: ["View All Father & Son Matching"]
      }
    ]
  },
  { label: "HIJABS", path: "/products?category=hijabs", items: ["Georgette Hijabs", "Georgette Chiffon Hijabs", "Jersey Hijabs", "Keffiyeh Scarves", "Modal Hijabs", "Luxury Chiffon Hijabs", "Printed Hijabs", "Rayon Viscose"] },
  { 
    label: "FORMAL WEAR", 
    path: "/products?category=formal-wear",
    hasColumns: true,
    columns: [
      {
        title: "KIDS PRAYER DRESS/FORMAL WEAR",
        items: ["Midis And Tops", "Kurtas And Kurtis", "Shirt And Bottom"]
      }
    ]
  },
  { label: "ACCESSORIES", path: "/products?category=accessories", items: ["Fragrance", "Pins", "Gift Boxes"] },
  
];

function Herostripe() {
  const [active, setActive] = useState(null); // index of active category
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState(null);

  const toggleMobileSubmenu = (idx) => {
    setExpandedMobile(expandedMobile === idx ? null : idx);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div
        className="hidden md:block py-1 border-t border-b border-gray-300 select-none"
        onMouseLeave={() => setActive(null)}
      >
        <div className="container mx-auto flex justify-center">
          <ul className="flex gap-4 text-sm! font-medium! text-gray-700 relative">
            {categories.map((cat, idx) => (
              <li
                key={cat.label}
                className="relative py-2 text-[12px] "
                onMouseEnter={() => setActive(idx)}
              >
                {cat.path ? (
                  <Link
                    to={cat.path}
                    className={`px-5 tracking-wide transition-colors duration-150 ${
                      active === idx ? "text-black" : "text-gray-700 hover:text-black"
                    }`}
                  >
                    {cat.label}
                  </Link>
                ) : (
                  <span
                    className={`px-5 tracking-wide transition-colors duration-150 ${
                      active === idx ? "text-black" : "text-gray-700 hover:text-black"
                    }`}
                  >
                    {cat.label}
                  </span>
                )}
                {active === idx && cat.hasColumns && cat.columns && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full z-20 mt-1 bg-white shadow-lg p-6">
                    <div className="grid grid-cols-4 gap-8 min-w-[800px]">
                      {cat.columns.map((column, colIdx) => (
                        <div key={colIdx}>
                          <h3 className="font-semibold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">
                            {column.title}
                          </h3>
                          <ul className="space-y-2 text-xs text-gray-600">
                            {column.items.map(item => {
                              const isViewAll = item.toLowerCase().startsWith("view all");
                              const target = isViewAll
                                ? `/products?category=${slugify(column.title)}`
                                : `/products?category=${slugify(item)}`;
                              return (
                                <li key={item}>
                                  <Link
                                    to={target}
                                    className="block hover:text-black transition-colors hover:underline"
                                  >
                                    {item}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {active === idx && Array.isArray(cat.items) && cat.items.length > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full z-20 mt-1 w-50 bg-white shadow-lg p-4 ">
                    <ul className="space-y-4 text-xs font-[550] text-gray-600 ">
                      {cat.items.map(item => {
                        const target = `/products?category=${slugify(item)}`;
                        return (
                          <li key={item}>
                            <Link
                              to={target}
                              className="block hover:text-black transition-colors"
                            >
                              {item}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-b border-gray-300">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-between w-full py-3 text-gray-700"
          >
            <span className="font-medium text-sm">MENU</span>
            {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>

          {mobileMenuOpen && (
            <div className="pb-4 max-h-[70vh] overflow-y-auto">
              {categories.map((cat, idx) => (
                <div key={cat.label} className="border-t border-gray-200">
                  <div className="flex items-center justify-between py-3">
                    {cat.path ? (
                      <Link
                        to={cat.path}
                        className="flex-1 text-sm font-medium text-gray-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {cat.label}
                      </Link>
                    ) : (
                      <span className="flex-1 text-sm font-medium text-gray-700">
                        {cat.label}
                      </span>
                    )}
                    {(cat.items || cat.columns) && (
                      <button
                        onClick={() => toggleMobileSubmenu(idx)}
                        className="p-1"
                      >
                        {expandedMobile === idx ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {expandedMobile === idx && cat.columns && (
                    <div className="pl-4 pb-3 space-y-4">
                      {cat.columns.map((column, colIdx) => (
                        <div key={colIdx}>
                          <h4 className="font-semibold text-xs text-gray-900 mb-2">
                            {column.title}
                          </h4>
                          <ul className="space-y-2">
                            {column.items.map(item => {
                              const isViewAll = item.toLowerCase().startsWith("view all");
                              const target = isViewAll
                                ? `/products?category=${slugify(column.title)}`
                                : `/products?category=${slugify(item)}`;
                              return (
                                <li key={item}>
                                  <Link
                                    to={target}
                                    className="block text-xs text-gray-600 hover:text-black"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {item}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {expandedMobile === idx && cat.items && (
                    <ul className="pl-4 pb-3 space-y-2">
                      {cat.items.map(item => {
                        const target = `/products?category=${slugify(item)}`;
                        return (
                          <li key={item}>
                            <Link
                              to={target}
                              className="block text-xs text-gray-600 hover:text-black"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Herostripe;