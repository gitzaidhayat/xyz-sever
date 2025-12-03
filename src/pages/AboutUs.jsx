const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-x text-gray-600 max-w-3xl mx-auto">
            Influential, innovative and progressive. At NAHT, we pride ourselves on fusing traditional modest clothing with contemporary fashion.
          </p>
        </div>

        {/* Our Story */}
        <div className="m-auto bg-white rounded-lg shadow-md p-8 mb-12 h-auto w-250">
          <h3 className="text-3xl font-normal! text-gray-900 mb-6">Our Story</h3>
          <div className="space-y-4 text-gray-700  leading-relaxed">
            <p className="text-x">
              Founded with a vision to revolutionize modest fashion, NAHT has become a trusted name in providing high-quality, stylish abayas and modest wear. Our journey began with a simple belief - that modesty and fashion can coexist beautifully.
            </p >
            <p className="text-x">
              We understand the modern woman's needs - someone who values her faith and culture while embracing contemporary style. Every piece in our collection is carefully curated to ensure you never have to compromise on either.
            </p>
            <p className="text-x">
              Our team works tirelessly to bring you the latest trends in modest fashion, combining traditional craftsmanship with modern designs. We source premium fabrics and work with skilled artisans to create pieces that are not just clothing, but expressions of identity and faith.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality First</h3>
            <p className="text-gray-600">
              We never compromise on quality. Every product goes through rigorous quality checks to ensure you receive only the best.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Centric</h3>
            <p className="text-gray-600">
              Your satisfaction is our priority. We're here to make your shopping experience delightful and hassle-free.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
            <p className="text-gray-600">
              We constantly innovate to bring you fresh designs that blend tradition with contemporary fashion trends.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To empower women worldwide by providing elegant, high-quality modest fashion that celebrates their identity while embracing modern style. We strive to make every woman feel confident, beautiful, and true to herself.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To become the global leader in modest fashion, setting new standards for quality, design, and customer service. We envision a world where modest fashion is celebrated and accessible to all.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
