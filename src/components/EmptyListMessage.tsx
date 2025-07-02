import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, useColorScheme, useWindowDimensions, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

type EmptyListMessageProps = {
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  message: string;
};

export default function EmptyListMessage({ iconName, message }: EmptyListMessageProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const spinValue = useRef(new Animated.Value(0)).current;

  // Calcular tamanhos responsivos
  const getIconSize = () => {
    if (width >= 1200) return 80; // Tablets grandes
    if (width >= 768) return 64; // Tablets
    return 48; // Celulares
  };

  const getFontSize = () => {
    if (width >= 1200) return 20; // Tablets grandes
    if (width >= 768) return 18; // Tablets
    return 16; // Celulares
  };

  const iconSize = getIconSize();
  const fontSize = getFontSize();

  // Animação do spinner
  useEffect(() => {
    if (iconName === 'spinner') {
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
  }, [iconName, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderIcon = () => {
    if (iconName === 'spinner') {
      return (
        <Animated.View style={[styles.icon, { transform: [{ rotate: spin }] }]}>
          <FontAwesome name="circle-o-notch" size={iconSize} color={theme.tabIconDefault} />
        </Animated.View>
      );
    }

    return (
      <FontAwesome
        name={iconName}
        size={iconSize}
        color={theme.tabIconDefault}
        style={styles.icon}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderIcon()}
      <Text style={[
        styles.message,
        {
          color: theme.textSecondary,
          fontSize: fontSize,
        }
      ]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    fontWeight: '500',
  },
});
