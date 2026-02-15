import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/theme';

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  color?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  testID?: string;
}

export function FAB({
  onPress,
  icon = 'add',
  color,
  backgroundColor,
  size = 'medium',
  style,
  testID,
}: FABProps) {
  const { colors } = useTheme();

  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, iconSize: 20 };
      case 'large':
        return { width: 64, height: 64, iconSize: 32 };
      default:
        return { width: 56, height: 56, iconSize: 24 };
    }
  };

  const { width, height, iconSize } = getDimensions();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={icon === 'add' ? 'Add' : icon}
      style={[
        styles.fab,
        {
          width,
          height,
          borderRadius: width / 2,
          backgroundColor: backgroundColor ?? colors.primary,
        },
        style,
      ]}
    >
      <MaterialIcons name={icon} size={iconSize} color={color ?? '#FFFFFF'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});
