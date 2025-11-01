import { BrowserRouter, Routes, Route } from "react-router-dom";
import PhoneFrame from "./components/PhoneFrame";
import ProductPage from "./components/ProductPage";
import StorePage from "./components/StorePage";
import UserPage from "./components/UserPage";

function App() {
  return (
    <BrowserRouter>
    <PhoneFrame screenBg="bg-neutral-50">
      {/* Your mobile app content goes here */}
      <div className="p-4">
          <Routes>
            <Route path="/" element={<StorePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/profile" element={<UserPage />} />
          </Routes>
      </div>
    </PhoneFrame>
    </BrowserRouter>
  );
}

export default App;
