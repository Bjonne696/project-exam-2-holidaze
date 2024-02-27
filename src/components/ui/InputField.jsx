// src/components/ui/InputField.jsx

export const InputField = ({ type, name, placeholder, onChange, className = '' }) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      className={`input input-bordered ${className}`}
      required
    />
  );