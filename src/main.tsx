import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./router";
import "./styles.css";
import "./workspaces.css";
import "./company-directory.css";

const root = document.getElementById("root");
if (!root) throw new Error("The app root element is missing.");
createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
