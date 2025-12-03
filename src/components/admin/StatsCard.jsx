const StatsCard = ({ icon: Icon, label, value, trend, trendValue, color = 'gold' }) => {
  const colors = {
    gold: {
      bg: 'bg-[#d5a437]/10',
      icon: 'text-[#d5a437]',
      border: 'border-[#d5a437]/20',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      border: 'border-green-200',
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-200',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      border: 'border-purple-200',
    },
  };

  const colorScheme = colors[color] || colors.gold;

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md border ${colorScheme.border}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-[#1f2933] mb-2">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl ${colorScheme.bg} flex items-center justify-center`}>
          <Icon size={28} className={colorScheme.icon} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
