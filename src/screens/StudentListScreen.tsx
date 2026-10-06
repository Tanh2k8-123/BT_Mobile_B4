import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar } from '../components/Avatar';
import { SettingsSheet } from '../components/SettingsSheet';
import { useLocalization } from '../localization/LocalizationContext';
import { useStudents } from '../students/StudentContext';
import { colors } from '../theme';
import type { RootStackParamList, Student } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'StudentList'>;

export function StudentListScreen({ navigation }: Props) {
  const { t } = useLocalization();
  const { students, ready } = useStudents();
  const [query, setQuery] = useState('');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredStudents = useMemo(() => students.filter((student) =>
    `${student.fullName} ${student.studentId} ${student.email}`.toLocaleLowerCase().includes(normalizedQuery)),
  [students, normalizedQuery]);

  const openDetails = (student: Student) => navigation.navigate('StudentDetail', { studentId: student.id });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>S</Text></View>
          <Text style={styles.brandName}>{t('appName')}</Text>
        </View>
        <Pressable onPress={() => setSettingsVisible(true)} style={styles.settingsButton} accessibilityRole="button" accessibilityLabel={t('settings')}>
          <Text style={styles.settingsGlyph}>⚙</Text>
        </Pressable>
      </View>

      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>{t('listTitle')}</Text>
          <Text style={styles.subtitle}>{t('listSubtitle')}</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countNumber}>{students.length}</Text>
          <Text style={styles.countLabel}>{t(students.length === 1 ? 'student' : 'studentCount')}</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchGlyph}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
          returnKeyType="search"
          accessibilityLabel={t('searchPlaceholder')}
        />
        {query.length > 0 && <Pressable onPress={() => setQuery('')} accessibilityLabel={t('clearSearch')}><Text style={styles.clearSearch}>×</Text></Pressable>}
      </View>

      <Pressable onPress={() => navigation.navigate('StudentForm', {})} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]} accessibilityRole="button">
        <Text style={styles.addPlus}>＋</Text>
        <Text style={styles.addLabel}>{t('addStudent')}</Text>
      </Pressable>

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, filteredStudents.length === 0 && styles.emptyListContent]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable onPress={() => openDetails(item)} style={({ pressed }) => [styles.studentCard, pressed && styles.cardPressed]} accessibilityRole="button">
            <Avatar uri={item.avatarUri} name={item.fullName} size={56} />
            <View style={styles.studentCopy}>
              <Text style={styles.studentName} numberOfLines={1}>{item.fullName}</Text>
              <View style={styles.idBadge}><Text style={styles.idText} numberOfLines={1}>{item.studentId}</Text></View>
              <Text style={styles.studentEmail} numberOfLines={1}>{item.email}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        )}
        ListEmptyComponent={(
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><Text style={styles.emptyIconText}>{ready && normalizedQuery ? '⌕' : '＋'}</Text></View>
            <Text style={styles.emptyTitle}>{ready && normalizedQuery ? t('noResults') : t('emptyTitle')}</Text>
            {!normalizedQuery && <Text style={styles.emptyMessage}>{t('emptyMessage')}</Text>}
          </View>
        )}
      />

      <View style={styles.footer}><View style={styles.footerDot} /><Text style={styles.footerText}>{t('localStorage')}</Text></View>
      <SettingsSheet visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: { height: 58, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  brandMarkText: { color: colors.white, fontSize: 18, fontWeight: '900' },
  brandName: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  settingsButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  settingsGlyph: { color: colors.muted, fontSize: 20 },
  headingRow: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headingCopy: { flex: 1 },
  title: { fontSize: 27, lineHeight: 34, fontWeight: '800', color: colors.ink, letterSpacing: -0.6 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 5 },
  countBadge: { backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 13, alignItems: 'center', minWidth: 70 },
  countNumber: { color: colors.primary, fontSize: 18, fontWeight: '800' },
  countLabel: { color: colors.primary, fontSize: 10, fontWeight: '700', marginTop: 1 },
  searchBox: { marginHorizontal: 20, height: 50, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 },
  searchGlyph: { color: colors.muted, fontSize: 27, marginRight: 8, lineHeight: 30 },
  searchInput: { flex: 1, height: '100%', color: colors.ink, fontSize: 14 },
  clearSearch: { color: colors.muted, fontSize: 22, paddingHorizontal: 4 },
  addButton: { marginHorizontal: 20, marginTop: 14, height: 50, borderRadius: 14, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, shadowColor: colors.primary, shadowOpacity: 0.17, shadowRadius: 9, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  addPlus: { color: colors.white, fontSize: 24, lineHeight: 25, fontWeight: '400' },
  addLabel: { color: colors.white, fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.86 },
  listContent: { paddingHorizontal: 20, paddingTop: 17, paddingBottom: 14, flexGrow: 1 },
  emptyListContent: { justifyContent: 'center' },
  separator: { height: 10 },
  studentCard: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 17, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 91 },
  cardPressed: { backgroundColor: '#F8FAFF', borderColor: '#CBD8FF' },
  studentCopy: { flex: 1, minWidth: 0 },
  studentName: { color: colors.ink, fontSize: 15, lineHeight: 21, fontWeight: '700' },
  idBadge: { alignSelf: 'flex-start', backgroundColor: '#F1F5F9', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
  idText: { color: '#475569', fontSize: 11, fontFamily: 'monospace', fontWeight: '600' },
  studentEmail: { color: colors.muted, fontSize: 12, marginTop: 4 },
  chevron: { color: '#94A3B8', fontSize: 29, marginLeft: 1 },
  emptyState: { alignItems: 'center', paddingHorizontal: 25, paddingVertical: 28 },
  emptyIcon: { width: 66, height: 66, borderRadius: 22, backgroundColor: colors.primarySoft, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  emptyIconText: { color: colors.primary, fontSize: 32 },
  emptyTitle: { color: colors.ink, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  emptyMessage: { color: colors.muted, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 7, maxWidth: 260 },
  footer: { paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  footerDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.teal },
  footerText: { color: colors.muted, fontSize: 11, fontWeight: '500' },
});
