const Card = ({ 
  children, 
  className = '', 
  hover = false,
  onClick,
  padding = 'md'
}) => {
  const paddingSizes = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover 
    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300' 
    : 'transition-shadow duration-200';

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-md
        ${paddingSizes[padding]}
        ${hoverStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
