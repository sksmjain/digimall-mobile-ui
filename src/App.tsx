import { BrowserRouter, Routes, Route } from "react-router-dom";
import PhoneFrame from "./components/PhoneFrame";
import ProductPage from "./components/ProductPage";
import StorePage from "./components/StorePage";
import UserPage from "./components/UserPage";
import ProductList from "./components/ProductList";
import RouteCardHost from "./components/RouteCardHost";
import ReelsPage from "./components/ReelsPage";
import InshortsPage from "./components/InshortsPage";

function App() {
  return (
    <BrowserRouter>
    <PhoneFrame screenBg="bg-neutral-50">
      {/* Your mobile app content goes here */}
      <div className="p-0">
          <Routes>
            <Route path="/" element={<StorePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/profile" element={<UserPage />} />
            <Route path="/reels" element={<ReelsPage />} />
            <Route path="/explore" element={<InshortsPage />} />
            <Route element={<RouteCardHost />}>
          <Route path="/products" element={<ProductList />} />
        </Route>
          </Routes>
      </div>
    </PhoneFrame>
    </BrowserRouter>
  );
}

export default App;
