import { FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className={`border rounded-lg p-4 ${address.isDefault ? 'border-[#2874f0] bg-blue-50' : 'border-gray-200'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded uppercase">
            {address.addressType}
          </span>
          {address.isDefault && (
            <span className="px-2 py-1 bg-[#2874f0] text-white text-xs font-medium rounded flex items-center gap-1">
              <FiCheck size={12} /> DEFAULT
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(address)}
            className="text-[#2874f0] hover:text-[#1c5bbf] transition-colors"
            title="Edit"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(address._id)}
            className="text-red-600 hover:text-red-700 transition-colors"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-1 text-sm">
        <p className="font-medium text-gray-900">{address.fullName}</p>
        <p className="text-gray-700">{address.address}</p>
        <p className="text-gray-700">
          {address.city}, {address.state} - {address.zipCode}
        </p>
        <p className="text-gray-700">{address.country}</p>
        <p className="text-gray-600">Phone: {address.phone}</p>
      </div>

      {/* Set as Default */}
      {!address.isDefault && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={() => onSetDefault(address._id)}
            className="text-sm text-[#2874f0] hover:underline font-medium"
          >
            Set as Default
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
