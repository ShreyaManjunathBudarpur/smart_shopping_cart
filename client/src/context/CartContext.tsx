import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  barcode: string;
  category: string;
  description: string;
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product?: Product;
}

interface Cart {
  id: number;
  cartId: string;
  budget: string;
  totalAmount: string;
  status: string;
  createdAt: Date;
}

interface CartContextType {
  cart: Cart | null;
  cartItems: CartItem[];
  loadingCart: boolean;
  createCart: (budget: string) => Promise<Cart>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  isBudgetExceeded: boolean;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const { toast } = useToast();

  // Check if a cart exists in localStorage on initial load
  useEffect(() => {
    const storedCartId = localStorage.getItem('cartId');
    
    if (storedCartId) {
      fetchCart(storedCartId);
    }
  }, []);

  // Fetch cart data using cartId
  const fetchCart = async (cartId: string) => {
    setLoadingCart(true);
    
    try {
      const response = await apiRequest('GET', `/api/carts/${cartId}`);
      const data = await response.json();
      
      if (data.data) {
        setCart(data.data);
        fetchCartItems(data.data.id);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      localStorage.removeItem('cartId');
    } finally {
      setLoadingCart(false);
    }
  };

  // Fetch cart items for a specific cart
  const fetchCartItems = async (cartId: number) => {
    try {
      const response = await apiRequest('GET', `/api/carts/${cartId}/items`);
      const data = await response.json();
      
      if (data.data) {
        setCartItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  // Create a new cart with a budget
  const createCart = async (budget: string) => {
    setLoadingCart(true);
    
    try {
      // Generate a unique cart ID (in a real app, this would be a UUID or similar)
      const cartId = `cart_${Date.now()}`;
      
      const response = await apiRequest('POST', '/api/carts', {
        cartId,
        budget
      });
      
      const data = await response.json();
      
      if (data.data) {
        setCart(data.data);
        localStorage.setItem('cartId', data.data.cartId);
        setCartItems([]);
        return data.data;
      }
      
      throw new Error('Failed to create cart');
    } catch (error) {
      console.error('Error creating cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to create shopping cart. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoadingCart(false);
    }
  };

  // Add a product to the cart
  const addToCart = async (productId: number, quantity = 1) => {
    if (!cart) {
      toast({
        title: 'Error',
        description: 'Please set a budget before adding items to your cart.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoadingCart(true);
    
    try {
      const response = await apiRequest('POST', '/api/cart-items', {
        cartId: cart.id,
        productId,
        quantity
      });
      
      const data = await response.json();
      
      // Update cart items and fetch the updated cart (to get updated total)
      if (data.data) {
        fetchCartItems(cart.id);
        fetchCart(cart.cartId);
        
        toast({
          title: 'Success',
          description: 'Item added to cart successfully',
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingCart(false);
    }
  };

  // Remove an item from the cart
  const removeFromCart = async (itemId: number) => {
    if (!cart) return;
    
    setLoadingCart(true);
    
    try {
      await apiRequest('DELETE', `/api/cart-items/${itemId}`);
      
      // Remove the item locally and update cart total
      setCartItems(cartItems.filter(item => item.id !== itemId));
      fetchCart(cart.cartId);
      
      toast({
        title: 'Success',
        description: 'Item removed from cart',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingCart(false);
    }
  };

  // Update the quantity of a cart item
  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!cart) return;
    
    setLoadingCart(true);
    
    try {
      const response = await apiRequest('PATCH', `/api/cart-items/${itemId}/quantity`, {
        quantity
      });
      
      const data = await response.json();
      
      if (data.data) {
        // Update the item locally
        setCartItems(cartItems.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        ));
        
        // Fetch updated cart total
        fetchCart(cart.cartId);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Error',
        description: 'Failed to update quantity. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingCart(false);
    }
  };

  // Clear the cart
  const clearCart = () => {
    localStorage.removeItem('cartId');
    setCart(null);
    setCartItems([]);
  };

  // Check if budget is exceeded
  const isBudgetExceeded = cart 
    ? parseFloat(cart.totalAmount) > parseFloat(cart.budget)
    : false;

  const value = {
    cart,
    cartItems,
    loadingCart,
    createCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    isBudgetExceeded,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}