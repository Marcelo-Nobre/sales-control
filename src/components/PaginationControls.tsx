import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Animated, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors, { getContrastingTextColor } from '../constants/Colors';

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  itemCount?: number;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  itemCount = 0
}: PaginationControlsProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const spinValue = useRef(new Animated.Value(0)).current;

  // Calcular tamanhos responsivos
  const getButtonSize = () => {
    if (width >= 1200) return 48; // Tablets grandes
    if (width >= 768) return 44; // Tablets
    return 40; // Celulares
  };

  const getFontSize = () => {
    if (width >= 1200) return 16; // Tablets grandes
    if (width >= 768) return 14; // Tablets
    return 14; // Celulares
  };

  const buttonSize = getButtonSize();
  const fontSize = getFontSize();

  useEffect(() => {
    if (loading) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();

      return () => spinAnimation.stop();
    }
  }, [loading, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Mostrar paginação se há mais de 1 página ou se há muitos itens
  const shouldShowPagination = totalPages > 1 || itemCount > 15;
  if (!shouldShowPagination) return null;

  const canGoPrevious = currentPage > 1 && !loading;
  const canGoNext = currentPage < totalPages && !loading;

  // Calcular informações de itens
  const itemsPerPage = 15;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, itemCount);

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: canGoPrevious ? theme.tint : theme.tabIconDefault,
            opacity: canGoPrevious ? 1 : 0.5,
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          }
        ]}
        onPress={() => canGoPrevious && onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      >
        <FontAwesome
          name="chevron-left"
          size={16}
          color={canGoPrevious ? getContrastingTextColor(colorScheme) : theme.textSecondary}
        />
      </TouchableOpacity>

      <View style={styles.pageInfo}>
        <Text style={[
          styles.pageText,
          {
            color: theme.text,
            fontSize: fontSize
          }
        ]}>
          Página {currentPage} de {totalPages}
        </Text>
        {itemCount > 0 && (
          <Text style={[
            styles.itemCountText,
            {
              color: theme.textSecondary,
              fontSize: fontSize - 2
            }
          ]}>
            {startItem}-{endItem} de {itemCount}
          </Text>
        )}
        {loading && (
          <Animated.View style={[styles.loadingContainer, { transform: [{ rotate: spin }] }]}>
            <FontAwesome
              name="circle-o-notch"
              size={12}
              color={theme.textSecondary}
            />
          </Animated.View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: canGoNext ? theme.tint : theme.tabIconDefault,
            opacity: canGoNext ? 1 : 0.5,
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          }
        ]}
        onPress={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        <FontAwesome
          name="chevron-right"
          size={16}
          color={canGoNext ? getContrastingTextColor(colorScheme) : theme.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pageInfo: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  pageText: {
    fontWeight: '600',
  },
  itemCountText: {
    marginTop: 2,
  },
  loadingContainer: {
    width: 12,
    height: 12,
    marginTop: 4,
  },
});
