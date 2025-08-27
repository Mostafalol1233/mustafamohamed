import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Code protection
!function(){var a=Element.prototype.appendChild;Element.prototype.appendChild=function(b){if(1===b.nodeType){var c=b.getAttribute("src")||"";if(c.includes("replit")||c.includes("cdn.replit"))return b}return a.call(this,b)};setInterval(function(){document.querySelectorAll('script[src*="replit"], script[src*="cdn.replit"]').forEach(function(a){a.remove()})},500)}();

createRoot(document.getElementById("root")!).render(<App />);
