import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Block Replit content at React level
const blockReplitScripts = () => {
  // Override appendChild to block Replit scripts
  const originalAppendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function(newChild: Node) {
    if (newChild.nodeType === Node.ELEMENT_NODE) {
      const element = newChild as Element;
      const src = element.getAttribute('src') || '';
      if (src.includes('replit') || src.includes('cdn.replit')) {
        console.log('Blocked Replit script:', src);
        return newChild;
      }
    }
    return originalAppendChild.call(this, newChild);
  };

  // Clean up Replit elements periodically
  setInterval(() => {
    const replitScripts = document.querySelectorAll('script[src*="replit"], script[src*="cdn.replit"]');
    replitScripts.forEach(script => {
      script.remove();
      console.log('Removed Replit script');
    });
  }, 500);
};

blockReplitScripts();

createRoot(document.getElementById("root")!).render(<App />);
