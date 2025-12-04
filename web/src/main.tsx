import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="degree-planner-theme">
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "bg-background text-foreground border border-border rounded-lg shadow-lg p-4 flex items-start gap-3",
              title: "text-sm font-semibold",
              description: "text-sm text-muted-foreground",
              actionButton:
                "bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium",
              cancelButton:
                "bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm font-medium",
              closeButton:
                "bg-background border border-border text-foreground hover:bg-accent",

              error: "!text-red-600 dark:!text-red-500 border-red-500/20",
              success: "text-primary border-primary/20",
              warning:
                "text-yellow-600 dark:text-yellow-500 border-yellow-500/20",
              info: "text-blue-600 dark:text-blue-500 border-blue-500/20",
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
