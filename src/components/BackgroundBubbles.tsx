import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { View, useWindowDimensions, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

interface BackgroundBubblesProps {
  children: ReactNode;
}

const BackgroundBubbles = ({ children }: BackgroundBubblesProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const dimensions = useWindowDimensions();

  const [bubbleStyles, setBubbleStyles] = useState<any>([]);

  const minBubbles = 3;
  const maxBubbles = 8;

  useEffect(() => {
    const numberOfBubbles = Math.floor(Math.random() * (maxBubbles - minBubbles + 1)) + minBubbles;
    const newBubbleStyles = Array.from({ length: numberOfBubbles }, () => createBubbleStyle());
    setBubbleStyles(newBubbleStyles);
  }, []);

  const createBubbleStyle = useCallback(() => {
    const size = Math.random() * 60 + 40; // 40-100px
    const opacity = Math.random() * 0.3 + 0.1; // 0.1-0.4 opacity

    return {
      position: 'absolute' as const,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: theme.tint,
      opacity,
      transform: [
        { translateX: Math.random() * dimensions.width - size / 2 },
        { translateY: Math.random() * dimensions.height - size / 2 }
      ],
    };
  }, [dimensions.width, dimensions.height, theme.tint]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {bubbleStyles.map((bubbleStyle: any, index: number) => (
        <View key={index} style={bubbleStyle} pointerEvents="none" />
      ))}
      <View style={{ flex: 1, zIndex: 1 }}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default BackgroundBubbles;
