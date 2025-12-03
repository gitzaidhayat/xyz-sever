import { FiShoppingBag } from 'react-icons/fi';

const EmptyState = ({
  icon: Icon = FiShoppingBag,
  title = 'Nothing here',
  message = 'There are no items to display.',
  action,
  actionLabel = 'Go Back',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-[#f5e9da] flex items-center justify-center mb-6">
        <Icon size={48} className="text-[#eec9af]" />
      </div>
      <h3 className="text-2xl font-bold text-[#1f2933] mb-2 font-['Playfair_Display']">
        {title}
      </h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {message}
      </p>
      {action && (
        <button
          onClick={action}
          className="px-8 py-3 bg-[#eec9af] text-white rounded-full font-medium hover:bg-[#e0b54d] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
