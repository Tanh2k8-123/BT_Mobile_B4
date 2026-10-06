# Test Results

Date: 2026-10-06

## Automated checks

- `npx tsc --noEmit` — passed.
- `npx expo export --platform web` — passed.
- `npm run test:data` — passed; five sample records satisfy the required data shape, student IDs are unique, avatar URLs are present, and English/Vietnamese define the same 52 translation keys.

## Android manual flow

Run in Expo Go on the Pixel 6 emulator:

- Empty form submission showed required-field errors for full name, student ID, email, and avatar.
- Added a student using an image URL and verified the details page showed the saved fields.
- Edit confirmation: **No** kept the record unchanged; **Yes, save** updated the email and displayed the new value.
- Delete confirmation: **No** kept the record; **Yes, delete** removed it and returned the list count to zero.

## Not verified in this run

- Device photo picker permission and upload flow.
- Changing language in Settings on a live screen. Translation-key parity is covered by `npm run test:data`.
- Persistence after force-closing and reopening Expo Go.
- A browser-rendered screenshot. The web export passed and the Expo server is running at `http://localhost:8082`, but Codex blocked opening localhost in its browser preview.
