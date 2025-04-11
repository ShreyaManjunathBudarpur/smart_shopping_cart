import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import SetBudget from "./pages/SetBudget";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import LCDSimulator from "./pages/LCDSimulator";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";

function Router() {
  const [location] = useLocation();
  const showNavbar = location !== "/welcome";
  
  return (
    <>
      {showNavbar && <Navbar />}
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/welcome" component={Welcome} />
        <Route path="/set-budget" component={SetBudget} />
        <Route path="/products" component={Products} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-confirmation" component={OrderConfirmation} />
        <Route path="/lcd-simulator" component={LCDSimulator} />
        <Route path="/qr-code" component={QRCodeGenerator} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Router />
          </main>
        </div>
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
