import React, { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../components/AppButton';
import { Avatar } from '../components/Avatar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useLocalization } from '../localization/LocalizationContext';
import { useStudents } from '../students/StudentContext';
import { colors } from '../theme';
import type { AvatarSource, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'StudentForm'>;
type FormErrors = { fullName?: string; studentId?: string; email?: string; avatarUri?: string };

export function StudentFormScreen({ navigation, route }: Props) {
  const { t } = useLocalization();
  const { students, getStudent, addStudent, updateStudent } = useStudents();
  const existing = route.params.studentId ? getStudent(route.params.studentId) : undefined;
  const isEditing = Boolean(route.params.studentId);
  const [fullName, setFullName] = useState(existing?.fullName ?? '');
  const [studentId, setStudentId] = useState(existing?.studentId ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [devicePhotoUri, setDevicePhotoUri] = useState(existing?.avatarSource === 'device' ? existing.avatarUri : '');
  const [imageUrl, setImageUrl] = useState(existing?.avatarSource === 'url' ? existing.avatarUri : '');
  const [sourceMode, setSourceMode] = useState<AvatarSource>('device');
  const [errors, setErrors] = useState<FormErrors>({});
  const [photoMessage, setPhotoMessage] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setFullName(existing.fullName);
    setStudentId(existing.studentId);
    setEmail(existing.email);
    setDevicePhotoUri(existing.avatarSource === 'device' ? existing.avatarUri : '');
    setImageUrl(existing.avatarSource === 'url' ? existing.avatarUri : '');
    setSourceMode(existing.avatarSource);
  }, [existing?.id]);

  const formTitle = isEditing ? t('formTitleEdit') : t('formTitleAdd');
  const normalizedStudentId = useMemo(() => studentId.trim().toLocaleLowerCase(), [studentId]);
  const avatarUri = sourceMode === 'url' ? imageUrl : devicePhotoUri;

  const pickPhoto = async () => {
    setPhotoMessage('');
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setPhotoMessage(t('photoPermission'));
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (result.canceled || !result.assets[0]) return;
      const sourceUri = result.assets[0].uri;
      let persistentUri = sourceUri;
      const documentDirectory = FileSystem.documentDirectory;
      if (documentDirectory && sourceUri.startsWith('file://')) {
        const extension = sourceUri.split('.').pop()?.split(/[?#]/)[0]?.toLowerCase();
        const safeExtension = extension && /^[a-z0-9]{2,5}$/.test(extension) ? extension : 'jpg';
        persistentUri = `${documentDirectory}student-avatar-${Date.now()}.${safeExtension}`;
        await FileSystem.copyAsync({ from: sourceUri, to: persistentUri });
      }
      setDevicePhotoUri(persistentUri);
      setSourceMode('device');
    } catch {
      setPhotoMessage(t('photoError'));
    }
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!fullName.trim()) nextErrors.fullName = t('requiredField');
    if (!studentId.trim()) nextErrors.studentId = t('requiredField');
    else if (students.some((student) => student.id !== existing?.id && student.studentId.trim().toLocaleLowerCase() === normalizedStudentId)) {
      nextErrors.studentId = t('duplicateStudentId');
    }
    if (!email.trim()) nextErrors.email = t('requiredField');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = t('invalidEmail');
    if (sourceMode === 'url' && imageUrl.trim() && !/^https?:\/\//i.test(imageUrl.trim())) {
      nextErrors.avatarUri = t('invalidImageUrl');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    if (isEditing) setConfirmVisible(true);
    else void commit();
  };

  const commit = async () => {
    setSaving(true);
    try {
      const values = {
        fullName: fullName.trim(),
        studentId: studentId.trim(),
        email: email.trim(),
        avatarUri: sourceMode === 'url' ? imageUrl.trim() : devicePhotoUri,
        avatarSource: sourceMode,
      };
      if (existing) {
        await updateStudent(existing.id, values);
        setConfirmVisible(false);
        navigation.goBack();
      } else {
        const created = await addStudent(values);
        navigation.replace('StudentDetail', { studentId: created.id });
      }
    } catch {
      Alert.alert(t('appName'), t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel={t('cancel')}>
            <Text style={styles.backGlyph}>‹</Text>
          </Pressable>
          <Text style={styles.topTitle}>{formTitle}</Text>
          <View style={styles.topSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>{formTitle}</Text>
          <Text style={styles.intro}>{t('localStorage')}</Text>

          <View style={styles.photoSection}>
            <View style={styles.avatarFrame}>
              <Avatar uri={avatarUri} name={fullName || 'Student'} size={96} />
              <View style={styles.cameraBadge}><Text style={styles.cameraGlyph}>＋</Text></View>
            </View>
            <Text style={styles.photoLabel}>{t('avatar')}</Text>
            <View style={styles.segment}>
              <Pressable onPress={() => { setSourceMode('device'); setErrors((prev) => ({ ...prev, avatarUri: undefined })); }} style={[styles.segmentItem, sourceMode === 'device' && styles.segmentActive]}>
                <Text style={[styles.segmentText, sourceMode === 'device' && styles.segmentTextActive]}>{t('uploadPhoto')}</Text>
              </Pressable>
              <Pressable onPress={() => { setSourceMode('url'); setErrors((prev) => ({ ...prev, avatarUri: undefined })); }} style={[styles.segmentItem, sourceMode === 'url' && styles.segmentActive]}>
                <Text style={[styles.segmentText, sourceMode === 'url' && styles.segmentTextActive]}>{t('imageUrl')}</Text>
              </Pressable>
            </View>
            {sourceMode === 'device' ? (
              <AppButton label={t('changePhoto')} onPress={() => void pickPhoto()} variant="secondary" compact style={styles.photoButton} />
            ) : (
              <TextInput
                value={imageUrl}
                onChangeText={(value) => { setImageUrl(value); setErrors((prev) => ({ ...prev, avatarUri: undefined })); }}
                placeholder={t('imageUrlPlaceholder')}
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="url"
                style={[styles.urlInput, errors.avatarUri && styles.inputError]}
              />
            )}
            {!!photoMessage && <Text style={styles.helperError}>{photoMessage}</Text>}
            {!!errors.avatarUri && <Text style={styles.helperError}>{errors.avatarUri}</Text>}
          </View>

          <View style={styles.formCard}>
            <FormField label={t('fullName')} value={fullName} onChangeText={setFullName} error={errors.fullName} autoComplete="name" />
            <FormField label={t('studentId')} value={studentId} onChangeText={setStudentId} error={errors.studentId} autoCapitalize="characters" mono />
            <FormField label={t('email')} value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" last />
          </View>
        </ScrollView>
        <View style={styles.actions}>
          <AppButton label={t('cancel')} onPress={() => navigation.goBack()} variant="secondary" style={styles.cancelButton} />
          <AppButton label={isEditing ? t('saveChanges') : t('saveStudent')} onPress={submit} loading={saving} style={styles.saveButton} />
        </View>
      </KeyboardAvoidingView>
      <ConfirmDialog
        visible={confirmVisible}
        title={t('confirmEditTitle')}
        message={t('confirmEditMessage')}
        confirmLabel={t('yes')}
        busy={saving}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => void commit()}
      />
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'name' | 'email';
  mono?: boolean;
  last?: boolean;
};

function FormField({ label, value, onChangeText, error, keyboardType = 'default', autoCapitalize = 'words', autoComplete, mono, last }: FieldProps) {
  return (
    <View style={[styles.field, last && styles.lastField]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#94A3B8"
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        keyboardType={keyboardType}
        style={[styles.input, mono && styles.mono, error && styles.inputError]}
        returnKeyType="next"
      />
      {!!error && <Text style={styles.helperError}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  topBar: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  backButton: { height: 42, width: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 },
  backGlyph: { color: colors.ink, fontSize: 32, lineHeight: 34, marginTop: -3 },
  topTitle: { flex: 1, color: colors.ink, fontSize: 16, fontWeight: '700' },
  topSpacer: { width: 42 },
  content: { paddingHorizontal: 20, paddingTop: 11, paddingBottom: 18 },
  heading: { color: colors.ink, fontSize: 24, lineHeight: 31, fontWeight: '800' },
  intro: { color: colors.muted, fontSize: 13, marginTop: 4 },
  photoSection: { alignItems: 'center', paddingTop: 20, paddingBottom: 15 },
  avatarFrame: { position: 'relative' },
  cameraBadge: { position: 'absolute', right: -2, bottom: 2, width: 29, height: 29, borderRadius: 15, backgroundColor: colors.primary, borderColor: colors.background, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  cameraGlyph: { color: colors.white, fontSize: 17, lineHeight: 19, fontWeight: '700' },
  photoLabel: { color: colors.ink, fontSize: 13, fontWeight: '700', marginTop: 9, marginBottom: 9 },
  segment: { width: '100%', maxWidth: 360, height: 44, padding: 4, borderRadius: 13, backgroundColor: '#E8EDF5', flexDirection: 'row' },
  segmentItem: { flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: colors.white, shadowColor: '#0F172A', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  segmentText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  segmentTextActive: { color: colors.primary, fontWeight: '700' },
  photoButton: { marginTop: 10, minWidth: 150 },
  urlInput: { alignSelf: 'stretch', marginTop: 10, minHeight: 47, borderRadius: 12, backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, paddingHorizontal: 13, color: colors.ink, fontSize: 13 },
  formCard: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 15, paddingTop: 16, paddingBottom: 1 },
  field: { marginBottom: 15 },
  lastField: { marginBottom: 14 },
  fieldLabel: { color: '#475569', fontSize: 12, fontWeight: '600', marginBottom: 7 },
  input: { minHeight: 49, borderRadius: 12, backgroundColor: '#FBFCFE', borderColor: colors.border, borderWidth: 1, paddingHorizontal: 13, color: colors.ink, fontSize: 14 },
  mono: { fontFamily: 'monospace', letterSpacing: 0.3 },
  inputError: { borderColor: colors.danger, backgroundColor: '#FFFAFA' },
  helperError: { color: colors.danger, fontSize: 11, marginTop: 5, alignSelf: 'flex-start' },
  actions: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14, backgroundColor: colors.background },
  cancelButton: { flex: 0.8 },
  saveButton: { flex: 1.3 },
});
