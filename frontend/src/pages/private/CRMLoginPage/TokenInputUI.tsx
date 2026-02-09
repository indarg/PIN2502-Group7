import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { Box, Typography, TextField, Button, Stack, Container } from '@mui/material';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import { resolveErrorMessage } from 'src/models/TSnackbarMessage';

interface TokenInputUIProps {
  onVerify: (token: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

const TokenInputUI: React.FC<TokenInputUIProps> = ({ onVerify, isLoading = false, error = null }) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const {setSnackbarMessage} = useCRMCommon();
  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // Solo permitir un dígito numérico
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newDigits = [...digits];
      newDigits[index] = value;
      setDigits(newDigits);

      // Mover el foco al siguiente campo si se ingresó un dígito
      if (value && index < digits.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    // Si la tecla es "Backspace" y el campo actual está vacío, mover el foco al campo anterior
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Permitir la navegación con las flechas
    if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowRight' && index < digits.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault(); // Prevenir el pegado por defecto
    const pasteData = event.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) { // Asegurarse de que son exactamente 6 dígitos
      const newDigits = pasteData.split('');
      setDigits(newDigits);
      // Mover el foco al último campo después de pegar
      inputRefs.current[digits.length - 1]?.focus();
    } else {
      // Opcional: mostrar un mensaje de error si el pegado no es un formato válido
      setSnackbarMessage(resolveErrorMessage('Por favor, ingresa un token de 6 dígitos válido.'))
    }
  };

  const handleSubmit = () => {
    const token = digits.join('');
    if (token.length === 6 && /^\d{6}$/.test(token)) {
      onVerify(token);
    } else {
      // Manejar el caso de token incompleto o inválido
      setSnackbarMessage(resolveErrorMessage('Por favor, ingresa un token de 6 dígitos válido.'))
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Verificación de Token
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Ingresa el código de 6 dígitos enviado a tu correo electrónico o dispositivo.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          {digits.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined} // Solo manejar el pegado en el primer campo
              variant="outlined"
              size="medium"
              inputProps={{
                maxLength: 1, // Limita a un dígito por campo
                style: { textAlign: 'center', fontSize: '1.5rem', width: '30px' }, // Estilo para cada dígito
              }}
              sx={{ width: '45px' }} // Ancho del campo
              autoFocus={index === 0} // Foco inicial en el primer campo
              type="tel" // Sugiere teclado numérico en móviles
            />
          ))}
        </Stack>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 2 }}
          onClick={handleSubmit}
          disabled={isLoading || digits.join('').length !== 6} // Deshabilita si no hay 6 dígitos
        >
          {isLoading ? 'Verificando...' : 'Verificar Token'}
        </Button>
      </Box>
    </Container>
  );
};

export default TokenInputUI;