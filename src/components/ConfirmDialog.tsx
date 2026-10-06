import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalization } from '../localization/LocalizationContext';
import { colors } from '../theme';
import { AppButton } from './AppButton';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
};

export function ConfirmDialog({ visible, title, message, confirmLabel, destructive, onCancel, onConfirm, busy }: Props) {
  const { t } = useLocalization();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={styles.scrim}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel={t('cancel')} />
        <View accessibilityViewIsModal style={styles.card}>
          <View style={[styles.iconWrap, destructive && styles.dangerIconWrap]}>
            <Text style={[styles.icon, destructive && styles.dangerIcon]}>{destructive ? '!' : '?'}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <AppButton label={t('no')} onPress={onCancel} variant="secondary" compact style={styles.action} />
            <AppButton label={confirmLabel} onPress={onConfirm} variant={destructive ? 'danger' : 'primary'} compact loading={busy} style={styles.action} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.42)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 420, borderRadius: 22, padding: 24, backgroundColor: colors.surface, alignItems: 'center', shadowColor: '#0F172A', shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
  iconWrap: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  dangerIconWrap: { backgroundColor: colors.dangerSoft },
  icon: { fontSize: 23, fontWeight: '800', color: colors.primary },
  dangerIcon: { color: colors.danger },
  title: { color: colors.ink, fontSize: 20, lineHeight: 27, fontWeight: '800', textAlign: 'center' },
  message: { color: colors.muted, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 10 },
  actions: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 23 },
  action: { flex: 1, paddingHorizontal: 8 },
});
