import { createTheme, type PaletteMode, type ThemeOptions } from '@mui/material';

const getThemeOptions = (mode: PaletteMode): ThemeOptions => {
  const isDark = mode === 'dark';
  const primaryMain = '#014385';
  const primaryDark = '#022d57';
  const orangeAccent = '#ec6a17';

  return {
    palette: {
      mode,
      primary: { main: primaryMain, dark: primaryDark },
      info: { main: primaryMain },
      secondary: { main: orangeAccent },
      background: {
        default: isDark ? '#08111f' : '#f3f6fb',
        paper: isDark ? '#101b2c' : '#ffffff',
      },
      text: {
        primary: isDark ? '#ebf1fb' : '#122033',
        secondary: isDark ? '#8ea0bd' : '#66768f',
      },
      divider: isDark ? '#22324d' : '#d9e4f0',
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: '"Public Sans", sans-serif',
      h4: {
        fontWeight: 900,
        letterSpacing: '-0.04em',
      },
      h5: {
        fontWeight: 800,
        letterSpacing: '-0.03em',
      },
      h6: {
        fontWeight: 700,
      },
      button: {
        fontWeight: 700,
        textTransform: 'none',
        letterSpacing: 0,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isDark ? '#1d2c45' : '#e4ebf3'}`,
            boxShadow: 'none',
            backdropFilter: 'blur(18px)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            paddingInline: 16,
          },
          containedPrimary: {
            fontWeight: 700,
            backgroundImage: `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
            boxShadow: isDark
              ? '0 10px 24px rgba(1, 67, 133, 0.32)'
              : '0 10px 24px rgba(1, 67, 133, 0.18)',
          },
          containedSecondary: {
            backgroundColor: orangeAccent,
            boxShadow: isDark
              ? '0 10px 24px rgba(236, 106, 23, 0.28)'
              : '0 10px 24px rgba(236, 106, 23, 0.2)',
          },
          outlinedPrimary: {
            borderColor: isDark ? '#36547e' : '#bfd0e2',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 18,
            border: `1px solid ${isDark ? '#1f2d46' : '#dce6f1'}`,
            boxShadow: isDark
              ? '0 18px 48px rgba(4, 10, 22, 0.38)'
              : '0 18px 42px rgba(15, 23, 42, 0.06)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 18,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: isDark ? '#0d1625' : '#f7faff',
          },
          notchedOutline: {
            borderColor: isDark ? '#24354f' : '#d9e4f1',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
            borderRadius: 999,
            backgroundColor: orangeAccent,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 52,
            fontWeight: 700,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            marginBottom: 6,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 700,
          },
        },
      },
    },
  };
};

export const createAppTheme = (mode: PaletteMode) => createTheme(getThemeOptions(mode));
