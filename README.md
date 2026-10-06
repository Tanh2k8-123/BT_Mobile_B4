# BT_Mobile_B4

## Student Manager — Mobile Assignment

A three-screen React Native application for managing student records locally.

## Features

- Student list with search by name, student ID, or email.
- Student details with profile photo, full name, student ID, and email.
- One shared form for adding and editing records.
- Edit and delete actions require explicit confirmation.
- Profile photos can be selected from the device or provided as an image URL.
- Student records and the selected language are saved with AsyncStorage.
- English and Vietnamese are available in **Settings**. The first launch follows the device language; a later selection is saved on this device.
- The roster starts empty so the sample data can be added when it is provided.

## Screens

The app has exactly three navigation screens: **Students**, **Student details**, and **Add/Edit student**. Settings and confirmation prompts are modal overlays and do not add navigation screens.

## Run locally

```powershell
npm install
npx expo start
```

For Android, run `npx expo start --android`. The app can also run in a browser with `npx expo start --web`.

## Local data

AsyncStorage stores a JSON array under `@student-manager/students`. Each student contains an internal ID, full name, student ID, email, avatar URI and source, and created/updated timestamps. Device-selected photos are copied into the app document directory; URL avatars retain their URL.

The language preference is stored under `@student-manager/language`. Removing this preference makes the app use the device language again on the next launch.

## Prototype reference

The Stitch project and screen IDs are recorded in [PROTOTYPE_STITCH.md](./PROTOTYPE_STITCH.md).
