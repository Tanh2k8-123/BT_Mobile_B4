import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Props = { uri?: string; name: string; size?: number };

export function Avatar({ uri, name, size = 58 }: Props) {
  const initials = name.trim().split(/\s+/).slice(-2).map((part) => part[0]?.toUpperCase()).join('') || '?';
  const style = { width: size, height: size, borderRadius: size / 2 };
  return (
    <View style={[styles.frame, style]}>
      {uri ? <Image source={{ uri }} style={[styles.image, style]} /> : <Text style={[styles.initials, { fontSize: Math.max(16, size * 0.27) }]}>{initials}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft, overflow: 'hidden', borderWidth: 1, borderColor: '#D9E4FF' },
  image: { resizeMode: 'cover' },
  initials: { color: colors.primary, fontWeight: '800' },
});
