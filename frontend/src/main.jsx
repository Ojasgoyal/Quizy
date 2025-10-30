import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const darkTheme = "night";
const lightTheme = "corporate";

export default function Root() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || darkTheme
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const clerkAppearance =
    theme === darkTheme
      ? {
          baseTheme: "dark",
          variables: {
            colorPrimary: "#22d3ee",
            colorBackground: "#0f172a",
            colorText: "#f1f5f9",
            colorTextSecondary: "#94a3b8",
            colorInputBackground: "#1e293b",
            colorInputText: "#f1f5f9",
            colorDanger: "#ef4444",
          },
          elements: {
            formButtonPrimary: {
              backgroundColor: "#22d3ee",
              color: "#0f172a",
              "&:hover": {
                backgroundColor: "#06b6d4",
              },
            },
            socialButtonsBlockButton: {
              backgroundColor: "#1e293b",
              color: "#1e293b",
              border: "1px solid #334155",
              "&:hover": {
                backgroundColor: "#2c3b51",
              },
            },
            socialButtonsBlockButtonText: {
              color: "#ffffff",
              fontWeight: "500",
            },
            formFieldInput: {
              backgroundColor: "#1e293b",
              borderColor: "#334155",
              color: "#f1f5f9",
            },
            footerActionLink: {
              color: "#22d3ee",
              "&:hover": {
                color: "#06b6d4",
              },
            },
            userButtonPopoverCard: {
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
            },
            userButtonPopoverActionButton: {
              color: "#f1f5f9",
              "&:hover": { color: "#f2f7f9 ", backgroundColor: "#334155" },
            },
            userButtonPopoverActionButtonText: {
              color: "#f1f5f9",
            },
            userButtonPopoverActionButtonIcon: {
              color: "#94a3b8",
            },
            userButtonPopoverFooter: {
              backgroundColor: "#1e293b",
              borderTop: "1px solid #334155",
            },
            menuItem: {
              color: "#f1f5f9",
              "&:hover": { backgroundColor: "#334155" },
            },
            menuItemText: {
              color: "#f1f5f9",
            },
            // Profile section
            profileSectionTitle: {
              color: "#f1f5f9",
            },
            profileSectionContent: {
              color: "#94a3b8",
            },
            badge: {
              color: "#94a3b8",
            },
            avatarImageActionsUpload: {
              color: "#1B8E2D",
              "&:hover": {
                color: "#28a745",
                backgroundColor: "oklch(26.2% 0.051 172.552)",
              },
            },
          },
        }
      : {
          variables: {
            colorPrimary: "#0ea5e9",
            colorBackground: "#ffffff",
            colorText: "#0f172a",
            colorTextSecondary: "#64748b",
            colorInputBackground: "#f8fafc",
            colorInputText: "#0f172a",
            colorDanger: "#dc2626",
          },
          elements: {
            formButtonPrimary: {
              backgroundColor: "#0ea5e9",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#0284c7",
              },
            },
            socialButtonsBlockButton: {
              border: "1px solid #cbd5e1",
              "&:hover": {
                backgroundColor: "#f8fafc",
              },
            },
            formFieldInput: {
              backgroundColor: "#f8fafc",
              borderColor: "#cbd5e1",
            },
          },
        };

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={clerkAppearance}
    >
      <BrowserRouter>
        <App theme={theme} setTheme={setTheme} />
      </BrowserRouter>
    </ClerkProvider>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
