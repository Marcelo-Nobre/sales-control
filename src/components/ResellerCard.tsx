import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, useWindowDimensions, Animated, Linking } from 'react-native';
import { Revendedor } from '../lib/data';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

type ResellerCardProps = {
  revendedor: Revendedor;
  isTablet?: boolean;
  onPress?: () => void;
};

export default function ResellerCard({ revendedor, isTablet, onPress }: ResellerCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Calcular tamanhos responsivos
  const getCardPadding = () => {
    if (width >= 1200) return 20; // Tablets grandes
    if (width >= 768) return 16; // Tablets
    return 16; // Celulares
  };

  const getFontSize = () => {
    if (width >= 1200) return { name: 20, details: 16 }; // Tablets grandes
    if (width >= 768) return { name: 18, details: 14 }; // Tablets
    return { name: 18, details: 14 }; // Celulares
  };

  const fontSize = getFontSize();
  const cardPadding = getCardPadding();

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  const handleWhatsApp = () => {
    const phoneNumber = revendedor.telefone.replace(/[()\s\-]/g, '');
    const whatsappUrl = `whatsapp://send?phone=55${phoneNumber}`;

    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        // Fallback para web se o app não estiver instalado
        const webUrl = `https://wa.me/55${phoneNumber}`;
        Linking.openURL(webUrl);
      }
    });
  };

  const CardContent = (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.card,
        borderColor: theme.border,
        padding: cardPadding,
      }
    ]}>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={[
            styles.name,
            {
              color: theme.text,
              fontSize: fontSize.name
            }
          ]}>
            {revendedor.nome}
          </Text>
          <View style={[
            styles.statusBadge,
            {
              backgroundColor: revendedor.status === 'ativo' ? theme.buttonSuccess + '20' : theme.buttonDanger + '20',
              borderColor: revendedor.status === 'ativo' ? theme.buttonSuccess : theme.buttonDanger
            }
          ]}>
            <Text style={[
              styles.statusText,
              {
                color: revendedor.status === 'ativo' ? theme.buttonSuccess : theme.buttonDanger,
                fontSize: fontSize.details - 2
              }
            ]}>
              {revendedor.status === 'ativo' ? 'ATIVO' : 'INATIVO'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <FontAwesome name="id-card" size={12} color={theme.tabIconDefault} style={styles.detailIcon} />
            <Text style={[
              styles.details,
              {
                color: theme.textSecondary,
                fontSize: fontSize.details
              }
            ]}>
              {revendedor.cpf}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesome name="phone" size={12} color={theme.tabIconDefault} style={styles.detailIcon} />
            <Text style={[
              styles.details,
              {
                color: theme.textSecondary,
                fontSize: fontSize.details
              }
            ]}>
              {revendedor.telefone}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <FontAwesome name="map-marker" size={12} color={theme.tabIconDefault} style={styles.detailIcon} />
            <Text
              style={[
                styles.details,
                {
                  color: theme.textSecondary,
                  fontSize: fontSize.details
                }
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {revendedor.endereco}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={handleWhatsApp}
          style={[
            styles.whatsappButton,
            {
              backgroundColor: '#25D366',
            }
          ]}
          activeOpacity={0.8}
        >
          <FontAwesome name="whatsapp" size={20} color="white" />
        </TouchableOpacity>

        <View style={styles.arrowContainer}>
          <FontAwesome name="chevron-right" size={16} color={theme.tabIconDefault} />
        </View>
      </View>
    </View>
  );

  if (isTablet) {
    return (
      <Animated.View style={[styles.touchableContainer, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.touchableArea}
          activeOpacity={1}
        >
          {CardContent}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.touchableContainer, { transform: [{ scale: scaleAnim }] }]}>
      <Link href={`/edit/${revendedor.id}`} asChild>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.touchableArea}
          activeOpacity={1}
        >
          {CardContent}
        </TouchableOpacity>
      </Link>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  touchableContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  touchableArea: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 100,
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  detailsContainer: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 8,
    width: 12,
  },
  details: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  whatsappButton: {
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowContainer: {
    paddingLeft: 8,
    justifyContent: 'center',
  },
});
