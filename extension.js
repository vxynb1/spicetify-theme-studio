// NAME: Custom Theme Creator
// AUTHOR: Voxxy
// DESCRIPTION: Ultimate in-app theme creator with images, animations, custom colors, and preset saving.

(function CustomThemeCreator() {
    if (!Spicetify.LocalStorage || !Spicetify.Topbar) {
        setTimeout(CustomThemeCreator, 300);
        return;
    }

    // Default Theme State
    const DEFAULT_THEME = {
        name: "Default Custom",
        bgColor: "#121212",
        cardColor: "#181818",
        textColor: "#ffffff",
        subTextColor: "#b3b3b3",
        accentColor: "#1db954",
        bgImage: "",
        bgBlur: "0px",
        animationSpeed: "0.3s",
        enablePulse: false,
        customCSS: ""
    };

    let currentTheme = { ...DEFAULT_THEME };

    // Inject Style Container for Live Preview
    const styleTag = document.createElement("style");
    styleTag.id = "custom-theme-creator-styles";
    document.head.appendChild(styleTag);

    function applyTheme(theme) {
        currentTheme = { ...theme };
        
        let css = `
            :root {
                --spice-main: ${theme.bgColor} !important;
                --spice-card: ${theme.cardColor} !important;
                --spice-text: ${theme.textColor} !important;
                --spice-subtext: ${theme.subTextColor} !important;
                --spice-button: ${theme.accentColor} !important;
                --spice-button-active: ${theme.accentColor} !important;
                --spice-sidebar: ${theme.bgColor} !important;
                --spice-player: ${theme.cardColor} !important;
            }
            body {
                background-color: ${theme.bgColor} !important;
                ${theme.bgImage ? `background-image: url('${theme.bgImage}') !important; background-size: cover !important; background-position: center !important; background-attachment: fixed !important;` : ''}
                transition: all ${theme.animationSpeed} ease-in-out;
            }
            ${theme.bgImage ? `.Rootpad { backdrop-filter: blur(${theme.bgBlur}); background-color: rgba(0,0,0,0.6) !important; }` : ''}
            ${theme.enablePulse ? `
                @keyframes pulseGlow {
                    0% { filter: drop-shadow(0 0 2px ${theme.accentColor}); }
                    50% { filter: drop-shadow(0 0 10px ${theme.accentColor}); }
                    100% { filter: drop-shadow(0 0 2px ${theme.accentColor}); }
                }
                .main-playButton-button { animation: pulseGlow 2s infinite; }
            ` : ''}
            /* Ultimate Customization CSS Override */
            ${theme.customCSS}
        `;

        styleTag.innerHTML = css;
    }

    // Load saved active theme on startup
    const savedActive = localStorage.getItem("custom_theme_active");
    if (savedActive) {
        try { applyTheme(JSON.parse(savedActive)); } catch (e) {}
    }

    // Create Modal HTML UI
    const modalOverlay = document.createElement("div");
    modalOverlay.style.cssText = `
        display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.7); z-index: 99999; justify-content: center; align-items: center;
        font-family: var(--font-family, sans-serif); color: #fff;
    `;

    modalOverlay.innerHTML = `
        <div style="background: #181818; width: 650px; max-height: 85vh; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.8); border: 1px solid #282828; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 22px; color: #1db954;">🎨 Ultimate Theme Studio</h2>
                <button id="ctc-close" style="background: none; border: none; color: #fff; font-size: 20px; cursor: pointer;">✕</button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px;">
                <div>
                    <label>Theme Name</label>
                    <input type="text" id="ctc-name" style="width: 100%; padding: 8px; background: #222; border: 1px solid #333; color: #fff; border-radius: 4px; margin-top: 4px;">
                </div>
                <div>
                    <label>Accent Color</label>
                    <input type="color" id="ctc-accentColor" style="width: 100%; height: 36px; background: #222; border: none; cursor: pointer; border-radius: 4px; margin-top: 4px;">
                </div>
                <div>
                    <label>Main Background Color</label>
                    <input type="color" id="ctc-bgColor" style="width: 100%; height: 36px; background: #222; border: none; cursor: pointer; border-radius: 4px; margin-top: 4px;">
                </div>
                <div>
                    <label>Card / Player Color</label>
                    <input type="color" id="ctc-cardColor" style="width: 100%; height: 36px; background: #222; border: none; cursor: pointer; border-radius: 4px; margin-top: 4px;">
                </div>
                <div>
                    <label>Text Color</label>
                    <input type="color" id="ctc-textColor" style="width: 100%; height: 36px; background: #222; border: none; cursor: pointer; border-radius: 4px; margin-top: 4px;">
                </div>
                <div>
                    <label>Subtext Color</label>
                    <input type="color" id="ctc-subTextColor" style="width: 100%; height: 36px; background: #222; border: none; cursor: pointer; border-radius: 4px; margin-top: 4px;">
                </div>
                <div style="grid-column: span 2;">
                    <label>Background Image URL (or upload local)</label>
                    <input type="text" id="ctc-bgImage" placeholder="https://example.com/image.jpg" style="width: 100%; padding: 8px; background: #222; border: 1px solid #333; color: #fff; border-radius: 4px; margin-top: 4px;">
                </div>
                <div>
                    <label>Background Blur (Glassmorphism)</label>
                    <input type="text" id="ctc-bgBlur" placeholder="10px" style="width: 100%; padding: 8px; background: #222; border: 1px solid #333; color: #fff; border-radius: 4px; margin-top: 4px;">
                </div>
                <div>
                    <label>Animation Transition Speed</label>
                    <input type="text" id="ctc-animationSpeed" placeholder="0.3s" style="width: 100%; padding: 8px; background: #222; border: 1px solid #333; color: #fff; border-radius: 4px; margin-top: 4px;">
                </div>
                <div style="grid-column: span 2; display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                    <input type="checkbox" id="ctc-enablePulse" style="width: 18px; height: 18px;">
                    <label for="ctc-enablePulse">Enable Pulsing Play Button Animation</label>
                </div>
                <div style="grid-column: span 2;">
                    <label>Custom CSS (To the very last bit)</label>
                    <textarea id="ctc-customCSS" rows="4" placeholder="/* Write raw CSS here */" style="width: 100%; padding: 8px; background: #222; border: 1px solid #333; color: #fff; border-radius: 4px; margin-top: 4px; font-family: monospace;"></textarea>
                </div>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="ctc-save" style="flex: 1; padding: 10px; background: #1db954; color: #000; border: none; font-weight: bold; border-radius: 6px; cursor: pointer;">Save & Apply Preset</button>
                <button id="ctc-export" style="padding: 10px 16px; background: #333; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Export JSON</button>
                <button id="ctc-import" style="padding: 10px 16px; background: #333; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Import JSON</button>
            </div>

            <div style="margin-top: 20px; border-top: 1px solid #282828; padding-top: 15px;">
                <h4 style="margin: 0 0 10px 0; font-size: 14px;">Saved Presets</h4>
                <div id="ctc-presets-list" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Populate form fields from theme object
    function updateFormFields(theme) {
        document.getElementById("ctc-name").value = theme.name || "Custom Theme";
        document.getElementById("ctc-accentColor").value = theme.accentColor || "#1db954";
        document.getElementById("ctc-bgColor").value = theme.bgColor || "#121212";
        document.getElementById("ctc-cardColor").value = theme.cardColor || "#181818";
        document.getElementById("ctc-textColor").value = theme.textColor || "#ffffff";
        document.getElementById("ctc-subTextColor").value = theme.subTextColor || "#b3b3b3";
        document.getElementById("ctc-bgImage").value = theme.bgImage || "";
        document.getElementById("ctc-bgBlur").value = theme.bgBlur || "0px";
        document.getElementById("ctc-animationSpeed").value = theme.animationSpeed || "0.3s";
        document.getElementById("ctc-enablePulse").checked = !!theme.enablePulse;
        document.getElementById("ctc-customCSS").value = theme.customCSS || "";
    }

    // Read form fields into theme object
    function readFormFields() {
        return {
            name: document.getElementById("ctc-name").value,
            accentColor: document.getElementById("ctc-accentColor").value,
            bgColor: document.getElementById("ctc-bgColor").value,
            cardColor: document.getElementById("ctc-cardColor").value,
            textColor: document.getElementById("ctc-textColor").value,
            subTextColor: document.getElementById("ctc-subTextColor").value,
            bgImage: document.getElementById("ctc-bgImage").value,
            bgBlur: document.getElementById("ctc-bgBlur").value,
            animationSpeed: document.getElementById("ctc-animationSpeed").value,
            enablePulse: document.getElementById("ctc-enablePulse").checked,
            customCSS: document.getElementById("ctc-customCSS").value
        };
    }

    // Render Saved Presets buttons
    function renderPresets() {
        const container = document.getElementById("ctc-presets-list");
        container.innerHTML = "";
        let presets = {};
        try { presets = JSON.parse(localStorage.getItem("custom_theme_presets") || "{}"); } catch(e){}

        if (Object.keys(presets).length === 0) {
            container.innerHTML = '<span style="color: #777; font-size: 13px;">No saved presets yet. Save your current configuration!</span>';
            return;
        }

        for (let name in presets) {
            const btn = document.createElement("div");
            btn.style.cssText = "background: #222; padding: 6px 12px; border-radius: 4px; display: flex; align-items: center; gap: 8px; font-size: 13px; border: 1px solid #333;";
            btn.innerHTML = `
                <span style="cursor: pointer; color: #1db954;" title="Load">${name}</span>
                <span style="cursor: pointer; color: #ff5555; font-weight: bold;" title="Delete">×</span>
            `;
            
            btn.querySelector("span").onclick = () => {
                applyTheme(presets[name]);
                updateFormFields(presets[name]);
                localStorage.setItem("custom_theme_active", JSON.stringify(presets[name]));
            };

            btn.querySelector("span:last-child").onclick = (e) => {
                e.stopPropagation();
                delete presets[name];
                localStorage.setItem("custom_theme_presets", JSON.stringify(presets));
                renderPresets();
            };

            container.appendChild(btn);
        }
    }

    // Event Handlers
    document.getElementById("ctc-close").onclick = () => modalOverlay.style.display = "none";
    
    // Live update on input change
    modalOverlay.querySelectorAll("input, textarea").forEach(el => {
        el.oninput = () => {
            const t = readFormFields();
            applyTheme(t);
        };
    });

    document.getElementById("ctc-save").onclick = () => {
        const t = readFormFields();
        applyTheme(t);
        localStorage.setItem("custom_theme_active", JSON.stringify(t));
        
        let presets = {};
        try { presets = JSON.parse(localStorage.getItem("custom_theme_presets") || "{}"); } catch(e){}
        presets[t.name] = t;
        localStorage.setItem("custom_theme_presets", JSON.stringify(presets));
        renderPresets();
        Spicetify.ShowNotification(`Theme "${t.name}" saved successfully!`);
    };

    // Export JSON
    document.getElementById("ctc-export").onclick = () => {
        const t = readFormFields();
        const blob = new Blob([JSON.stringify(t, null, 2)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${t.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
        a.click();
    };

    // Import JSON
    document.getElementById("ctc-import").onclick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const imported = JSON.parse(event.target.result);
                    applyTheme(imported);
                    updateFormFields(imported);
                    Spicetify.ShowNotification("Theme imported successfully!");
                } catch(err) {
                    Spicetify.ShowNotification("Invalid theme JSON file!", true);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    // Toggle Modal Button in Topbar
    new Spicetify.Topbar.Button(
        "Theme Studio",
        "brush",
        () => {
            updateFormFields(currentTheme);
            renderPresets();
            modalOverlay.style.display = "flex";
        }
    );

    console.log("Custom Theme Creator Extension Loaded!");
})();