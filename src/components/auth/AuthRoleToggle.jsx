import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const roles = {
  user: {
    label: 'User',
    loginPath: '/login',
    registerPath: '/register',
  },
  admin: {
    label: 'Admin',
    loginPath: '/admin/login',
    registerPath: '/admin/register',
  },
};

// Props: active ('user'|'admin'), mode ('login'|'register')
export default function AuthRoleToggle({ active = 'user', mode = 'login' }) {
  const navigate = useNavigate();

  const items = useMemo(
    () => [
      { key: 'user', ...roles.user },
      { key: 'admin', ...roles.admin },
    ],
    []
  );

  const go = (key) => {
    if (key === active) return;
    const target = key === 'admin' ? roles.admin : roles.user;
    navigate(mode === 'register' ? target.registerPath : target.loginPath);
  };

  const activeIndex = items.findIndex(i => i.key === active);

  return (
    <div className="relative inline-flex bg-white rounded-full border border-gray-200 shadow-sm select-none"
         role="tablist"
         aria-label="Authentication role">
      {/* Animated pill */}
      <span
        className="absolute top-1 bottom-1 left-1 w-1/2 rounded-full bg-[#d5a437] shadow-md transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
        aria-hidden="true"
      />
      {items.map((item, idx) => {
        const isActive = item.key === active;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${item.key}`}
            onClick={() => go(item.key)}
            className={
              `relative z-10 w-32 px-5 py-2 text-sm font-medium rounded-full transition-colors duration-200 ` +
              (isActive
                ? 'text-white'
                : 'text-gray-700 hover:text-[#1f2933]')
            }
            onMouseDown={(e) => e.currentTarget.classList.add('scale-95')}
            onMouseUp={(e) => e.currentTarget.classList.remove('scale-95')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('scale-95')}
          >
            <span className="pointer-events-none transition-opacity duration-300" style={{ opacity: isActive ? 1 : 0.7 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}