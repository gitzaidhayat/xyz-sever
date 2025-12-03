import { useState } from 'react';
import { Link } from 'react-router-dom';

const SizeChart = () => {
  const [activeCategory, setActiveCategory] = useState('abaya');

  const abayaSizes = [
    { size: 'XS', bust: '32-34', waist: '24-26', hip: '34-36', length: '54-56' },
    { size: 'S', bust: '34-36', waist: '26-28', hip: '36-38', length: '56-58' },
    { size: 'M', bust: '36-38', waist: '28-30', hip: '38-40', length: '58-60' },
    { size: 'L', bust: '38-40', waist: '30-32', hip: '40-42', length: '60-62' },
    { size: 'XL', bust: '40-42', waist: '32-34', hip: '42-44', length: '62-64' },
    { size: 'XXL', bust: '42-44', waist: '34-36', hip: '44-46', length: '64-66' }
  ];

  const hijabSizes = [
    { size: 'Small', length: '70', width: '180' },
    { size: 'Medium', length: '75', width: '190' },
    { size: 'Large', length: '80', width: '200' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Size Chart</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size guide. All measurements are in inches.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveCategory('abaya')}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              activeCategory === 'abaya'
                ? 'bg-teal-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Abayas
          </button>
          <button
            onClick={() => setActiveCategory('hijab')}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              activeCategory === 'hijab'
                ? 'bg-teal-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Hijabs
          </button>
        </div>

        {/* Abaya Size Chart */}
        {activeCategory === 'abaya' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-teal-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Size</th>
                    <th className="px-6 py-4 text-left font-semibold">Bust (inches)</th>
                    <th className="px-6 py-4 text-left font-semibold">Waist (inches)</th>
                    <th className="px-6 py-4 text-left font-semibold">Hip (inches)</th>
                    <th className="px-6 py-4 text-left font-semibold">Length (inches)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {abayaSizes.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-900">{item.size}</td>
                      <td className="px-6 py-4 text-gray-700">{item.bust}</td>
                      <td className="px-6 py-4 text-gray-700">{item.waist}</td>
                      <td className="px-6 py-4 text-gray-700">{item.hip}</td>
                      <td className="px-6 py-4 text-gray-700">{item.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hijab Size Chart */}
        {activeCategory === 'hijab' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-teal-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Size</th>
                    <th className="px-6 py-4 text-left font-semibold">Length (cm)</th>
                    <th className="px-6 py-4 text-left font-semibold">Width (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {hijabSizes.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-900">{item.size}</td>
                      <td className="px-6 py-4 text-gray-700">{item.length}</td>
                      <td className="px-6 py-4 text-gray-700">{item.width}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* How to Measure */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">How to Measure</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bust</h3>
                <p className="text-gray-600">
                  Measure around the fullest part of your bust, keeping the tape parallel to the floor.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Waist</h3>
                <p className="text-gray-600">
                  Measure around the narrowest part of your waist, typically just above your belly button.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hip</h3>
                <p className="text-gray-600">
                  Measure around the fullest part of your hips, about 7-9 inches below your waist.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Length</h3>
                <p className="text-gray-600">
                  Measure from the shoulder seam to the desired hem length.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tips for Best Fit</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Always measure yourself in your undergarments for the most accurate sizing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Keep the measuring tape snug but not tight against your body.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>If you're between sizes, we recommend sizing up for a more comfortable fit.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Consider the fabric - some materials have more stretch than others.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Check the product description for specific fit notes on each item.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact for Help */}
        <div className="bg-linear-to-r from-teal-500 to-teal-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="mb-6">
            Our customer service team is here to help you find the perfect fit.
          </p>
          <Link 
            to="/contact-us"
            className="inline-block px-8 py-3 bg-white text-teal-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SizeChart;
