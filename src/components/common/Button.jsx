const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseStyles = 'font-medium transition-all duration-200 rounded-full inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-[#eec9af] text-white hover:bg-[#e0b54d] active:bg-[#c49630] disabled:bg-gray-300',
    secondary: 'bg-white text-[#1f2933] border-2 border-[#eec9af] hover:bg-[#f5e9da] active:bg-[#ebe0d1] disabled:border-gray-300 disabled:text-gray-400',
    outline: 'bg-transparent text-[#1f2933] border border-[#1f2933] hover:bg-[#1f2933] hover:text-white disabled:border-gray-300 disabled:text-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-300',
    ghost: 'bg-transparent text-[#1f2933] hover:bg-[#f5e9da] active:bg-[#ebe0d1] disabled:text-gray-400',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
