interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded';
  const variants = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}