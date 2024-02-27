// src/hooks/useForm.jsx

import { useState } from 'react';

export const useForm = (initialState, onSubmit) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return { formData, handleChange, handleSubmit };
};