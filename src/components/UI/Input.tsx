type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'url';
  required?: boolean;
  className?: string;
};

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: Props) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && (
        <span className="text-gray-700">
          {label}
          {required && ' *'}
        </span>
      )}

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border  border-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900  text-blue-500
        hover:text-blue-900"
      />
    </label>
  );
}
