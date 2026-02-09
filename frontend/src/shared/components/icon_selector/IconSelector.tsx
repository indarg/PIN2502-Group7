// src/components/IconSelector.tsx
import React from 'react';
import { Box, IconButton, Typography } from '@mui/material'; // Usando Material-UI para el UI
import { STATIC_ICONS } from 'src/static/templates';

interface IconSelectorProps {
  value?: string; // El TMediaFile seleccionado (puede ser undefined al inicio)
  onChange: (selectedIcon: string) => void; // Función para notificar el cambio
  error?: boolean; // Para mostrar estado de error visual
  helperText?: string; // Mensaje de error
}

const IconSelector: React.FC<IconSelectorProps> = ({ value = STATIC_ICONS[0], onChange, error, helperText }) => {
  const selectedIconUrl = value; // La URL del icono actualmente seleccionado

  const handleIconClick = (icon: string) => {
    onChange(icon); // Llama a onChange con el objeto TMediaFile completo del icono seleccionado
  };

  return (
    <Box sx={{ border: error ? '1px solid red' : '1px solid #ccc', borderRadius: '4px', p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Selecciona un Icono:
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {STATIC_ICONS.map((icon,index) => (
          <IconButton
            key={index}
            onClick={() => handleIconClick(icon)}
            sx={{
              outline: selectedIconUrl === icon ? '2px solid orange' : '1px solid #eee',
              borderRadius: '8px',
              padding: 1,
              transition:"300ms",
              '&:hover': {
                borderColor: selectedIconUrl === icon ? 'orange' : 'gray',
              },
            }}
            aria-label={`Seleccionar ${index + 1}`}
          >
            <img
              src={`/icons/${icon}`}
              alt={'Opción icono'}
              style={{ width: 48, height: 48, objectFit: 'contain' }}
            />
          </IconButton>
        ))}
      </Box>
      {helperText && (
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default IconSelector;