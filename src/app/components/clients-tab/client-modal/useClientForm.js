import { useState } from 'react';
import { addClient, updateClient } from '@/services/clientService';

export default function useClientForm(onSuccess) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postal_code: '',
      country: '',
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const client = formData.id
        ? await updateClient(formData.id, formData)
        : await addClient(formData);

      resetForm();
      if (onSuccess) onSuccess(client);
    } catch (err) {
      console.error('Error saving client:', err);
      setError(err.message || 'Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  const setClient = (client) => {
    setFormData(
      client || {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: '',
      }
    );
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    resetForm,
    setClient,
  };
}
