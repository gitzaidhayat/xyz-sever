import AdminSidebar from '../../components/admin/AdminSidebar';
import { FiZap, FiLink } from 'react-icons/fi';

const AdminIntegrationsPage = () => {
  const integrations = [
    { name: 'Stripe', logo: '💳', status: 'Connected', color: 'green' },
    { name: 'PayPal', logo: '🅿️', status: 'Connected', color: 'green' },
    { name: 'Mailchimp', logo: '📧', status: 'Not Connected', color: 'gray' },
    { name: 'Google Analytics', logo: '📊', status: 'Connected', color: 'green' },
    { name: 'Slack', logo: '💬', status: 'Not Connected', color: 'gray' },
    { name: 'Shopify', logo: '🛍️', status: 'Not Connected', color: 'gray' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-800">Integrations</h1>
            <p className="text-gray-500 mt-1">Connect your favorite tools and services</p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <div key={integration.name} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                    {integration.logo}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    integration.status === 'Connected' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {integration.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{integration.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {integration.status === 'Connected' 
                    ? 'Active and syncing data' 
                    : 'Click to connect and start syncing'}
                </p>
                <button className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  integration.status === 'Connected'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}>
                  {integration.status === 'Connected' ? 'Manage' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIntegrationsPage;
