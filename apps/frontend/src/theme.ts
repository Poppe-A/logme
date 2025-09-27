// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: '#32a852',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#2196F3', // Bleu énergique
      dark: '#1769aa',
      light: '#64b5f6',
    },
    secondary: {
      main: '#FF6D00', // Orange dynamique
      dark: '#c43e00',
      light: '#ff9e40',
    },
    success: {
      main: '#43a047', // Vert santé
    },
    background: {
      // default: '#ccd9ed',
      paper: '#ffffff',
    },
    text: {
      primary: '#1b1b1b',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': {
          height: '100vh',
          // todo check if fine on mobile
          width: '100%',
          margin: 0,
          padding: 0,
          //   overflowX: 'hidden', // 🔥 supprime la scrollbar horizontale
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: 'auto', // ⬅️ au lieu de 100%
          minWidth: '200px', // optionnel : éviter que ça devienne trop petit
        },
      },
      defaultProps: {
        fullWidth: false, // ⬅️ force le comportement "auto"
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: 'auto',
          minWidth: '200px',
        },
      },
      defaultProps: {
        fullWidth: false,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 20px',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          // borderRadius: '20px',
          // boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          // '&:hover': {
          //   transform: 'translateY(-4px)',
          //   boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          // },
        },
      },
    },
  },
});

export default theme;
