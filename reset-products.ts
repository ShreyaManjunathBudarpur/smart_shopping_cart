import { db } from './server/db';
import { products } from './shared/schema';

async function resetProducts() {
  try {
    console.log('Deleting all products from the database...');
    await db.delete(products);
    console.log('All products deleted. The app will now re-initialize them on next startup.');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting products:', error);
    process.exit(1);
  }
}

resetProducts();