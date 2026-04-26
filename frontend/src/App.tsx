import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/common/ToastContainer";

const BASE_PATH = import.meta.env.VITE_BASE_PATH || "/";

function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
}

export default App;
