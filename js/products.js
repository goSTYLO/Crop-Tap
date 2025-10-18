// Products Service for Crop-Tap
// Handles product management and marketplace functionality

class ProductService {
    constructor() {
        this.storage = storage; // Use the global storage instance
    }

    // Get all products
    getAllProducts() {
        return this.storage.getProducts();
    }

    // Get products by farmer
    getProductsByFarmer(farmerId) {
        return this.storage.getProductsByFarmer(farmerId);
    }

    // Get product by ID
    getProductById(productId) {
        const products = this.getAllProducts();
        return products.find(product => product.product_id === productId);
    }

    // Create new product
    createProduct(productData) {
        try {
            // Validate required fields
            if (!productData.name || !productData.price || !productData.quantity || !productData.farmer_id) {
                return {
                    success: false,
                    message: 'Please fill in all required fields.'
                };
            }

            // Validate price
            const price = parseFloat(productData.price);
            if (isNaN(price) || price <= 0) {
                return {
                    success: false,
                    message: 'Please enter a valid price.'
                };
            }

            // Validate quantity
            const quantity = parseInt(productData.quantity);
            if (isNaN(quantity) || quantity <= 0) {
                return {
                    success: false,
                    message: 'Please enter a valid quantity.'
                };
            }

            // Create product
            const newProduct = this.storage.createProduct({
                ...productData,
                price: price,
                quantity: quantity
            });

            return {
                success: true,
                message: 'Product added successfully!',
                product: newProduct
            };
        } catch (error) {
            console.error('Product creation error:', error);
            return {
                success: false,
                message: 'Failed to add product. Please try again.'
            };
        }
    }

    // Update product
    updateProduct(productId, updateData) {
        try {
            const product = this.getProductById(productId);
            
            if (!product) {
                return {
                    success: false,
                    message: 'Product not found.'
                };
            }

            // Validate price if provided
            if (updateData.price !== undefined) {
                const price = parseFloat(updateData.price);
                if (isNaN(price) || price <= 0) {
                    return {
                        success: false,
                        message: 'Please enter a valid price.'
                    };
                }
                updateData.price = price;
            }

            // Validate quantity if provided
            if (updateData.quantity !== undefined) {
                const quantity = parseInt(updateData.quantity);
                if (isNaN(quantity) || quantity < 0) {
                    return {
                        success: false,
                        message: 'Please enter a valid quantity.'
                    };
                }
                updateData.quantity = quantity;
            }

            const updatedProduct = this.storage.updateProduct(productId, updateData);
            
            if (updatedProduct) {
                return {
                    success: true,
                    message: 'Product updated successfully!',
                    product: updatedProduct
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to update product.'
                };
            }
        } catch (error) {
            console.error('Product update error:', error);
            return {
                success: false,
                message: 'Failed to update product. Please try again.'
            };
        }
    }

    // Delete product
    deleteProduct(productId) {
        try {
            const product = this.getProductById(productId);
            
            if (!product) {
                return {
                    success: false,
                    message: 'Product not found.'
                };
            }

            const success = this.storage.deleteProduct(productId);
            
            if (success) {
                return {
                    success: true,
                    message: 'Product deleted successfully!'
                };
            } else {
                return {
                    success: false,
                    message: 'Failed to delete product.'
                };
            }
        } catch (error) {
            console.error('Product deletion error:', error);
            return {
                success: false,
                message: 'Failed to delete product. Please try again.'
            };
        }
    }

    // Search products
    searchProducts(query) {
        const products = this.getAllProducts();
        
        if (!query || query.trim() === '') {
            return products;
        }

        const searchTerm = query.toLowerCase().trim();
        
        return products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }

    // Get products by category (if you want to add categories later)
    getProductsByCategory(category) {
        const products = this.getAllProducts();
        return products.filter(product => 
            product.category && product.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Get featured products (you can implement logic for featured products)
    getFeaturedProducts() {
        const products = this.getAllProducts();
        // For now, return first 6 products as featured
        // You can add a 'featured' field to products later
        return products.slice(0, 6);
    }

    // Get available products (quantity > 0)
    getAvailableProducts() {
        const products = this.getAllProducts();
        return products.filter(product => product.quantity > 0);
    }

    // Update product quantity after purchase
    updateProductQuantity(productId, quantitySold) {
        try {
            const product = this.getProductById(productId);
            
            if (!product) {
                return {
                    success: false,
                    message: 'Product not found.'
                };
            }

            const newQuantity = product.quantity - quantitySold;
            
            if (newQuantity < 0) {
                return {
                    success: false,
                    message: 'Insufficient product quantity.'
                };
            }

            return this.updateProduct(productId, { quantity: newQuantity });
        } catch (error) {
            console.error('Quantity update error:', error);
            return {
                success: false,
                message: 'Failed to update product quantity.'
            };
        }
    }

    // Get product statistics
    getProductStats() {
        const products = this.getAllProducts();
        
        return {
            totalProducts: products.length,
            availableProducts: products.filter(p => p.quantity > 0).length,
            outOfStockProducts: products.filter(p => p.quantity === 0).length,
            totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
        };
    }

    // Get farmer's product statistics
    getFarmerProductStats(farmerId) {
        const products = this.getProductsByFarmer(farmerId);
        
        return {
            totalProducts: products.length,
            availableProducts: products.filter(p => p.quantity > 0).length,
            outOfStockProducts: products.filter(p => p.quantity === 0).length,
            totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
        };
    }
}

// Create global instance
const productService = new ProductService();

// Export for ES6 modules
export default productService;