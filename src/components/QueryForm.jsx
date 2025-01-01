import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  FormControl,
  CircularProgress
} from '@mui/material';

export default function QueryForm({ onSubmit }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ phone });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    // Remove tudo que não é número
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          label="Número do WhatsApp"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="DDD + Número"
          disabled={loading}
          required
        />
      </FormControl>
      
      <Button 
        type="submit" 
        variant="contained" 
        fullWidth 
        disabled={loading || !phone}
      >
        {loading ? <CircularProgress size={24} /> : 'Analisar Conversas'}
      </Button>
    </Box>
  );
}
