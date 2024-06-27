import { Typography } from '@material-tailwind/react';
import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const FormGenerator = ({ fields, onSubmit, initialValues={}, componentChange }) => {
  const [formData, setFormData] = useState({...initialValues});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (field, value) => {
    const { required, minLength, maxLength, label } = field;
    let error = "";

    if (required && !value) {
      error = `${label} is required.`;
    } else if (minLength && value.length < minLength) {
      error = `${label} must be at least ${minLength} characters.`;
    } else if (maxLength && value.length > maxLength) {
      error = `${label} must be less than ${maxLength} characters.`;
    }

    return error;
  };

  const handleChange = (field) => (event) => {
    const { name, onChange } = field;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    const error = validateField(field, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    if (onChange) {
      onChange(value);
    }
  };

  const renderInput = (field) => {
    const { type, name, options, component } = field;
    const handleChangeEvent = handleChange(field);
    switch (type) {
      case "textarea":
        return <textarea name={name} onChange={handleChangeEvent} className="w-full p-2 border rounded-md text-lg font-normal focus:outline-none focus:border-blue-500" />;
      case "select":
        return (
          <select name={name} onChange={handleChangeEvent} className="w-full p-2 border rounded-md text-lg font-normal focus:outline-none focus:border-blue-500">
            {options.map((option, index) => (
              <option key={index} value={option.value}>{option.name}</option>
            ))}
          </select>
        );
      case "radio":
        return options.map((option, index) => (
          <label key={index} className="flex items-center text-lg font-normal">
            <input type="radio" name={name} value={option.value} onChange={handleChangeEvent} className="mr-2" />
            {option.name}
          </label>
        ));
      case "checkbox":
        return options.map((option, index) => (
          <label key={index} className="flex items-center text-lg font-normal">
            <input type="checkbox" name={name} value={option.value} onChange={handleChangeEvent} className="mr-2" />
            {option.name}
          </label>
        ));
      case "component":
        return component;
      default:
        return <input type={type.toLowerCase()} name={name} onChange={handleChangeEvent} className="w-full p-2 border rounded-md text-lg font-normal focus:outline-none focus:border-blue-500" />;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setLoading(true); 
      try {
        if (onSubmit) {
          await onSubmit(formData);
        }
      } finally {
        setLoading(false); 
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <div key={index}>
            <Typography variant='lead' className='font-semibold'>{field.label || field.name}</Typography>
            {renderInput(field)}
            {errors[field.name] && <p className="text-red-500">{errors[field.name]}</p>}
          </div>
        ))}
      </div>
      <div className='flex justify-center'>
      <button
        type="submit"
        className="bg-red-500 flex items-center text-lg text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        disabled={loading} 
      >
        {loading ? <span className="loader"></span> : 'Submit'}
      </button>
      </div>
      
    </form>
  );
};

export default FormGenerator;
