import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function useExternalWindow(title: string = "Preview Externo") {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const externalWindow = useRef<Window | null>(null);

  const openWindow = () => {
    if (externalWindow.current && !externalWindow.current.closed) {
      externalWindow.current.focus();
      return;
    }

    // Opens a new floating browser window that can be dragged to a second monitor
    const win = window.open('', '', 'width=800,height=600,left=200,top=200');
    if (!win) {
      alert("Por favor, permita pop-ups no seu navegador para usar a janela multi-telas.");
      return;
    }

    win.document.title = title;
    
    // Copy stylesheets from the parent document to ensure tailwind works
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules).map((rule) => rule.cssText).join('');
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean)
      .join('\n');

    const styleEl = win.document.createElement('style');
    styleEl.innerHTML = styles;
    win.document.head.appendChild(styleEl);

    Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style')).forEach(element => {
       const clone = element.cloneNode(true);
       win.document.head.appendChild(clone);
    });

    // Create the mounting container
    const bodyContainer = win.document.createElement('div');
    bodyContainer.style.width = '100vw';
    bodyContainer.style.height = '100vh';
    bodyContainer.style.display = 'flex';
    bodyContainer.style.flexDirection = 'column';
    win.document.body.style.margin = '0';
    win.document.body.appendChild(bodyContainer);

    setContainer(bodyContainer);
    externalWindow.current = win;

    // Handle when user closes the external window
    win.addEventListener('beforeunload', () => {
      setContainer(null);
      externalWindow.current = null;
    });
  };

  const closeWindow = () => {
    if (externalWindow.current) {
      externalWindow.current.close();
      externalWindow.current = null;
      setContainer(null);
    }
  };

  // Close external window when the main component unmounts
  useEffect(() => {
    return () => {
      if (externalWindow.current) {
        externalWindow.current.close();
      }
    };
  }, []);

  const ExternalPortal = ({ children }: { children: React.ReactNode }) => {
    if (!container) return null;
    return createPortal(children, container);
  };

  return {
    isExternalOpen: !!container,
    openExternalWindow: openWindow,
    closeExternalWindow: closeWindow,
    ExternalPortal
  };
}
