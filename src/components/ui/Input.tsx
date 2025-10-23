interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input(props: InputProps) {
  return <input className="border p-2 rounded w-full" {...props} />;
}