import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav, SiteFooter } from "@/components/site";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TERRANOVA — Earth analogs for Moon & Mars" },
      { name: "description", content: "Find places on Earth that resemble Moon and Mars sites for mission training." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <meta name="theme-color" content="#38bdf8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TERRANOVA" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        {children}
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('[PWA] Service worker registered:', reg.scope); })
                    .catch(function(err) { console.warn('[PWA] Service worker registration failed:', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

function SplashScreen() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0e1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: "splashFadeOut 0.6s ease-in-out 2.4s forwards",
      }}
    >
      <style>{`
        @keyframes splashFadeOut {
          to { opacity: 0; pointer-events: none; }
        }
        @keyframes splashPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes splashRing {
          from { transform: rotate(-30deg); }
          to   { transform: rotate(330deg); }
        }
        @keyframes splashFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Animated globe */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: "splashPulse 2s ease-in-out infinite" }}
      >
        <circle cx="60" cy="60" r="40" fill="#1a3a5c" />
        <path d="M40 44 Q52 32 60 40 Q68 32 80 44 Q88 56 80 72 Q68 84 60 84 Q52 84 40 72 Q32 56 40 44Z" fill="#1e5fa8" />
        <path d="M50 36 Q56 28 64 36 L68 52 Q60 60 52 52Z" fill="#2d8a4e" />
        <path d="M68 54 Q80 50 84 62 Q80 74 68 74 Q64 66 68 54Z" fill="#2d8a4e" />
        <path d="M36 58 Q44 54 48 66 Q40 74 36 66Z" fill="#2d8a4e" />
        <path d="M52 74 Q60 70 68 74 Q64 82 56 82Z" fill="#2d8a4e" />
        <circle cx="60" cy="60" r="40" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.4" />
        <ellipse
          cx="60" cy="60" rx="56" ry="20"
          fill="none" stroke="#38bdf8" strokeWidth="2"
          strokeDasharray="12 7" opacity="0.7"
          style={{ transformOrigin: "60px 60px", animation: "splashRing 4s linear infinite" }}
        />
        <circle cx="108" cy="38" r="4" fill="#38bdf8" opacity="0.9" />
      </svg>

      {/* Title */}
      <p
        style={{
          marginTop: "24px",
          fontFamily: "'Chakra Petch', sans-serif",
          fontSize: "28px",
          fontWeight: 700,
          color: "#f8fafc",
          letterSpacing: "0.05em",
          animation: "splashFadeIn 0.8s ease-out 0.3s both",
        }}
      >
        TERRANOVA
      </p>
      <p
        style={{
          marginTop: "8px",
          fontFamily: "'Manrope', sans-serif",
          fontSize: "13px",
          color: "#38bdf8",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          animation: "splashFadeIn 0.8s ease-out 0.6s both",
        }}
      >
        Explore Earth. Discover Other Worlds.
      </p>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [showSplash, setShowSplash] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Splash: hide after 3 s
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Capture the browser's beforeinstallprompt event
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> });
      // Show banner 3 s after splash ends (i.e. 3 s after page load)
      setTimeout(() => setShowInstallBanner(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => setShowInstallBanner(false);

  return (
    <QueryClientProvider client={queryClient}>
      {showSplash && <SplashScreen />}

      {/* PWA install banner */}
      {showInstallBanner && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9998,
            background: "linear-gradient(135deg, #0f172a 0%, #0a1628 100%)",
            border: "1px solid rgba(56,189,248,0.35)",
            borderRadius: "16px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(56,189,248,0.1)",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            minWidth: "320px",
            maxWidth: "420px",
            animation: "pwaSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <style>{`
            @keyframes pwaSlideUp {
              from { opacity: 0; transform: translateX(-50%) translateY(20px); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}</style>

          {/* Icon */}
          <img src="/icons/icon-192.png" alt="TERRANOVA" style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} />

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontFamily: "'Chakra Petch', sans-serif", fontSize: 14, fontWeight: 700, color: "#f8fafc" }}>
              Install TERRANOVA
            </p>
            <p style={{ margin: "2px 0 0", fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>
              Add to your home screen for quick access.
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
            <button
              onClick={handleInstall}
              style={{
                background: "#38bdf8",
                color: "#0a0e1a",
                border: "none",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'Manrope', sans-serif",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              style={{
                background: "transparent",
                color: "#64748b",
                border: "1px solid rgba(100,116,139,0.3)",
                borderRadius: 8,
                padding: "5px 14px",
                fontSize: 12,
                fontFamily: "'Manrope', sans-serif",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <SiteNav />
      <main><Outlet /></main>
      <SiteFooter />
      <Toaster />
    </QueryClientProvider>
  );
}
