import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar } from '../components/Avatar';
import { AppButton } from '../components/AppButton';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useLocalization } from '../localization/LocalizationContext';
import { useStudents } from '../students/StudentContext';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'StudentDetail'>;

export function StudentDetailScreen({ navigation, route }: Props) {
  const { t } = useLocalization();
  const { getStudent, deleteStudent } = useStudents();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const student = getStudent(route.params.studentId);

  const confirmDelete = async () => {
    if (!student) return;
    setBusy(true);
    await deleteStudent(student.id);
    setBusy(false);
    setConfirmVisible(false);
    navigation.popToTop();
  };

  if (!student) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>{t('studentNotFound')}</Text>
          <AppButton label={t('cancel')} onPress={() => navigation.goBack()} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel={t('cancel')}>
          <Text style={styles.backGlyph}>‹</Text>
        </Pressable>
        <Text style={styles.topTitle}>{t('studentDetails')}</Text>
        <View style={styles.topSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <View style={styles.avatarWrap}>
            <Avatar uri={student.avatarUri} name={student.fullName} size={104} />
            <View style={styles.photoBadge}><Text style={styles.photoGlyph}>▧</Text></View>
          </View>
          <Text style={styles.name}>{student.fullName}</Text>
          <View style={styles.statusBadge}><View style={styles.statusDot} /><Text style={styles.statusText}>{student.studentId}</Text></View>
        </View>

        <View style={styles.infoCard}>
          <DetailRow label={t('fullName')} value={student.fullName} icon="A" />
          <View style={styles.divider} />
          <DetailRow label={t('studentId')} value={student.studentId} icon="#" mono />
          <View style={styles.divider} />
          <DetailRow label={t('email')} value={student.email} icon="@" />
          <View style={styles.divider} />
          <DetailRow label={t('avatar')} value={student.avatarUri ? (student.avatarSource === 'url' ? student.avatarUri : t('devicePhoto')) : '—'} icon="▧" />
        </View>

        <View style={styles.storageNote}><Text style={styles.storageIcon}>✓</Text><Text style={styles.storageText}>{t('localStorage')}</Text></View>
      </ScrollView>
      <View style={styles.actions}>
        <AppButton label={t('editStudent')} onPress={() => navigation.navigate('StudentForm', { studentId: student.id })} />
        <AppButton label={t('deleteStudent')} onPress={() => setConfirmVisible(true)} variant="outline-danger" />
      </View>
      <ConfirmDialog
        visible={confirmVisible}
        title={t('confirmDeleteTitle')}
        message={t('confirmDeleteMessage')}
        confirmLabel={t('yesDelete')}
        destructive
        busy={busy}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => void confirmDelete()}
      />
    </SafeAreaView>
  );
}

function DetailRow({ label, value, icon, mono }: { label: string; value: string; icon: string; mono?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}><Text style={styles.detailIconText}>{icon}</Text></View>
      <View style={styles.detailCopy}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, mono && styles.mono]} selectable>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  backButton: { height: 42, width: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 },
  backGlyph: { color: colors.ink, fontSize: 32, lineHeight: 34, marginTop: -3 },
  topTitle: { flex: 1, color: colors.ink, fontSize: 16, fontWeight: '700' },
  topSpacer: { width: 42 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  profile: { alignItems: 'center', paddingVertical: 17 },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  photoBadge: { position: 'absolute', right: -2, bottom: 1, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, borderWidth: 3, borderColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  photoGlyph: { color: colors.white, fontSize: 15, fontWeight: '700' },
  name: { color: colors.ink, fontSize: 23, fontWeight: '800', textAlign: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 9, backgroundColor: colors.successSoft, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  statusText: { color: colors.success, fontFamily: 'monospace', fontSize: 12, fontWeight: '700' },
  infoCard: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 15, marginTop: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15, minHeight: 70 },
  detailIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  detailIconText: { color: colors.primary, fontSize: 17, fontWeight: '800' },
  detailCopy: { flex: 1, minWidth: 0 },
  detailLabel: { color: colors.muted, fontSize: 12, marginBottom: 4 },
  detailValue: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  mono: { fontFamily: 'monospace', letterSpacing: 0.2 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 50 },
  storageNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 18 },
  storageIcon: { backgroundColor: colors.successSoft, color: colors.success, fontSize: 11, fontWeight: '900', overflow: 'hidden', textAlign: 'center', width: 17, height: 17, borderRadius: 9, lineHeight: 17 },
  storageText: { color: colors.muted, fontSize: 12 },
  actions: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14, gap: 10, backgroundColor: colors.background },
  notFound: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  notFoundText: { textAlign: 'center', color: colors.ink, fontSize: 18, fontWeight: '700' },
});
