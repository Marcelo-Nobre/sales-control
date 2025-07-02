import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, useColorScheme, Animated, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

type SyncStatusProps = {
  isOffline: boolean;
  isSyncing: boolean;
  lastSync?: Date;
};

export default function SyncStatus({ isOffline, isSyncing, lastSync }: SyncStatusProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const spinValue = useRef(new Animated.Value(0)).current;

  // Calcular tamanhos responsivos
  const getIconSize = () => {
    if (width >= 1200) return 16; // Tablets grandes
    if (width >= 768) return 14; // Tablets
    return 12; // Celulares
  };

  const getFontSize = () => {
    if (width >= 1200) return 14; // Tablets grandes
    if (width >= 768) return 12; // Tablets
    return 11; // Celulares
  };

  const iconSize = getIconSize();
  const fontSize = getFontSize();

  useEffect(() => {
    if (isSyncing) {
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
  }, [isSyncing, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (isOffline || isSyncing || lastSync) {
    const getStatusInfo = () => {
      if (isOffline) {
        return {
          icon: 'wifi',
          text: 'Modo Offline',
          color: theme.buttonDanger,
          animated: false,
        };
      }

      if (isSyncing) {
        return {
          icon: 'circle-o-notch',
          text: 'Sincronizando...',
          color: theme.tint,
          animated: true,
        };
      }

      if (lastSync && !isOffline) {
        return {
          icon: 'check-circle',
          text: `Sincronizado ${formatLastSync(lastSync)}`,
          color: theme.buttonSuccess,
          animated: false,
        };
      }

      if (!isOffline && !isSyncing) {
        return {
          icon: 'wifi',
          text: 'Online',
          color: theme.buttonSuccess,
          animated: false,
        };
      }

      return null;
    };

    const statusInfo = getStatusInfo();
    if (!statusInfo) return null;

    const renderIcon = () => {
      if (statusInfo.animated) {
        return (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <FontAwesome
              name={statusInfo.icon as any}
              size={iconSize}
              color={statusInfo.color}
            />
          </Animated.View>
        );
      }

      return (
        <FontAwesome
          name={statusInfo.icon as any}
          size={iconSize}
          color={statusInfo.color}
        />
      );
    };

    return (
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        {renderIcon()}
        <Text style={[styles.text, { color: statusInfo.color, fontSize: fontSize }]}>
          {statusInfo.text}
        </Text>
      </View>
    );
  } else {
    return null;
  }
}

function formatLastSync(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'agora';
  if (diffInMinutes < 60) return `há ${diffInMinutes} min`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `há ${diffInHours}h`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `há ${diffInDays} dias`;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontWeight: '500',
  },
});
