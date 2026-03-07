import { createContext, useContext } from 'react';
import type { PaletteMode } from '@mui/material';

interface ColorModeContextValue {
  mode: PaletteMode;
  toggleMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  toggleMode: () => {},
});

export const useColorMode = (): ColorModeContextValue => useContext(ColorModeContext);
