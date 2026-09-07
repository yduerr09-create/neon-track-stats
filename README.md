# Motorsport Hub

Erweitere die Simracing-Liga-Website zu einer vollumfänglichen, mehrseitigen Web-App im dunklen Motorsport-Design (schwarzer Hintergrund, neongrüne und graue Akzente). 



Verbinde dich mit meinem Supabase-Projekt:

- Project URL: [https://lzclpkpllxvnfasmctwn.supabase.co/rest/v1/]

- Anon Key: [eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Y2xwa3BsbHh2bmZhc21jdHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MjY3MDYsImV4cCI6MjEwNDMwMjcwNn0.o3zsEfaELHe-AWVMfIWrGIdX3Tzby__x8WVVTeZxd6c]



Erstelle eine klare Navigationsleiste für folgende Seiten:



1. Fahrer-Gesamtwertung (/drivers):

   - Tabelle mit: Position, Fahrername, Team, Punkte, Abstand zum Führenden (Gap to Leader), Abstand zum Vordermann (Interval), Elo/Skill Rating, Safety Rating (SR).



2. Team-Gesamtwertung (/teams):

   - Tabelle mit: Position, Teamname, Punkte, Gesamtabstand nach vorne, Abstand zum Team davor, Siege, Podien.



3. Fahrer-Profil (/driver/:id):

   - Wählbares Detail-Profil für jeden Fahrer.

   - Lifetime-Stats: Gesamtpunkte über Lebenszeit, Career-Wins, Podien, Top-5/10, gefahrene Rennen.

   - Performance-Rating: LFM/SimGrid-System mit Elo (Skill Rating) und Safety Rating (SR z. B. 1.00 - 9.99).

   - Historie: Bisherige Rennergebnisse der Saison (R1 bis R16) mit Position, Punkten und Startplatz.



4. Team-Profil (/team/:id):

   - Team-Header mit Fahrerkader.

   - Gesamtpunkte, Team-Position und detaillierte Rennergebnisse pro Rennwochenende.



5. Rennkalender & Event-Infos (/calendar):

   - Übersicht aller 16 Rennwochenenden.

   - Details pro Event: Streckenname, Datum, Zeitplan (Freies Training, Quali, Rennen), Conditions (Luft-/Streckentemperatur, Regenwahrscheinlichkeit, Zeitmultiplikator).



6. Admin-Bereich (/admin):

   - Formular zum Eintragen/Bearbeiten von Rennergebnissen (Fahrer, Team, Position, Punkte,

 Vorfälle für Safety Rating).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://neon-track-stats.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6669015f-59dc-4949-bfdb-3e9f1e0eb50f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
