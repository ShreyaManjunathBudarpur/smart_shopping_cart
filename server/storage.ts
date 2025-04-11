import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  carts, type Cart, type InsertCart,
  cartItems, type CartItem, type InsertCartItem,
  orders, type Order, type InsertOrder
} from "@shared/schema";
import { db } from "./db";
import { eq } from 'drizzle-orm';

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User related methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product related methods
  getProduct(id: number): Promise<Product | undefined>;
  getProductByBarcode(barcode: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;

  // Cart related methods
  getCart(id: number): Promise<Cart | undefined>;
  getCartByCartId(cartId: string): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  updateCartTotal(id: number, totalAmount: string): Promise<Cart>;
  updateCartStatus(id: number, status: string): Promise<Cart>;

  // Cart Item related methods
  getCartItems(cartId: number): Promise<CartItem[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem>;
  removeCartItem(id: number): Promise<void>;

  // Order related methods
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByCartId(cartId: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  getAllOrders(): Promise<Order[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private carts: Map<number, Cart>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;

  private userCurrentId: number;
  private productCurrentId: number;
  private cartCurrentId: number;
  private cartItemCurrentId: number;
  private orderCurrentId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.orders = new Map();

    this.userCurrentId = 1;
    this.productCurrentId = 1;
    this.cartCurrentId = 1;
    this.cartItemCurrentId = 1;
    this.orderCurrentId = 1;

    // Add some sample products
    this.initializeProducts();
  }

  private async initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        barcode: "8901058861389",
        name: "Britannia Good Day Butter Cookies",
        price: "50.00",
        imageUrl: "/product-images/good-day.jpg",
        category: "Snacks",
        description: "Delicious butter cookies for your tea time"
      },
      {
        barcode: "8901063010631",
        name: "Tata Salt",
        price: "25.00",
        imageUrl: "/product-images/tata-salt.jpg",
        category: "Groceries",
        description: "Iodized table salt"
      },
      {
        barcode: "8901725134235",
        name: "Maggi 2-Minute Noodles",
        price: "14.00",
        imageUrl: "/product-images/maggi.jpg",
        category: "Instant Food",
        description: "Instant noodles, ready in 2 minutes"
      },
      {
        barcode: "8901030667947",
        name: "Colgate MaxFresh Toothpaste",
        price: "110.00",
        imageUrl: "/product-images/colgate.jpg",
        category: "Personal Care",
        description: "Toothpaste for fresh breath"
      },
      {
        barcode: "8901138511975",
        name: "Parle-G Biscuits",
        price: "10.00",
        imageUrl: "/product-images/parle-g.jpg",
        category: "Snacks",
        description: "Glucose biscuits - India's favorite"
      }
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.barcode === barcode,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category,
    );
  }

  // Cart methods
  async getCart(id: number): Promise<Cart | undefined> {
    return this.carts.get(id);
  }

  async getCartByCartId(cartId: string): Promise<Cart | undefined> {
    return Array.from(this.carts.values()).find(
      (cart) => cart.cartId === cartId,
    );
  }

  async createCart(insertCart: InsertCart): Promise<Cart> {
    const id = this.cartCurrentId++;
    const now = new Date();
    const cart: Cart = { 
      ...insertCart, 
      id, 
      totalAmount: "0", 
      status: "active", 
      createdAt: now 
    };
    this.carts.set(id, cart);
    return cart;
  }

  async updateCartTotal(id: number, totalAmount: string): Promise<Cart> {
    const cart = this.carts.get(id);
    if (!cart) {
      throw new Error(`Cart with id ${id} not found`);
    }

    const updatedCart: Cart = { ...cart, totalAmount };
    this.carts.set(id, updatedCart);
    return updatedCart;
  }

  async updateCartStatus(id: number, status: string): Promise<Cart> {
    const cart = this.carts.get(id);
    if (!cart) {
      throw new Error(`Cart with id ${id} not found`);
    }

    const updatedCart: Cart = { ...cart, status };
    this.carts.set(id, updatedCart);
    return updatedCart;
  }

  // Cart Item methods
  async getCartItems(cartId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.cartId === cartId,
    );
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemCurrentId++;
    const now = new Date();
    // Ensure quantity has a default value of 1 if not provided
    const quantity = insertCartItem.quantity ?? 1;
    const cartItem: CartItem = { ...insertCartItem, id, quantity, addedAt: now };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) {
      throw new Error(`Cart item with id ${id} not found`);
    }

    const updatedCartItem: CartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }

  async removeCartItem(id: number): Promise<void> {
    this.cartItems.delete(id);
  }

  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByCartId(cartId: number): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      (order) => order.cartId === cartId,
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const now = new Date();
    // Ensure paymentMethod is never undefined
    const paymentMethod = insertOrder.paymentMethod ?? null;
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: "pending", 
      paymentMethod,
      createdAt: now 
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }

    const updatedOrder: Order = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize products on startup
    this.initializeProducts();
  }

  private async initializeProducts() {
    try {
      // Check if products already exist
      const existingProducts = await db.select().from(products);

      if (existingProducts.length === 0) {
        const sampleProducts: InsertProduct[] = [

          {
            barcode: "8901063010631",
            name: "Tata Salt",
            price: "25.00",
            imageUrl: "",
            category: "Groceries",
            description: "Iodized table salt"
          },
          {
            barcode: "8901725134235",
            name: "Maggi 2-Minute Noodles",
            price: "14.00",
            imageUrl: "",
            category: "Instant Food",
            description: "Instant noodles, ready in 2 minutes"
          },
          {
            barcode: "8901030667947",
            name: "Colgate MaxFresh Toothpaste",
            price: "110.00",
            imageUrl: "",
            category: "Personal Care",
            description: "Toothpaste for fresh breath"
          },
          {
            barcode: "8901138511975",
            name: "Parle-G Biscuits",
            price: "10.00",
            imageUrl: "",
            category: "Snacks",
            description: "Glucose biscuits - India's favorite"
          },

          {
            barcode: "8901088046057",
            name: "Tata Salt",
            price: "20.00",
            imageUrl: "",
            category: "Groceries",
            description: "Vacuum evaporated iodized salt - 1kg"
          },
          {
            barcode: "8901058110339",
            name: "Maggi 2-Minute Noodles",
            price: "14.00",
            imageUrl: "",
            category: "Instant Food",
            description: "Instant noodles with masala flavor - quick and easy meal"
          },
          {
            barcode: "8901314010551",
            name: "Colgate MaxFresh Toothpaste",
            price: "95.00",
            imageUrl: "",
            category: "Personal Care",
            description: "Toothpaste with cooling crystals for fresh breath - 150g"
          }
        ];

        // Insert all sample products at once
        await db.insert(products).values(sampleProducts);
        console.log("Sample products initialized in database");
      }
    } catch (error) {
      console.error("Error initializing products:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.barcode, barcode));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.select().from(products).where(eq(products.category, category));
  }

  // Cart methods
  async getCart(id: number): Promise<Cart | undefined> {
    const [cart] = await db.select().from(carts).where(eq(carts.id, id));
    return cart;
  }

  async getCartByCartId(cartId: string): Promise<Cart | undefined> {
    const [cart] = await db.select().from(carts).where(eq(carts.cartId, cartId));
    return cart;
  }

  async createCart(insertCart: InsertCart): Promise<Cart> {
    const now = new Date();
    const [cart] = await db.insert(carts).values({
      ...insertCart,
      totalAmount: "0",
      status: "active",
      createdAt: now
    }).returning();
    return cart;
  }

  async updateCartTotal(id: number, totalAmount: string): Promise<Cart> {
    const [updatedCart] = await db
      .update(carts)
      .set({ totalAmount })
      .where(eq(carts.id, id))
      .returning();

    if (!updatedCart) {
      throw new Error(`Cart with id ${id} not found`);
    }

    return updatedCart;
  }

  async updateCartStatus(id: number, status: string): Promise<Cart> {
    const [updatedCart] = await db
      .update(carts)
      .set({ status })
      .where(eq(carts.id, id))
      .returning();

    if (!updatedCart) {
      throw new Error(`Cart with id ${id} not found`);
    }

    return updatedCart;
  }

  // Cart Item methods
  async getCartItems(cartId: number): Promise<CartItem[]> {
    const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cartId));

    // Fetch product details for each cart item
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await this.getProduct(item.productId);
        return { ...item, product };
      })
    );

    return enrichedItems;
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    const [item] = await db.select().from(cartItems).where(eq(cartItems.id, id));
    return item;
  }

  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const now = new Date();
    // Ensure quantity has a default value of 1 if not provided
    const quantity = insertCartItem.quantity ?? 1;

    const [cartItem] = await db.insert(cartItems).values({
      ...insertCartItem,
      quantity,
      addedAt: now
    }).returning();

    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();

    if (!updatedItem) {
      throw new Error(`Cart item with id ${id} not found`);
    }

    return updatedItem;
  }

  async removeCartItem(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderByCartId(cartId: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.cartId, cartId));
    return order;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const now = new Date();
    // Ensure paymentMethod is never undefined
    const paymentMethod = insertOrder.paymentMethod ?? null;

    const [order] = await db.insert(orders).values({
      ...insertOrder,
      status: "pending",
      paymentMethod,
      createdAt: now
    }).returning();

    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();

    if (!updatedOrder) {
      throw new Error(`Order with id ${id} not found`);
    }

    return updatedOrder;
  }

  async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }
}

// Replace MemStorage with DatabaseStorage
export const storage = new DatabaseStorage();