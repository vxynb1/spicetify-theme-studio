// Global Theme Studio Engine (Runs on Spotify Startup)
(function ThemeStudioEngine() {
    if (!window.localStorage) {
        setTimeout(ThemeStudioEngine, 200);
        return;
    }

    const DEFAULT_CONFIG = {
        name: "Cyber Neon Studio",
        // Colors
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
        // Background Media
        bgImage: "",
        bgBlur: "8",
        bgOpacity: "0.75",
        bgBrightness: "100",
        bgSaturation: "110",
        bgKenBurns: false,
        // Mouse Trail
        trailType: "sparkles", // none, sparkles, ribbon, bubbles, stars, emoji
        trailColor: "#1db954",
        trailRainbow: true,
        trailSize: "6",
        trailEmoji: "✨",
        // Click & Press Effects
        clickEffect: "ripple", // none, ripple, confetti, hearts, sparks
        clickColor: "#1db954",
        buttonSquish: true,
        cardHoverLift: true,
        // Ambient &FX
        ambientParticles: "fireflies", // none, fireflies, snow, embers, matrix
        crtScanlines: false,
        vignette: false,
        spinAlbumArt: false,
        pulsePlayBtn: true,
        // Layout & Typography
        fontFamily: "",
        borderRadius: "10",
        customCSS: ""
    };

    window.ThemeStudioDefault = DEFAULT_CONFIG;

    window.getThemeStudioConfig = function () {
        try {
            const saved = JSON.parse(localStorage.getItem("ts_active_config"));
            return saved ? { ...DEFAULT_CONFIG, ...saved } : { ...DEFAULT_CONFIG };
        } catch (e) {
            return { ...DEFAULT_CONFIG };
        }
    };

    // Create Style Tag
    let styleEl = document.getElementById("ts-global-styles");
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "ts-global-styles";
        document.head.appendChild(styleEl);
    }

    // Create Fullscreen FX Canvas (Pointer-events: none so it never blocks clicks)
    let canvas = document.getElementById("ts-fx-canvas");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "ts-fx-canvas";
        canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999999;";
        document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create Overlay Div for Scanlines / Vignette / Wallpaper
    let bgLayer = document.getElementById("ts-bg-layer");
    if (!bgLayer) {
        bgLayer = document.createElement("div");
        bgLayer.id = "ts-bg-layer";
        bgLayer.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:-1;background-size:cover;background-position:center;";
        document.body.prepend(bgLayer);
    }

    let fxOverlay = document.getElementById("ts-fx-overlay");
    if (!fxOverlay) {
        fxOverlay = document.createElement("div");
        fxOverlay.id = "ts-fx-overlay";
        fxOverlay.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999998;";
        document.body.appendChild(fxOverlay);
    }

    let activeCfg = window.getThemeStudioConfig();

    window.applyThemeStudioConfig = function (cfg) {
        activeCfg = { ...DEFAULT_CONFIG, ...cfg };
        localStorage.setItem("ts_active_config", JSON.stringify(activeCfg));

        // Background Layer
        if (activeCfg.bgImage) {
            bgLayer.style.backgroundImage = `url("${activeCfg.bgImage}")`;
            bgLayer.style.filter = `blur(${activeCfg.bgBlur}px) brightness(${activeCfg.bgBrightness}%) saturate(${activeCfg.bgSaturation}%)`;
            bgLayer.style.animation = activeCfg.bgKenBurns ? "tsKenBurns 25s ease-in-out infinite alternate" : "none";
        } else if (activeCfg.useGradientBg) {
            bgLayer.style.backgroundImage = `linear-gradient(${activeCfg.gradAngle}deg, ${activeCfg.gradColor1}, ${activeCfg.gradColor2}, ${activeCfg.bgColor})`;
            bgLayer.style.backgroundSize = activeCfg.gradAnimate ? "300% 300%" : "100% 100%";
            bgLayer.style.filter = "none";
            bgLayer.style.animation = activeCfg.gradAnimate ? "tsGradientShift 12s ease infinite" : "none";
        } else {
            bgLayer.style.backgroundImage = "none";
            bgLayer.style.backgroundColor = activeCfg.bgColor;
            bgLayer.style.animation = "none";
        }

        // FX Overlays (CRT Scanlines & Vignette)
        let shadows = activeCfg.vignette ? "inset 0 0 120px rgba(0,0,0,0.85)" : "none";
        let scanlineBg = activeCfg.crtScanlines
            ? "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)"
            : "none";
        fxOverlay.style.boxShadow = shadows;
        fxOverlay.style.backgroundImage = scanlineBg;

        const hasBgMedia = Boolean(activeCfg.bgImage || activeCfg.useGradientBg);
        const mainAlpha = hasBgMedia ? activeCfg.bgOpacity : "1";

        // Google Font Injection
        let fontImport = "";
        if (activeCfg.fontFamily && activeCfg.fontFamily.trim() !== "") {
            const formattedFont = activeCfg.fontFamily.trim().replace(/\s+/g, "+");
            fontImport = `@import url('https://fonts.googleapis.com/css2?family=${formattedFont}:wght@400;600;700&display=swap');`;
        }

        styleEl.innerHTML = `
            ${fontImport}
            @keyframes tsKenBurns {
                0% { transform: scale(1); }
                100% { transform: scale(1.12); }
            }
            @keyframes tsGradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes tsPulseGlow {
                0%, 100% { box-shadow: 0 0 6px ${activeCfg.accentColor}; }
                50% { box-shadow: 0 0 22px ${activeCfg.accentColor}; }
            }
            @keyframes tsSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            :root {
                --spice-main: ${activeCfg.bgColor} !important;
                --spice-sidebar: ${activeCfg.sidebarColor} !important;
                --spice-card: ${activeCfg.cardColor} !important;
                --spice-player: ${activeCfg.playerColor} !important;
                --spice-text: ${activeCfg.textColor} !important;
                --spice-subtext: ${activeCfg.subTextColor} !important;
                --spice-button: ${activeCfg.accentColor} !important;
                --spice-button-active: ${activeCfg.accentColor} !important;
                --spice-tab-active: ${activeCfg.accentColor} !important;
            }

            body, .Root__top-container {
                background: transparent !important;
                ${activeCfg.fontFamily ? `font-family: '${activeCfg.fontFamily}', sans-serif !important;` : ""}
            }

            .Root__main-view, .Root__nav-bar, .Root__now-playing-bar, .main-view-container {
                background-color: color-mix(in srgb, ${activeCfg.bgColor} ${Math.round(parseFloat(mainAlpha) * 100)}%, transparent) !important;
            }

            .main-card-card, .main-home-homeHeader, button, input, .ts-panel {
                border-radius: ${activeCfg.borderRadius}px !important;
            }

            ${activeCfg.buttonSquish ? `
                button:active, [role="button"]:active {
                    transform: scale(0.91) !important;
                    transition: transform 0.08s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
                }
            ` : ""}

            ${activeCfg.cardHoverLift ? `
                .main-card-card {
                    transition: transform 0.22s ease, box-shadow 0.22s ease !important;
                }
                .main-card-card:hover {
                    transform: translateY(-5px) !important;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.45) !important;
                }
            ` : ""}

            ${activeCfg.pulsePlayBtn ? `
                button[data-testid="play-button"] {
                    animation: tsPulseGlow 2.2s infinite ease-in-out !important;
                }
            ` : ""}

            ${activeCfg.spinAlbumArt ? `
                .main-coverSlotExpanded-container img, .main-nowPlayingWidget-coverArt img {
                    border-radius: 50% !important;
                    animation: tsSpin 14s linear infinite !important;
                }
            ` : ""}

            ${activeCfg.customCSS || ""}
        `;
    };

    // Physics Engine for Mouse Trails, Click Bursts & Ambient Particles
    let particles = [];
    let ribbonPoints = [];
    let ambientList = [];
    let hueTick = 0;

    function initAmbient() {
        ambientList = [];
        for (let i = 0; i < 45; i++) {
            ambientList.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 3 + 1.5,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                char: String.fromCharCode(0x30A0 + Math.random() * 96)
            });
        }
    }
    initAmbient();

    window.addEventListener("mousemove", (e) => {
        if (activeCfg.trailType === "none") return;
        hueTick = (hueTick + 4) % 360;
        const color = activeCfg.trailRainbow ? `hsl(${hueTick}, 95%, 60%)` : activeCfg.trailColor;
        const size = parseFloat(activeCfg.trailSize) || 6;

        if (activeCfg.trailType === "ribbon") {
            ribbonPoints.push({ x: e.clientX, y: e.clientY, life: 1.0, color });
            if (ribbonPoints.length > 28) ribbonPoints.shift();
        } else {
            for (let i = 0; i < 2; i++) {
                particles.push({
                    x: e.clientX + (Math.random() - 0.5) * 8,
                    y: e.clientY + (Math.random() - 0.5) * 8,
                    vx: (Math.random() - 0.5) * 2.2,
                    vy: activeCfg.trailType === "bubbles" ? -Math.random() * 2 - 0.5 : (Math.random() - 0.5) * 2.2,
                    size: size * (Math.random() * 0.6 + 0.6),
                    life: 1.0,
                    decay: 0.025,
                    color,
                    type: activeCfg.trailType,
                    emoji: activeCfg.trailEmoji || "✨"
                });
            }
        }
    });

    window.addEventListener("mousedown", (e) => {
        if (activeCfg.clickEffect === "none") return;
        const color = activeCfg.clickColor || activeCfg.accentColor;

        if (activeCfg.clickEffect === "ripple") {
            particles.push({
                x: e.clientX,
                y: e.clientY,
                size: 5,
                maxSize: 85,
                life: 1.0,
                decay: 0.035,
                color,
                type: "ripple"
            });
        } else {
            const count = activeCfg.clickEffect === "confetti" ? 26 : 16;
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
                const speed = Math.random() * 5 + 2;
                particles.push({
                    x: e.clientX,
                    y: e.clientY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 6 + 4,
                    life: 1.0,
                    decay: 0.024,
                    color: activeCfg.clickEffect === "confetti" ? `hsl(${Math.random() * 360}, 90%, 60%)` : color,
                    type: activeCfg.clickEffect
                });
            }
        }
    });

    function animateFX() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Ambient Background Particles
        if (activeCfg.ambientParticles !== "none") {
            ambientList.forEach((p) => {
                if (activeCfg.ambientParticles === "snow") {
                    p.y += 1.2;
                    p.x += Math.sin(p.y * 0.02) * 0.6;
                    if (p.y > canvas.height) { p.y = -5; p.x = Math.random() * canvas.width; }
                    ctx.fillStyle = "rgba(255,255,255,0.65)";
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                } else if (activeCfg.ambientParticles === "embers") {
                    p.y -= 1.6;
                    p.x += Math.sin(p.y * 0.03) * 0.8;
                    if (p.y < 0) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
                    ctx.fillStyle = "rgba(255, 110, 30, 0.75)";
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                } else if (activeCfg.ambientParticles === "matrix") {
                    p.y += 3.5;
                    if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
                    ctx.fillStyle = "rgba(0, 255, 100, 0.55)";
                    ctx.font = "14px monospace";
                    ctx.fillText(p.char, p.x, p.y);
                } else {
                    // Fireflies
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                    ctx.fillStyle = activeCfg.accentColor;
                    ctx.globalAlpha = 0.55;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1.0;
                }
            });
        }

        // 2. Ribbon Trail
        if (ribbonPoints.length > 1) {
            for (let i = 1; i < ribbonPoints.length; i++) {
                const pt0 = ribbonPoints[i - 1];
                const pt1 = ribbonPoints[i];
                ctx.strokeStyle = pt1.color;
                ctx.globalAlpha = pt1.life;
                ctx.lineWidth = (i / ribbonPoints.length) * (parseFloat(activeCfg.trailSize) || 6);
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(pt0.x, pt0.y);
                ctx.lineTo(pt1.x, pt1.y);
                ctx.stroke();
                pt1.life -= 0.03;
            }
            ribbonPoints = ribbonPoints.filter((p) => p.life > 0);
            ctx.globalAlpha = 1.0;
        }

        // 3. Trail & Click Particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= p.decay;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.globalAlpha = Math.max(0, p.life);

            if (p.type === "ripple") {
                p.size += (p.maxSize - p.size) * 0.14;
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 3 * p.life;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                p.x += p.vx;
                p.y += p.vy;
                if (p.type === "confetti") p.vy += 0.18; // gravity

                if (p.type === "emoji") {
                    ctx.font = `${p.size * 2.5}px sans-serif`;
                    ctx.fillText(p.emoji, p.x, p.y);
                } else if (p.type === "hearts") {
                    ctx.font = `${p.size * 2.5}px sans-serif`;
                    ctx.fillStyle = p.color;
                    ctx.fillText("♥", p.x, p.y);
                } else if (p.type === "bubbles") {
                    ctx.strokeStyle = p.color;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (p.type === "confetti") {
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, p.size, p.size * 0.6);
                } else {
                    // Sparkles / Stars / Sparks
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        ctx.globalAlpha = 1.0;
        requestAnimationFrame(animateFX);
    }

    // Boot
    window.applyThemeStudioConfig(activeCfg);
    animateFX();
})();
