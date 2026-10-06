import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Student } from '../types';

const STUDENTS_KEY = '@student-manager/students';
type NewStudent = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;
type StudentValue = {
  students: Student[];
  ready: boolean;
  addStudent: (student: NewStudent) => Promise<Student>;
  updateStudent: (id: string, changes: NewStudent) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  getStudent: (id: string) => Student | undefined;
};

const StudentContext = createContext<StudentValue | null>(null);
const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function StudentProvider({ children }: React.PropsWithChildren) {
  const [students, setStudents] = useState<Student[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STUDENTS_KEY)
      .then((stored) => {
        if (!stored) return;
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setStudents(parsed as Student[]);
      })
      .catch(() => setStudents([]))
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback(async (nextStudents: Student[]) => {
    await AsyncStorage.setItem(STUDENTS_KEY, JSON.stringify(nextStudents));
    setStudents(nextStudents);
  }, []);

  const addStudent = useCallback(async (input: NewStudent) => {
    const now = new Date().toISOString();
    const student: Student = { ...input, id: makeId(), createdAt: now, updatedAt: now };
    await persist([student, ...students]);
    return student;
  }, [persist, students]);

  const updateStudent = useCallback(async (id: string, changes: NewStudent) => {
    const nextStudents = students.map((student) => student.id === id
      ? { ...student, ...changes, updatedAt: new Date().toISOString() }
      : student);
    await persist(nextStudents);
  }, [persist, students]);

  const deleteStudent = useCallback(async (id: string) => {
    await persist(students.filter((student) => student.id !== id));
  }, [persist, students]);

  const getStudent = useCallback((id: string) => students.find((student) => student.id === id), [students]);
  const value = useMemo(() => ({ students, ready, addStudent, updateStudent, deleteStudent, getStudent }),
    [students, ready, addStudent, updateStudent, deleteStudent, getStudent]);

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudents() {
  const value = useContext(StudentContext);
  if (!value) throw new Error('useStudents must be used inside StudentProvider.');
  return value;
}
