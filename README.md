# 🖌️ Spicetify Theme Studio

A full-page custom tab for Spicetify that lets you customize every detail of Spotify: colors, animated gradient wallpapers, local/GIF backgrounds, mouse trails, click explosions, ambient particles, fonts, and raw CSS—with built-in preset saving.

![Preview](preview.png)

## Manual Installation

1. Download or clone this repository (`index.js`, `engine.js`, and `manifest.json`).
2. Open your Spicetify `CustomApps` folder:
   - **Windows:** Press `Win + R`, type `%appdata%\spicetify\CustomApps`, and press Enter.
   - **Mac / Linux:** `~/.config/spicetify/CustomApps/`
3. Create a folder named `theme-studio` inside `CustomApps` and place `index.js`, `engine.js`, and `manifest.json` inside it.
4. Run these commands in your terminal:
   ```bash
   spicetify config custom_apps theme-studio
   spicetify apply
