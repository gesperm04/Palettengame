# Palettenchef

Browserbasiertes 3D-Logistik-Aufbauspiel: Du startest als Ein-Mann-Betrieb in einer kleinen Garage und baust dein Logistikunternehmen aktiv Auftrag für Auftrag aus. Kein Idle-Game – jeder Fortschritt entsteht durch aktives Spielen.

## Phase 1 (MVP)

- 3D-Garagenszene mit Wareneingangszone und Bodenstellplätzen
- 3rd-Person-Charaktersteuerung (virtueller Touch-Joystick + Wischgeste für die Kamera)
- Handgabelhubwagen-Mechanik: heranfahren, pumpen/heben, tragen, absenken
- Auftragstyp Einlagerung mit Auftragsboard
- Basis-Wirtschaft: Startkapital, Miete pro Spieltag, Bezahlung pro Auftrag
- Tag-/Schicht-System mit Tagesabrechnung (kein Echtzeit-Idle)
- Speicherstand über IndexedDB (Dexie)

## Tech-Stack

React + TypeScript, React Three Fiber / drei, @react-three/rapier (Physik), Zustand, Tailwind CSS, Vite, vite-plugin-pwa, Dexie.js, nipplejs.

## Entwicklung

```bash
npm install
npm run dev      # Dev-Server
npm run build    # Typecheck + Produktionsbuild
npm run lint      # Oxlint
```

Am besten auf einem Smartphone/Tablet oder im responsiven Dev-Modus eines Browsers testen – die Steuerung ist Mobile-first (Touch-Joystick unten links, Kamera-Wischgeste rechts, Aktions-Button unten rechts).
