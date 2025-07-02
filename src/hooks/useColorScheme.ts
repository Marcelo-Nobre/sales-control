/* eslint-disable prettier/prettier */
import { CustomTheme } from '@/constants/stylesheets';
import { useTheme } from '@react-navigation/native';

export const useCustomTheme = () => useTheme() as CustomTheme;
