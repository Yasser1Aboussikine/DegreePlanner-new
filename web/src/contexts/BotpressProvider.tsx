import { createContext, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface BotpressContextValue {
  isLoaded: boolean;
}

const BotpressContext = createContext<BotpressContextValue>({ isLoaded: false });

export const useBotpress = () => useContext(BotpressContext);

interface BotpressProviderProps {
  children: ReactNode;
  enabled: boolean;
}

export const BotpressProvider = ({ children, enabled }: BotpressProviderProps) => {
  const isLoadedRef = useRef(false);
  const scriptsLoadedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      console.log("[Botpress] Cleaning up chatbot...");

      const inject = document.getElementById("botpress-inject");
      const config = document.getElementById("botpress-config");

      if (inject) {
        inject.remove();
      }
      if (config) {
        config.remove();
      }

      const webchatDiv = document.getElementById("bp-web-widget");
      if (webchatDiv) {
        webchatDiv.remove();
      }

      const iframes = document.querySelectorAll('iframe[src*="botpress"]');
      iframes.forEach(iframe => iframe.remove());

      const botpressContainers = document.querySelectorAll('[id*="botpress"], [class*="botpress"], [id*="bp-"], [class*="bp-"]');
      botpressContainers.forEach(container => {
        if (container.id !== 'botpress-inject' && container.id !== 'botpress-config') {
          container.remove();
        }
      });

      if ((window as any).botpress) {
        delete (window as any).botpress;
      }

      if ((window as any).botpressWebChat) {
        delete (window as any).botpressWebChat;
      }

      scriptsLoadedRef.current = false;
      isLoadedRef.current = false;

      console.log("[Botpress] Chatbot cleaned up successfully");
      return;
    }

    if (scriptsLoadedRef.current) {
      return;
    }

    const loadBotpress = () => {
      console.log("[Botpress] Loading chatbot...");

      const injectScript = document.createElement("script");
      injectScript.src = "https://cdn.botpress.cloud/webchat/v3.5/inject.js";
      injectScript.id = "botpress-inject";
      injectScript.async = true;

      injectScript.onload = () => {
        console.log("[Botpress] Inject script loaded");

        const configScript = document.createElement("script");
        configScript.src = "https://files.bpcontent.cloud/2025/12/01/00/20251201001255-2IYA2VOU.js";
        configScript.id = "botpress-config";
        configScript.defer = true;

        configScript.onload = () => {
          console.log("[Botpress] Config script loaded and chatbot ready");
          isLoadedRef.current = true;
        };

        configScript.onerror = () => {
          console.error("[Botpress] Failed to load config script");
        };

        document.body.appendChild(configScript);
      };

      injectScript.onerror = () => {
        console.error("[Botpress] Failed to load inject script");
      };

      document.body.appendChild(injectScript);
      scriptsLoadedRef.current = true;
    };

    const timer = setTimeout(loadBotpress, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [enabled]);

  return (
    <BotpressContext.Provider value={{ isLoaded: isLoadedRef.current }}>
      {children}
    </BotpressContext.Provider>
  );
};
