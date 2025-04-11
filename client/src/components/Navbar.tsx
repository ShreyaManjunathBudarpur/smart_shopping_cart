import { Link } from "wouter";
import { ShoppingCart, Menu, X, QrCode } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, cartItems, isBudgetExceeded } = useCart();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-primary mr-2" />
                <span className="text-xl font-bold text-gray-900">SmartCart</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/products" className="text-gray-600 hover:text-primary font-medium">
              Products
            </Link>
            <Link href="/set-budget" className="text-gray-600 hover:text-primary font-medium">
              Set Budget
            </Link>
            <Link href="/qr-code" className="text-gray-600 hover:text-primary font-medium">
              <div className="flex items-center">
                <QrCode className="h-4 w-4 mr-1" />
                <span>QR Code</span>
              </div>
            </Link>
            <Link href="/cart" className="relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "flex items-center space-x-1",
                    isBudgetExceeded && "border-red-500 text-red-500"
                  )}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className={cn(
                      "ml-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs",
                      isBudgetExceeded && "bg-red-500"
                    )}>
                      {totalItems}
                    </span>
                  )}
                </Button>
                {isBudgetExceeded && (
                  <span className="absolute -top-2 -right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                Products
            </Link>
            <Link href="/set-budget" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                Set Budget
            </Link>
            <Link href="/qr-code" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                <div className="flex items-center">
                  <QrCode className="h-4 w-4 mr-2" />
                  <span>QR Code</span>
                </div>
            </Link>
            <Link href="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex justify-between items-center">
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className={cn(
                    "bg-primary text-white rounded-full px-2 py-1 text-xs",
                    isBudgetExceeded && "bg-red-500"
                  )}>
                    {totalItems} {isBudgetExceeded && "- Budget Exceeded!"}
                  </span>
                )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}