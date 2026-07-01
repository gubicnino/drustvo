import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import "./styles.css";
import { App } from "./App";
import { AuthProvider } from "./lib/auth";
import { SocietyProvider } from "./lib/society";
import { ToastProvider } from "./components/Toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <AuthProvider>
          <SocietyProvider>
            <App />
          </SocietyProvider>
        </AuthProvider>
      </ToastProvider>
    </MotionConfig>
  </StrictMode>,
);
