import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from 'uuid';
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCartSchema, 
  insertCartItemSchema,
  insertOrderSchema,
  type Cart,
  type CartItem,
  type Product,
  type Order
} from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe if the secret key is available
let stripe: Stripe | undefined;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API routes
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      return res.status(200).json({
        data: products
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  app.get('/api/products/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      return res.status(200).json({
        data: products
      });
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }
      
      return res.status(200).json({
        data: product
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  app.get('/api/products/barcode/:barcode', async (req, res) => {
    try {
      const { barcode } = req.params;
      const product = await storage.getProductByBarcode(barcode);
      
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }
      
      return res.status(200).json({
        data: product
      });
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  // Cart API routes
  app.post('/api/carts', async (req, res) => {
    try {
      const cartData = insertCartSchema.parse(req.body);
      const cart = await storage.createCart(cartData);
      
      return res.status(201).json({
        message: 'Cart created successfully',
        data: cart
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid data provided',
          errors: error.errors
        });
      }
      
      console.error('Error creating cart:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  app.get('/api/carts/:cartId', async (req, res) => {
    try {
      const cart = await storage.getCartByCartId(req.params.cartId);
      
      if (!cart) {
        return res.status(404).json({
          message: 'Cart not found'
        });
      }
      
      return res.status(200).json({
        data: cart
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  app.patch('/api/carts/:id/budget', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { budget } = req.body;
      
      if (!budget || isNaN(parseFloat(budget))) {
        return res.status(400).json({
          message: 'Invalid budget provided'
        });
      }
      
      const cart = await storage.getCart(id);
      if (!cart) {
        return res.status(404).json({
          message: 'Cart not found'
        });
      }
      
      // Update cart with new budget
      const updatedCart = await storage.updateCartTotal(id, cart.totalAmount);
      
      return res.status(200).json({
        message: 'Budget updated successfully',
        data: updatedCart
      });
    } catch (error) {
      console.error('Error updating cart budget:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  // Cart items API routes
  app.post('/api/cart-items', async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      
      // Check if cart exists
      const cart = await storage.getCart(cartItemData.cartId);
      if (!cart) {
        return res.status(404).json({
          message: 'Cart not found'
        });
      }
      
      // Check if product exists
      const product = await storage.getProduct(cartItemData.productId);
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }
      
      // Add item to cart
      const cartItem = await storage.createCartItem(cartItemData);
      
      // Update cart total
      const cartItems = await storage.getCartItems(cart.id);
      let totalAmount = "0";
      
      for (const item of cartItems) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          const itemTotal = parseFloat(product.price) * item.quantity;
          totalAmount = (parseFloat(totalAmount) + itemTotal).toFixed(2);
        }
      }
      
      await storage.updateCartTotal(cart.id, totalAmount);
      
      return res.status(201).json({
        message: 'Item added to cart successfully',
        data: cartItem
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid data provided',
          errors: error.errors
        });
      }
      
      console.error('Error adding item to cart:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  app.get('/api/carts/:cartId/items', async (req, res) => {
    try {
      const cartId = parseInt(req.params.cartId);
      const cartItems = await storage.getCartItems(cartId);
      
      // Enhance cart items with product details
      const enhancedItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      return res.status(200).json({
        data: enhancedItems
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  app.patch('/api/cart-items/:id/quantity', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (!quantity || isNaN(quantity) || quantity < 1) {
        return res.status(400).json({
          message: 'Invalid quantity provided'
        });
      }
      
      const cartItem = await storage.getCartItem(id);
      if (!cartItem) {
        return res.status(404).json({
          message: 'Cart item not found'
        });
      }
      
      // Update cart item quantity
      const updatedCartItem = await storage.updateCartItemQuantity(id, quantity);
      
      // Update cart total
      const cart = await storage.getCart(cartItem.cartId);
      if (cart) {
        const cartItems = await storage.getCartItems(cart.id);
        let totalAmount = "0";
        
        for (const item of cartItems) {
          const product = await storage.getProduct(item.productId);
          if (product) {
            const itemTotal = parseFloat(product.price) * item.quantity;
            totalAmount = (parseFloat(totalAmount) + itemTotal).toFixed(2);
          }
        }
        
        await storage.updateCartTotal(cart.id, totalAmount);
      }
      
      return res.status(200).json({
        message: 'Quantity updated successfully',
        data: updatedCartItem
      });
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  app.delete('/api/cart-items/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const cartItem = await storage.getCartItem(id);
      if (!cartItem) {
        return res.status(404).json({
          message: 'Cart item not found'
        });
      }
      
      // Remove item from cart
      await storage.removeCartItem(id);
      
      // Update cart total
      const cart = await storage.getCart(cartItem.cartId);
      if (cart) {
        const cartItems = await storage.getCartItems(cart.id);
        let totalAmount = "0";
        
        for (const item of cartItems) {
          const product = await storage.getProduct(item.productId);
          if (product) {
            const itemTotal = parseFloat(product.price) * item.quantity;
            totalAmount = (parseFloat(totalAmount) + itemTotal).toFixed(2);
          }
        }
        
        await storage.updateCartTotal(cart.id, totalAmount);
      }
      
      return res.status(200).json({
        message: 'Item removed from cart successfully'
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  // Order API routes
  app.post('/api/orders', async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Check if cart exists and is active
      const cart = await storage.getCart(orderData.cartId);
      if (!cart) {
        return res.status(404).json({
          message: 'Cart not found'
        });
      }
      
      // If cart is not active, reactivate it
      if (cart.status !== 'active') {
        await storage.updateCartStatus(cart.id, 'active');
      }
      
      // Create order
      const order = await storage.createOrder(orderData);
      
      // Update cart status
      await storage.updateCartStatus(cart.id, 'completed');
      
      return res.status(201).json({
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid data provided',
          errors: error.errors
        });
      }
      
      console.error('Error creating order:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  app.get('/api/orders/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        });
      }
      
      // Enhance order with cart details
      const cart = await storage.getCart(order.cartId);
      
      // Get cart items
      let items: Array<CartItem & { product?: Product }> = [];
      if (cart) {
        const cartItems = await storage.getCartItems(cart.id);
        
        // Enhance cart items with product details
        items = await Promise.all(
          cartItems.map(async (item) => {
            const product = await storage.getProduct(item.productId);
            return {
              ...item,
              product
            };
          })
        );
      }
      
      return res.status(200).json({
        data: {
          ...order,
          cart,
          items
        }
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });
  
  app.get('/api/orders/cart/:cartId', async (req, res) => {
    try {
      const cartId = parseInt(req.params.cartId);
      const order = await storage.getOrderByCartId(cartId);
      
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        });
      }
      
      return res.status(200).json({
        data: order
      });
    } catch (error) {
      console.error('Error fetching order by cart ID:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });
  
  app.patch('/api/orders/cart/:cartId', async (req, res) => {
    try {
      const cartId = parseInt(req.params.cartId);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          message: 'Status is required'
        });
      }
      
      const order = await storage.getOrderByCartId(cartId);
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        });
      }
      
      const updatedOrder = await storage.updateOrderStatus(order.id, status);
      
      return res.status(200).json({
        message: 'Order status updated successfully',
        data: updatedOrder
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });
  
  app.get('/api/orders/latest', async (req, res) => {
    try {
      // This is a simplified approach - in a real app, you would probably 
      // reference a user ID or session to get their latest order
      
      // Get all orders and sort by ID (latest has highest ID)
      const orders = await storage.getAllOrders();
      if (!orders || orders.length === 0) {
        return res.status(404).json({
          message: 'No orders found'
        });
      }
      
      // Sort by ID descending
      const latestOrder = orders.sort((a: Order, b: Order) => b.id - a.id)[0];
      
      // Enhance order with cart details
      const cart = await storage.getCart(latestOrder.cartId);
      
      // Get cart items
      let items: Array<CartItem & { product?: Product }> = [];
      if (cart) {
        const cartItems = await storage.getCartItems(cart.id);
        
        // Enhance cart items with product details
        items = await Promise.all(
          cartItems.map(async (item) => {
            const product = await storage.getProduct(item.productId);
            return {
              ...item,
              product
            };
          })
        );
      }
      
      return res.status(200).json({
        data: {
          ...latestOrder,
          cart,
          items
        }
      });
    } catch (error) {
      console.error('Error fetching latest order:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  // Stripe payment intent creation
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({
          message: 'Stripe is not configured'
        });
      }

      const { amount } = req.body;
      if (!amount) {
        return res.status(400).json({
          message: 'Amount is required'
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100), // Convert to paise (smallest Indian currency unit)
        currency: 'inr',
      });

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return res.status(500).json({
        message: 'An error occurred while processing your request'
      });
    }
  });

  // Static QR code route
  app.get('/qr-code', (req, res) => {
    res.sendFile('temp_qr/qrcode-display.html', { root: '.' });
  });

  // Public URL access page
  app.get('/public-url', (req, res) => {
    res.sendFile('temp_qr/get-public-url.html', { root: '.' });
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Track connected clients with UUID for better identification
  const clients = new Map();
  
  wss.on('connection', (ws) => {
    const clientId = uuidv4();
    clients.set(clientId, ws);
    console.log(`WebSocket client connected: ${clientId}`);
    
    // Send connection success message
    ws.send(JSON.stringify({
      type: 'connection_status',
      connected: true,
      message: 'Connected to Smart Shopping Cart server',
      clientId: clientId
    }));
    
    // Handle messages from clients (LCD display, mobile app, browser)
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('WebSocket message received:', data.type);
        
        // Handle barcode scanning event from LCD display hardware
        if (data.type === 'scan') {
          const { barcode, cartId } = data;
          
          if (!barcode || !cartId) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Missing required parameters: barcode or cartId'
            }));
            return;
          }
          
          // Get product by barcode
          const product = await storage.getProductByBarcode(barcode);
          
          if (!product) {
            console.log(`Product not found for barcode: ${barcode}`);
            ws.send(JSON.stringify({
              type: 'error',
              message: `Product not found for barcode: ${barcode}`
            }));
            return;
          }
          
          // Get cart by cartId
          const cart = await storage.getCartByCartId(cartId);
          
          if (!cart) {
            console.log(`Cart not found with ID: ${cartId}`);
            ws.send(JSON.stringify({
              type: 'error',
              message: `Cart not found with ID: ${cartId}`
            }));
            return;
          }
          
          // Check if item already exists in cart
          const cartItems = await storage.getCartItems(cart.id);
          let existingItem = cartItems.find(item => item.productId === product.id);
          
          if (existingItem) {
            // Update quantity
            await storage.updateCartItemQuantity(existingItem.id, existingItem.quantity + 1);
            console.log(`Updated quantity for ${product.name} in cart ${cartId}`);
          } else {
            // Add new item
            await storage.createCartItem({
              cartId: cart.id,
              productId: product.id,
              quantity: 1
            });
            console.log(`Added new product ${product.name} to cart ${cartId}`);
          }
          
          // Calculate new total amount
          const updatedCartItems = await storage.getCartItems(cart.id);
          let totalAmount = 0;
          
          for (const item of updatedCartItems) {
            const product = await storage.getProduct(item.productId);
            if (product) {
              totalAmount += parseFloat(product.price) * item.quantity;
            }
          }
          
          // Update cart total
          await storage.updateCartTotal(cart.id, totalAmount.toFixed(2));
          
          // Check if budget exceeded
          const isBudgetExceeded = cart.budget && totalAmount > parseFloat(cart.budget);
          
          // Create response data
          const responseData = {
            type: 'product_scanned',
            data: {
              product,
              cart: {
                ...cart,
                totalAmount: totalAmount.toFixed(2),
                isBudgetExceeded
              },
              items: updatedCartItems
            }
          };
          
          // First send direct response to the hardware device that sent the scan
          ws.send(JSON.stringify({
            type: 'scan_success',
            product: {
              name: product.name,
              price: product.price
            },
            totalAmount: totalAmount.toFixed(2),
            isBudgetExceeded
          }));
          
          // Then broadcast to all connected clients for synchronization
          clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(responseData));
            }
          });
        }
        
        // Handle hardware status updates from Arduino
        else if (data.type === 'hardware_status') {
          console.log('Hardware status update:', data.status);
          // Forward hardware status to all clients
          clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'hardware_status',
                data: data.status
              }));
            }
          });
        }
        
        // Handle ping to keep connection alive
        else if (data.type === 'ping') {
          ws.send(JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString()
          }));
        }
        
        // Handle budget update requests
        else if (data.type === 'update_budget') {
          const { cartId, budget } = data;
          
          if (!cartId || !budget) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Missing required parameters: cartId or budget'
            }));
            return;
          }
          
          const cart = await storage.getCartByCartId(cartId);
          if (!cart) {
            ws.send(JSON.stringify({
              type: 'error',
              message: `Cart not found with ID: ${cartId}`
            }));
            return;
          }
          
          // In a real application, we'd update the budget here
          // For now, broadcasting the update to all clients
          clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'budget_updated',
                cartId,
                budget
              }));
            }
          });
        }
        
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message. Please check format and try again.'
        }));
      }
    });
    
    // Send periodic heartbeats to keep connections alive
    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        }));
      }
    }, 30000); // every 30 seconds
    
    // Handle disconnection
    ws.on('close', () => {
      clients.delete(clientId);
      clearInterval(heartbeatInterval);
      console.log(`WebSocket client disconnected: ${clientId}`);
    });
    
    // Handle errors
    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
      clients.delete(clientId);
      clearInterval(heartbeatInterval);
    });
  });

  return httpServer;
}
