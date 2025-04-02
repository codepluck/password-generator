export async function browserFinterPrint(): Promise<string> {
    const fingerprintData = [
        navigator.userAgent, // User Agent (Stable)
        navigator.language, // Language (Stable)
        screen.width, // Screen Width (Stable)
        screen.height, // Screen Height (Stable)
        screen.colorDepth, // Color Depth (Stable)
        new Date().getTimezoneOffset(), // Timezone Offset (Stable)
        navigator.hardwareConcurrency || "unknown", // CPU Cores (Stable)
        getCanvasFingerprint(), // Unique Rendering Fingerprint
    ].join("||");

    return await hashString(fingerprintData);
}

// Hash function using SHA-256
async function hashString(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// Generate a fingerprint based on canvas rendering (Highly Unique)
function getCanvasFingerprint(): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "canvas-unavailable";

    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillStyle = "#f60";
    ctx.fillText("Fingerprint", 10, 10);

    return canvas.toDataURL();
}