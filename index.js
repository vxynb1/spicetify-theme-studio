// Custom App Page Entry Point
function render() {
    const React = Spicetify.React;
    if (!React) {
        return null;
    }

    const { useState } = React;
    const el = React.createElement;

    const SECTIONS = [
        { id: "colors", label: "🎨 Colors & Gradients" },
        { id: "background", label: "🖼️ Backgrounds & Media" },
        { id: "cursor", label: "✨ Mouse Trails" },
        { id: "clicks", label: "💥 Click & Press FX" },
        { id: "ambient", label: "🌌 Ambient & Visual FX" },
        { id: "layout", label: "🛠️ Layout, Fonts & CSS" }
    ];

    function ThemeStudioApp() {
        const [cfg, setCfg] = useState(() =>
            window.getThemeStudioConfig ? window.getThemeStudioConfig() : {
                name: "Cyber Neon Studio",
                bgColor: "#0f0f13",
                sidebarColor: "#09090c",
                cardColor: "#181820",
                playerColor: "#121218",
                textColor: "#ffffff",
                subTextColor: "#a0a0b5",
                accentColor: "#1db954",
                useGradientBg: false,
                gradColor1: "#1a0b2e",
                gradColor2: "#09192f",
                gradAngle: "135",
                gradAnimate: true,
                bgImage: "",
                bgBlur: "8",
                bgOpacity: "0.75",
                bgBrightness: "100",
                bgSaturation: "110",
                bgKenBurns: false,
                trailType: "sparkles",
                trailColor: "#1db954",
                trailRainbow: true,
                trailSize: "6",
                trailEmoji: "✨",
                clickEffect: "ripple",
                clickColor: "#1db954",
                buttonSquish: true,
                cardHoverLift: true,
                ambientParticles: "fireflies",
                crtScanlines: false,
                vignette: false,
                spinAlbumArt: false,
                pulsePlayBtn: true,
                fontFamily: "",
                borderRadius: "10",
                customCSS: ""
            }
        );

        const [activeTab, setActiveTab] = useState("colors");
        const [presets, setPresets] = useState(() => {
            try {
                return JSON.parse(localStorage.getItem("ts_saved_presets") || "{}");
            } catch (e) {
                return {};
            }
        });

        const update = (key, value) => {
            const next = { ...cfg, [key]: value };
            setCfg(next);
            if (window.applyThemeStudioConfig) {
                window.applyThemeStudioConfig(next);
            }
        };

        const savePreset = () => {
            const presetName = (cfg.name || "Untitled Theme").trim();
            const updatedPresets = { ...presets, [presetName]: cfg };
            setPresets(updatedPresets);
            localStorage.setItem("ts_saved_presets", JSON.stringify(updatedPresets));
            if (Spicetify.showNotification) {
                Spicetify.showNotification(`Saved preset "${presetName}"!`);
            }
        };

        const loadPreset = (presetObj) => {
            setCfg(presetObj);
            if (window.applyThemeStudioConfig) {
                window.applyThemeStudioConfig(presetObj);
            }
            if (Spicetify.showNotification) {
                Spicetify.showNotification(`Loaded "${presetObj.name}"`);
            }
        };

        const deletePreset = (name) => {
            const copy = { ...presets };
            delete copy[name];
            setPresets(copy);
            localStorage.setItem("ts_saved_presets", JSON.stringify(copy));
        };

        const resetDefault = () => {
            const def = window.ThemeStudioDefault || cfg;
            setCfg(def);
            if (window.applyThemeStudioConfig) {
                window.applyThemeStudioConfig(def);
            }
            if (Spicetify.showNotification) {
                Spicetify.showNotification("Reset to default studio preset");
            }
        };

        const handleImageUpload = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => update("bgImage", ev.target.result);
            reader.readAsDataURL(file);
        };

        const exportJSON = () => {
            const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${(cfg.name || "theme").toLowerCase().replace(/\s+/g, "-")}.json`;
            a.click();
        };

        const importJSON = () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const parsed = JSON.parse(ev.target.result);
                        loadPreset(parsed);
                    } catch (err) {
                        if (Spicetify.showNotification) {
                            Spicetify.showNotification("Invalid theme JSON!", true);
                        }
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        };

        const ColorPicker = (label, key) =>
            el("div", { key, style: { display: "flex", flexDirection: "column", gap: "6px", background: "rgba(255,255,255,0.04)", padding: "12px", borderRadius: "8px" } },
                el("span", { style: { fontSize: "13px", fontWeight: "600" } }, label),
                el("div", { style: { display: "flex", alignItems: "center", gap: "10px" } },
                    el("input", {
                        type: "color",
                        value: cfg[key] || "#ffffff",
                        onChange: (e) => update(key, e.target.value),
                        style: { width: "44px", height: "34px", border: "none", background: "none", cursor: "pointer" }
                    }),
                    el("input", {
                        type: "text",
                        value: cfg[key] || "",
                        onChange: (e) => update(key, e.target.value),
                        style: { flex: 1, padding: "6px 10px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }
                    })
                )
            );

        const Toggle = (label, desc, key) =>
            el("label", { key, style: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.04)", padding: "12px 16px", borderRadius: "8px", cursor: "pointer" } },
                el("div", null,
                    el("div", { style: { fontWeight: "600", fontSize: "14px" } }, label),
                    desc ? el("div", { style: { fontSize: "12px", opacity: 0.7 } }, desc) : null
                ),
                el("input", {
                    type: "checkbox",
                    checked: !!cfg[key],
                    onChange: (e) => update(key, e.target.checked),
                    style: { width: "20px", height: "20px", accentColor: cfg.accentColor, cursor: "pointer" }
                })
            );

        const Slider = (label, key, min, max, step, unit) =>
            el("div", { key, style: { display: "flex", flexDirection: "column", gap: "6px", background: "rgba(255,255,255,0.04)", padding: "12px 16px", borderRadius: "8px" } },
                el("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600" } },
                    el("span", null, label),
                    el("span", { style: { color: cfg.accentColor } }, `${cfg[key]}${unit}`)
                ),
                el("input", {
                    type: "range",
                    min,
                    max,
                    step,
                    value: cfg[key],
                    onChange: (e) => update(key, e.target.value),
                    style: { width: "100%", accentColor: cfg.accentColor, cursor: "pointer" }
                })
            );

        const SelectBox = (label, key, options) =>
            el("div", { key, style: { display: "flex", flexDirection: "column", gap: "6px", background: "rgba(255,255,255,0.04)", padding: "12px 16px", borderRadius: "8px" } },
                el("span", { style: { fontSize: "13px", fontWeight: "600" } }, label),
                el("select", {
                    value: cfg[key],
                    onChange: (e) => update(key, e.target.value),
                    style: { padding: "8px 12px", background: "#181818", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px" }
                }, options.map((opt) => el("option", { key: opt.val, value: opt.val }, opt.label)))
            );

        return el("div", { style: { padding: "28px 36px", maxWidth: "1200px", margin: "0 auto", color: "var(--spice-text, #fff)", overflowY: "auto", height: "100%" } },
            // Header Bar
            el("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px" } },
                el("div", null,
                    el("h1", { style: { fontSize: "28px", fontWeight: "800", margin: "0 0 4px 0" } }, "🖌️ Theme Studio"),
                    el("p", { style: { margin: 0, opacity: 0.7, fontSize: "14px" } }, "Customize colors, animated backgrounds, cursor trails, click explosions, and layout physics.")
                ),
                el("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" } },
                    el("input", {
                        type: "text",
                        value: cfg.name || "",
                        placeholder: "Preset Name...",
                        onChange: (e) => update("name", e.target.value),
                        style: { padding: "10px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontWeight: "600" }
                    }),
                    el("button", {
                        onClick: savePreset,
                        style: { padding: "10px 18px", background: cfg.accentColor, color: "#000", border: "none", fontWeight: "700", cursor: "pointer" }
                    }, "💾 Save Preset"),
                    el("button", {
                        onClick: exportJSON,
                        style: { padding: "10px 14px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", fontWeight: "600", cursor: "pointer" }
                    }, "Export JSON"),
                    el("button", {
                        onClick: importJSON,
                        style: { padding: "10px 14px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", fontWeight: "600", cursor: "pointer" }
                    }, "Import JSON"),
                    el("button", {
                        onClick: resetDefault,
                        style: { padding: "10px 14px", background: "rgba(255,80,80,0.2)", color: "#ff6b6b", border: "none", fontWeight: "600", cursor: "pointer" }
                    }, "Reset")
                )
            ),

            // Section Navigation Tabs
            el("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" } },
                SECTIONS.map((sec) =>
                    el("button", {
                        key: sec.id,
                        onClick: () => setActiveTab(sec.id),
                        style: {
                            padding: "10px 16px",
                            background: activeTab === sec.id ? cfg.accentColor : "rgba(255,255,255,0.06)",
                            color: activeTab === sec.id ? "#000" : "#fff",
                            border: "none",
                            fontWeight: "700",
                            cursor: "pointer"
                        }
                    }, sec.label)
                )
            ),

            // Active Tab Content Grid
            el("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "32px" } },
                activeTab === "colors" ? [
                    ColorPicker("Accent & Highlights", "accentColor"),
                    ColorPicker("Main Background", "bgColor"),
                    ColorPicker("Sidebar Background", "sidebarColor"),
                    ColorPicker("Cards & Containers", "cardColor"),
                    ColorPicker("Now Playing Bar", "playerColor"),
                    ColorPicker("Primary Text", "textColor"),
                    ColorPicker("Secondary / Subtext", "subTextColor"),
                    Toggle("Animated Gradient Wallpaper", "Replaces flat background with a shifting multi-color gradient", "useGradientBg"),
                    ColorPicker("Gradient Start Color", "gradColor1"),
                    ColorPicker("Gradient End Color", "gradColor2"),
                    Slider("Gradient Angle", "gradAngle", 0, 360, 5, "°"),
                    Toggle("Animate Gradient Flow", "Smoothly waves the gradient colors continuously", "gradAnimate")
                ] : null,

                activeTab === "background" ? [
                    el("div", { key: "bg-upload", style: { gridColumn: "1 / -1", background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" } },
                        el("span", { style: { fontWeight: "700" } }, "Background Image or Animated GIF (URL or Local File)"),
                        el("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap" } },
                            el("input", {
                                type: "text",
                                placeholder: "Paste image or GIF URL here...",
                                value: cfg.bgImage || "",
                                onChange: (e) => update("bgImage", e.target.value),
                                style: { flex: 1, minWidth: "240px", padding: "10px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }
                            }),
                            el("label", { style: { padding: "10px 16px", background: cfg.accentColor, color: "#000", fontWeight: "700", borderRadius: "6px", cursor: "pointer" } },
                                "📁 Upload Image/GIF",
                                el("input", { type: "file", accept: "image/*", onChange: handleImageUpload, style: { display: "none" } })
                            ),
                            cfg.bgImage ? el("button", {
                                onClick: () => update("bgImage", ""),
                                style: { padding: "10px 14px", background: "rgba(255,80,80,0.25)", color: "#ff6b6b", border: "none", fontWeight: "600", cursor: "pointer" }
                            }, "Clear Image") : null
                        )
                    ),
                    Slider("UI Glass Transparency", "bgOpacity", 0.1, 1.0, 0.05, ""),
                    Slider("Wallpaper Blur", "bgBlur", 0, 30, 1, "px"),
                    Slider("Wallpaper Brightness", "bgBrightness", 20, 180, 5, "%"),
                    Slider("Wallpaper Saturation", "bgSaturation", 0, 200, 5, "%"),
                    Toggle("Ken Burns Slow Zoom", "Cinematic slow zoom and pan motion on your wallpaper", "bgKenBurns")
                ] : null,

                activeTab === "cursor" ? [
                    SelectBox("Mouse Trail Style", "trailType", [
                        { val: "none", label: "Disabled" },
                        { val: "sparkles", label: "✨ Glowing Sparkles" },
                        { val: "ribbon", label: "〰️ Smooth Neon Ribbon" },
                        { val: "bubbles", label: "🫧 Floating Bubbles" },
                        { val: "emoji", label: "😎 Custom Emoji Trail" }
                    ]),
                    ColorPicker("Trail Color", "trailColor"),
                    Toggle("Rainbow RGB Cycle", "Automatically shifts trail color through the full spectrum", "trailRainbow"),
                    Slider("Trail Size / Thickness", "trailSize", 2, 20, 1, "px"),
                    el("div", { key: "trail-emoji", style: { display: "flex", flexDirection: "column", gap: "6px", background: "rgba(255,255,255,0.04)", padding: "12px 16px", borderRadius: "8px" } },
                        el("span", { style: { fontSize: "13px", fontWeight: "600" } }, "Custom Trail Emoji (when Emoji mode is selected)"),
                        el("input", {
                            type: "text",
                            value: cfg.trailEmoji || "✨",
                            onChange: (e) => update("trailEmoji", e.target.value),
                            style: { padding: "8px 12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "18px" }
                        })
                    )
                ] : null,

                activeTab === "clicks" ? [
                    SelectBox("Mouse Click Explosion", "clickEffect", [
                        { val: "none", label: "Disabled" },
                        { val: "ripple", label: "🌊 Shockwave Ripple" },
                        { val: "confetti", label: "🎉 Rainbow Confetti Burst" },
                        { val: "hearts", label: "💖 Floating Hearts Burst" },
                        { val: "sparks", label: "⚡ Energy Sparks" }
                    ]),
                    ColorPicker("Click Effect Color", "clickColor"),
                    Toggle("Tactile Button Squish", "Buttons bounce and squish physically when clicked", "buttonSquish"),
                    Toggle("3D Card Hover Lift", "Album & playlist cards float upward when hovered", "cardHoverLift")
                ] : null,

                activeTab === "ambient" ? [
                    SelectBox("Ambient Screen Particles", "ambientParticles", [
                        { val: "none", label: "None" },
                        { val: "fireflies", label: "🪲 Glowing Fireflies (Accent Colored)" },
                        { val: "snow", label: "❄️ Gentle Falling Snow" },
                        { val: "embers", label: "🔥 Rising Fire Embers" },
                        { val: "matrix", label: "💻 Digital Matrix Rain" }
                    ]),
                    Toggle("Pulsing Play Button Aura", "Adds a breathing neon glow around the main Play button", "pulsePlayBtn"),
                    Toggle("Spinning Vinyl Album Art", "Turns the Now Playing cover into a rotating vinyl record", "spinAlbumArt"),
                    Toggle("Retro CRT Scanlines", "Adds subtle horizontal monitor scanlines across the screen", "crtScanlines"),
                    Toggle("Cinematic Edge Vignette", "Darkens the outer edges of Spotify for deep focus", "vignette")
                ] : null,

                activeTab === "layout" ? [
                    el("div", { key: "font-input", style: { display: "flex", flexDirection: "column", gap: "6px", background: "rgba(255,255,255,0.04)", padding: "12px 16px", borderRadius: "8px" } },
                        el("span", { style: { fontSize: "13px", fontWeight: "600" } }, "Google Font Name (e.g. Poppins, Orbitron, JetBrains Mono)"),
                        el("input", {
                            type: "text",
                            placeholder: "Leave blank for default Spotify font",
                            value: cfg.fontFamily || "",
                            onChange: (e) => update("fontFamily", e.target.value),
                            style: { padding: "8px 12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }
                        })
                    ),
                    Slider("Corner Roundness (Border Radius)", "borderRadius", 0, 32, 1, "px"),
                    el("div", { key: "raw-css", style: { gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "6px", background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "8px" } },
                        el("span", { style: { fontSize: "14px", fontWeight: "700" } }, "Raw Custom CSS (Override any element to the last bit)"),
                        el("textarea", {
                            rows: 6,
                            placeholder: "/* Example: .main-navBar-navBar { border-right: 2px solid #1db954; } */",
                            value: cfg.customCSS || "",
                            onChange: (e) => update("customCSS", e.target.value),
                            style: { width: "100%", padding: "12px", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", color: "#00ff9d", fontFamily: "monospace", fontSize: "13px" }
                        })
                    )
                ] : null
            ),

            // Saved Presets Drawer
            el("div", { style: { background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" } },
                el("h3", { style: { margin: "0 0 12px 0", fontSize: "16px" } }, "📂 Saved Theme Presets"),
                Object.keys(presets).length === 0
                    ? el("p", { style: { margin: 0, opacity: 0.6, fontSize: "13px" } }, "No saved presets yet. Customize your setup above and click 'Save Preset'!")
                    : el("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap" } },
                        Object.keys(presets).map((presetName) =>
                            el("div", {
                                key: presetName,
                                style: { display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.08)", padding: "8px 14px", borderRadius: "8px" }
                            },
                                el("span", {
                                    onClick: () => loadPreset(presets[presetName]),
                                    style: { cursor: "pointer", fontWeight: "600", color: presets[presetName].accentColor || "#1db954" }
                                }, presetName),
                                el("button", {
                                    onClick: () => deletePreset(presetName),
                                    style: { background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }
                                }, "×")
                            )
                        )
                    )
            )
        );
    }

    return el(ThemeStudioApp);
}
