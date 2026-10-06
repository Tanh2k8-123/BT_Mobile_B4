import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const students = JSON.parse(readFileSync(resolve(projectRoot, 'data/students.sample.json'), 'utf8'));
const require = createRequire(import.meta.url);
const ts = require('typescript');
const translationSource = readFileSync(resolve(projectRoot, 'src/localization/translations.ts'), 'utf8');
const compiled = ts.transpileModule(translationSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const translationModule = { exports: {} };
new Function('exports', 'require', 'module', compiled)(translationModule.exports, require, translationModule);
const translations = translationModule.exports.translations;

assert.equal(students.length, 5, 'The demo dataset must contain five students.');
assert.equal(new Set(students.map(({ studentId }) => studentId)).size, students.length, 'Student IDs must be unique.');
for (const student of students) {
  assert.ok(student.fullName.trim(), 'Every sample needs a full name.');
  assert.ok(student.studentId.trim(), 'Every sample needs a student ID.');
  assert.match(student.email, /^[^\s@]+@student\.example$/, 'Use reserved example email addresses.');
  assert.match(student.avatarUri, /^https:\/\//, 'Every sample needs an image URL.');
  assert.equal(student.avatarSource, 'url');
}

assert.deepEqual(
  Object.keys(translations.en).sort(),
  Object.keys(translations.vi).sort(),
  'English and Vietnamese must define the same translation keys.',
);

console.log(`PASS: ${students.length} sample students and ${Object.keys(translations.en).length} bilingual UI labels validated.`);
