import AdminSidebar from '../../components/admin/AdminSidebar';
import { FiTrendingUp, FiDownload, FiCalendar } from 'react-icons/fi';

const AdminReportsPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
            <p className="text-gray-500 mt-1">Analytics and business insights</p>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrendingUp className="text-orange-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reports Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              We're working on comprehensive analytics and reporting features
            </p>
            <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium inline-flex items-center gap-2">
              <FiDownload size={20} />
              Download Sample Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
