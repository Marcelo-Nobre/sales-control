import React from 'react';
import { View, TextInput, StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChangeText, placeholder = 'Buscar...' }: SearchBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { width } = useWindowDimensions();

  // Calcular tamanhos responsivos
  const getInputHeight = () => {
    if (width >= 1200) return 56; // Tablets grandes
    if (width >= 768) return 48; // Tablets
    return 44; // Celulares
  };

  const getFontSize = () => {
    if (width >= 1200) return 18; // Tablets grandes
    if (width >= 768) return 16; // Tablets
    return 16; // Celulares
  };

  const inputHeight = getInputHeight();
  const fontSize = getFontSize();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <FontAwesome name="search" size={16} color={theme.tabIconDefault} style={styles.icon} />
      <TextInput
        style={[
          styles.input,
          {
            color: theme.text,
            fontSize: fontSize,
            height: inputHeight,
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.tabIconDefault}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: 12,
  },
  icon: {
    marginRight: 8,
  },
});
