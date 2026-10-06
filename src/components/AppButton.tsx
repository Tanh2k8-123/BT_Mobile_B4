import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline-danger' | 'text';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  compact?: boolean;
};

export function AppButton({ label, onPress, variant = 'primary', disabled, loading, style, compact }: Props) {
  const buttonVariantStyle = variant === 'outline-danger' ? styles.outlineDanger : styles[variant];
  const labelVariantStyle = variant === 'outline-danger'
    ? styles.outlineDangerLabel
    : variant === 'primary' ? styles.primaryLabel
      : variant === 'secondary' ? styles.secondaryLabel
        : variant === 'danger' ? styles.dangerLabel : styles.textLabel;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled || loading) }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        buttonVariantStyle,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? colors.white : colors.primary} />
        : <Text style={[styles.label, labelVariantStyle]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 50, borderRadius: 13, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  compact: { minHeight: 42, paddingHorizontal: 14 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primarySoft },
  danger: { backgroundColor: colors.danger },
  outlineDanger: { backgroundColor: colors.surface, borderWidth: 1, borderColor: '#FECACA' },
  text: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  label: { color: colors.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.1 },
  primaryLabel: { color: colors.white },
  secondaryLabel: { color: colors.primary },
  dangerLabel: { color: colors.white },
  outlineDangerLabel: { color: colors.danger },
  textLabel: { color: colors.primary },
});
