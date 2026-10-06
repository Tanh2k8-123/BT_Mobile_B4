export type Language = 'en' | 'vi';

export type AvatarSource = 'device' | 'url';

export type Student = {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  avatarUri: string;
  avatarSource: AvatarSource;
  createdAt: string;
  updatedAt: string;
};

export type RootStackParamList = {
  StudentList: undefined;
  StudentDetail: { studentId: string };
  StudentForm: { studentId?: string };
};

export type TranslationKey =
  | 'appName' | 'listTitle' | 'listSubtitle' | 'student' | 'studentCount' | 'searchPlaceholder'
  | 'addStudent' | 'emptyTitle' | 'emptyMessage' | 'noResults' | 'localStorage'
  | 'studentDetails' | 'editStudent' | 'deleteStudent' | 'fullName' | 'studentId'
  | 'email' | 'avatar' | 'devicePhoto' | 'changePhoto' | 'uploadPhoto' | 'imageUrl'
  | 'imageUrlPlaceholder' | 'formTitleAdd' | 'formTitleEdit' | 'saveStudent' | 'saveChanges'
  | 'cancel' | 'settings' | 'language' | 'english' | 'vietnamese'
  | 'confirmEditTitle' | 'confirmEditMessage' | 'confirmDeleteTitle' | 'confirmDeleteMessage'
  | 'yes' | 'yesDelete' | 'no' | 'requiredField' | 'invalidEmail' | 'duplicateStudentId'
  | 'photoPermission' | 'photoError' | 'invalidImageUrl' | 'clearSearch' | 'languageSaved'
  | 'studentNotFound' | 'saveError' | 'saved' | 'students';
