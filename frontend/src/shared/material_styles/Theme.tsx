// src/theme.js
import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';
import { esES as coreEsES } from '@mui/material/locale';
import { esES as dataGridEsES } from '@mui/x-data-grid/locales';
const theme = createTheme({
    palette: {
        primary: {
            main: '#fd6741', // Un azul estándar de MUI como ejemplo
            // Puedes definir tonos más claros u oscuros si lo deseas
            light: '#42a5f5',
            dark: '#fc6844',
            contrastText: '#fff', // Color del texto que contrasta bien con el color principal
        },

        secondary: {
            main: '#EB6095', // Un púrpura estándar de MUI como ejemplo
            light: '#ba68c8',
            dark: '#7b1fa2',
            contrastText: '#fff',
        },
        error: {
            main: '#d32f2f', // Color para errores
        },
        warning: {
            main: '#ed6c02', // Color para advertencias
        },
        info: {
            main: 'rgba(15, 12, 9, 0.8)', // Color para información
        },
        success: {
            main: '#2e7d32', // Color para éxito
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)', // Color de texto principal
            secondary: 'rgba(0, 0, 0, 0.6)', // Color de texto secundario
        },
        background: {
            default: '#f5f5f5', // Color de fondo predeterminado para la página
            paper: '#fff', // Color de fondo para componentes como Paper, Card, etc.
        },
        // Puedes añadir más colores personalizados aquí si es necesario
        // myCustomColor: {
        //   main: '#ff5722',
        // },
    },
    typography: {
        fontFamily: "Roboto",
        caption: {
            color: "rgba(0,0,0,0.5)",
            fontWeight: 600
        },
        body1: {
            fontSize: "1rem",
            fontWeight: 400,
        },
        body2: {
            fontSize: "0.9rem",
            fontWeight: 200,
            lineHeight: "19px"

        },
        button: {
            fontWeight: 400
        }

        // Aquí puedes configurar fuentes, tamaños de texto, etc.
        // fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        // h1: {
        //   fontSize: '2rem',
        // },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    // Estilos por defecto para todos los botones
                    '@media (max-width:1366px)': {
                        padding: '5px 15px',
                        fontSize: '0.75rem',
                    },
                },
            },

        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '@media (max-width: 1388px)': {
                        // Reduce la altura del input
                        height: '40px', // Ajusta este valor según lo necesites
                        margin:"5px 0px"
                    },
                },
                input: {
                    fontSize: '0.9rem', // Reduce el tamaño de la fuente
                    '@media (max-width: 1388px)': {
                        padding: '6px 10px',
                        fontSize: '0.8rem',
                    },
                },
                notchedOutline: {
                    '@media (max-width: 1388px)': {
                        // Opcional: podrías ajustar el grosor del borde si lo deseas
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    '@media (max-width: 1388px)': {
                        fontSize: '0.9rem', // Reduce también el tamaño de la etiqueta si es necesario
                        transform: 'translate(14px, 18px) scale(0.75)', // Ajusta la posición y escala cuando está colapsada
                        '&.MuiInputLabel-shrink': {
                            transform: 'translate(0px, -9px) scale(0.75)',
                        },
                    },
                },
            },
        },
    // Aquí puedes anular estilos por defecto de componentes específicos
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: 8,
    //     },
    //   },
    // },
},
    // Puedes añadir más personalizaciones como breakpoints, zIndex, etc.
}, esES, coreEsES,
    dataGridEsES);

export default theme;