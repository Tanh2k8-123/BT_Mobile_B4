import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Language } from '../types';
import { useLocalization } from '../localization/LocalizationContext';
import { colors } from '../theme';

type Props = { visible: boolean; onClose: () => void };

export function SettingsSheet({ visible, onClose }: Props) {
  const { language, setLanguage, t } = useLocalization();
  const choose = async (next: Language | null) => {
    await setLanguage(next);
    onClose();
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t('cancel')} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headingRow}>
            <View>
              <Text style={styles.title}>{t('settings')}</Text>
              <Text style={styles.subtitle}>{t('language')}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.close} accessibilityRole="button" accessibilityLabel={t('cancel')}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <LanguageOption label={t('english')} selected={language === 'en'} onPress={() => void choose('en')} />
          <LanguageOption label={t('vietnamese')} selected={language === 'vi'} onPress={() => void choose('vi')} />
          <Text style={styles.note}>{t('languageSaved')}</Text>
        </View>
      </View>
    </Modal>
  );
}

function LanguageOption({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress} style={[styles.option, selected && styles.selectedOption]}>
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={[styles.radio, selected && styles.radioSelected]}>{selected && <View style={styles.radioDot} />}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.34)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 32, borderTopLeftRadius: 26, borderTopRightRadius: 26 },
  handle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: 22 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  title: { color: colors.ink, fontSize: 23, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 3 },
  close: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  closeText: { color: colors.muted, fontSize: 27, lineHeight: 30 },
  option: { minHeight: 58, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 16, marginTop: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectedOption: { borderColor: colors.primary, backgroundColor: '#F5F8FF' },
  optionLabel: { color: colors.ink, fontSize: 16, fontWeight: '600' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#94A3B8', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.primary },
  note: { color: colors.muted, fontSize: 12, marginTop: 14, textAlign: 'center' },
});
