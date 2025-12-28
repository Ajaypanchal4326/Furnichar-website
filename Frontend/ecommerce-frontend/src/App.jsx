import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/layout/ScrollToTop";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <AppRoutes />
       <ChatbotWidget />
    </BrowserRouter>
  );
}
