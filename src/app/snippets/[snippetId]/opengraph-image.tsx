import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Code Snippet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
    params,
}: {
    params: Promise<{ snippetId: string }>;
}) {
    const { snippetId } = await params;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://snippetstudio.dev";

    let title = "Code Snippet";
    let language = "code";

    try {
        const res = await fetch(`${appUrl}/api/snippet-meta?id=${snippetId}`);
        if (res.ok) {
            const data = await res.json();
            title = data.title ?? title;
            language = data.language ?? language;
        }
    } catch {
        // fallback to defaults
    }

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    padding: "64px",
                    background: "linear-gradient(135deg, #0d1424 0%, #130d1a 100%)",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Logo mark */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                    <div style={{
                        width: 52, height: 52,
                        borderRadius: 12,
                        background: "linear-gradient(135deg, #0EA5E9, #6C47FF)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        color: "white",
                    }}>
                        {"{ }"}
                    </div>
                    <span style={{ color: "#94a3b8", fontSize: 22 }}>Snippet Studio</span>
                </div>

                {/* Snippet title */}
                <div style={{
                    fontSize: 56,
                    fontWeight: 700,
                    color: "white",
                    lineHeight: 1.1,
                    marginBottom: 20,
                    maxWidth: 900,
                }}>
                    {title}
                </div>

                {/* Language badge */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 20px",
                    background: "rgba(14, 165, 233, 0.15)",
                    border: "1px solid rgba(14, 165, 233, 0.3)",
                    borderRadius: 999,
                    color: "#0EA5E9",
                    fontSize: 20,
                    fontFamily: "monospace",
                }}>
                    {language}
                </div>
            </div>
        ),
        { ...size },
    );
}
