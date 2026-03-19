import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/layout/ScrollToTop";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <AppRoutes />
        <ChatbotWidget />
      </ToastProvider>
    </BrowserRouter>
  );
}
