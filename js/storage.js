// localStorage Service for Crop-Tap
// Simple data management for the frontend-only application

// Helper function to get correct image path for GitHub Pages
function getImagePath(imageUrl) {
    console.log('🔍 getImagePath called with:', imageUrl);
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 Hostname:', window.location.hostname);
    console.log('🔍 Pathname:', window.location.pathname);
    
    // Check if we're on GitHub Pages (URL contains github.io)
    if (window.location.hostname.includes('github.io')) {
        // Extract repository name from URL
        const pathParts = window.location.pathname.split('/');
        const repoName = pathParts[1]; // Repository name is usually the first part after domain
        
        console.log('🔍 Path parts:', pathParts);
        console.log('🔍 Repository name:', repoName);
        
        if (repoName && repoName !== '') {
            // Return absolute path for GitHub Pages
            const fullPath = `/${repoName}/${imageUrl}`;
            console.log('🔍 Generated GitHub Pages path:', fullPath);
            return fullPath;
        }
    }
    
    // For local development or other hosting, use relative path
    console.log('🔍 Using relative path:', imageUrl);
    return imageUrl;
}

class StorageService {
    constructor() {
        this.initializeStorage();
    }

    // Initialize localStorage with empty arrays if they don't exist
    initializeStorage() {
        // Generate unique IDs for default products
        const generateDefaultId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
        
        const defaultData = {
            users: [
                {
                    user_id: 1,
                    name: "Juan Dela Cruz",
                    email: "consumer@gmail.com",
                    password: "Pass123",
                    role: "consumer",
                    phone: "09123456789",
                    address: "123 Main St, Manila",
                    avatar_url: null,
                    created_at: new Date().toISOString()
                },
                {
                    user_id: 2,
                    name: "Maria Santos",
                    email: "farmer@gmail.com",
                    password: "Pass123",
                    role: "farmer",
                    phone: "09876543210",
                    address: "456 Farm Road, Laguna",
                    avatar_url: null,
                    created_at: new Date().toISOString()
                },
                {
                    user_id: 3,
                    name: "Pedro Garcia",
                    email: "farmer2@gmail.com",
                    password: "Pass123",
                    role: "farmer",
                    phone: "09111222333",
                    address: "789 Agricultural Ave, Pangasinan",
                    avatar_url: null,
                    created_at: new Date().toISOString()
                }
            ],
            products: [
                // VEGETABLES (5 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2, // Maria Santos (farmer@gmail.com)
                    name: 'Kamatis',
                    description: 'Fresh red tomatoes',
                    price: 70.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'vegetables',
                    image_url: './assets/kamatis.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Sitaw',
                    description: 'Fresh string beans',
                    price: 15.00,
                    unit: 'kg',
                    quantity: 35,
                    category: 'vegetables',
                    image_url: './assets/sitaw.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Kalabasa',
                    description: 'Sweet squash',
                    price: 40.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'vegetables',
                    image_url: './assets/kalabasa.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Ampalaya',
                    description: 'Bitter gourd',
                    price: 60.00,
                    unit: 'kg',
                    quantity: 25,
                    category: 'vegetables',
                    image_url: './assets/ampalaya.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Pechay',
                    description: 'Chinese cabbage',
                    price: 50.00,
                    unit: 'kg',
                    quantity: 35,
                    category: 'vegetables',
                    image_url: './assets/pechay.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // FRUITS (5 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Mangga',
                    description: 'Sweet ripe mangoes',
                    price: 120.00,
                    unit: 'kg',
                    quantity: 25,
                    category: 'fruits',
                    image_url: './assets/mangga.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Lakatan',
                    description: 'Sweet bananas',
                    price: 50.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'fruits',
                    image_url: './assets/lakatan.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Kalamansi',
                    description: 'Fresh calamansi citrus',
                    price: 30.00,
                    unit: 'kg',
                    quantity: 40,
                    category: 'fruits',
                    image_url: './assets/kalamansi.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Pinya',
                    description: 'Sweet pineapples',
                    price: 80.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'fruits',
                    image_url: './assets/pinya.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Saging',
                    description: 'Cooking bananas',
                    price: 30.00,
                    unit: 'kg',
                    quantity: 40,
                    category: 'fruits',
                    image_url: './assets/saging.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // GRAINS (3 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Bigas',
                    description: 'Premium white rice',
                    price: 45.00,
                    unit: 'kg',
                    quantity: 100,
                    category: 'grains',
                    image_url: './assets/bigas.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Mais',
                    description: 'Fresh corn kernels',
                    price: 25.00,
                    unit: 'kg',
                    quantity: 50,
                    category: 'grains',
                    image_url: './assets/mais.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Oats',
                    description: 'Organic rolled oats',
                    price: 150.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'grains',
                    image_url: './assets/oats.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // HERBS (2 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Oregano',
                    description: 'Fresh oregano leaves',
                    price: 200.00,
                    unit: 'kg',
                    quantity: 15,
                    category: 'herbs',
                    image_url: './assets/oregano.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Basil',
                    description: 'Sweet basil leaves',
                    price: 180.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'herbs',
                    image_url: './assets/basil.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // FARMER 2 PRODUCTS (Pedro Garcia - farmer2@gmail.com)
                // VEGETABLES (5 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3, // Pedro Garcia (farmer2@gmail.com)
                    name: 'Talong',
                    description: 'Fresh eggplants',
                    price: 65.00,
                    unit: 'kg',
                    quantity: 25,
                    category: 'vegetables',
                    image_url: './assets/talong.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Okra',
                    description: 'Fresh okra pods',
                    price: 35.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'vegetables',
                    image_url: './assets/okra.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Patola',
                    description: 'Fresh sponge gourd',
                    price: 55.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'vegetables',
                    image_url: './assets/patola.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Mustasa',
                    description: 'Fresh mustard greens',
                    price: 45.00,
                    unit: 'kg',
                    quantity: 15,
                    category: 'vegetables',
                    image_url: './assets/mustasa.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Kangkong',
                    description: 'Fresh water spinach',
                    price: 30.00,
                    unit: 'kg',
                    quantity: 25,
                    category: 'vegetables',
                    image_url: './assets/kangkong.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // FRUITS (5 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Papaya',
                    description: 'Sweet ripe papaya',
                    price: 35.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'fruits',
                    image_url: './assets/papaya.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Guyabano',
                    description: 'Fresh soursop',
                    price: 80.00,
                    unit: 'kg',
                    quantity: 15,
                    category: 'fruits',
                    image_url: './assets/guyabano.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Santol',
                    description: 'Sweet santol fruit',
                    price: 25.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'fruits',
                    image_url: './assets/santol.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Lansones',
                    description: 'Fresh lanzones',
                    price: 90.00,
                    unit: 'kg',
                    quantity: 18,
                    category: 'fruits',
                    image_url: './assets/lansones.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Rambutan',
                    description: 'Fresh rambutan',
                    price: 75.00,
                    unit: 'kg',
                    quantity: 22,
                    category: 'fruits',
                    image_url: './assets/rambutan.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // GRAINS (3 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Monggo',
                    description: 'Premium mung beans',
                    price: 60.00,
                    unit: 'kg',
                    quantity: 40,
                    category: 'grains',
                    image_url: './assets/monggo.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Sesame',
                    description: 'Organic sesame seeds',
                    price: 120.00,
                    unit: 'kg',
                    quantity: 25,
                    category: 'grains',
                    image_url: './assets/sesame.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Quinoa',
                    description: 'Premium quinoa grains',
                    price: 200.00,
                    unit: 'kg',
                    quantity: 15,
                    category: 'grains',
                    image_url: './assets/quinoa.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // HERBS (2 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Mint',
                    description: 'Fresh mint leaves',
                    price: 150.00,
                    unit: 'kg',
                    quantity: 12,
                    category: 'herbs',
                    image_url: './assets/mint.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Rosemary',
                    description: 'Fresh rosemary sprigs',
                    price: 220.00,
                    unit: 'kg',
                    quantity: 10,
                    category: 'herbs',
                    image_url: './assets/rosemary.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ],
            carts: [],
            cart_items: [],
            orders: [],
            order_items: [],
            payments: [],
            subscriptions: []
            // Note: session is now handled by sessionStorage, not localStorage
        };

        Object.keys(defaultData).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(defaultData[key]));
            }
        });
        
        // Clean up any old session data from localStorage
        if (localStorage.getItem('session')) {
            localStorage.removeItem('session');
        }
    }

    // Reset storage with default test users (useful for testing)
    resetToDefaults() {
        // Generate unique IDs for default products
        const generateDefaultId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
        
        const defaultData = {
            users: [
                {
                    user_id: 1,
                    name: "Juan Dela Cruz",
                    email: "consumer@gmail.com",
                    password: "Pass123",
                    role: "consumer",
                    phone: "09123456789",
                    address: "123 Main St, Manila",
                    avatar_url: null,
                    created_at: new Date().toISOString()
                },
                {
                    user_id: 2,
                    name: "Maria Santos",
                    email: "farmer@gmail.com",
                    password: "Pass123",
                    role: "farmer",
                    phone: "09876543210",
                    address: "456 Farm Road, Laguna",
                    avatar_url: null,
                    created_at: new Date().toISOString()
                },
                {
                    user_id: 3,
                    name: "Pedro Garcia",
                    email: "farmer2@gmail.com",
                    password: "Pass123",
                    role: "farmer",
                    phone: "09111222333",
                    address: "789 Agricultural Ave, Pangasinan",
                    avatar_url: null,
                    created_at: new Date().toISOString()
                }
            ],
            products: [
                // VEGETABLES (5 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2, // Maria Santos (farmer@gmail.com)
                    name: 'Kamatis',
                    description: 'Fresh red tomatoes',
                    price: 70.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'vegetables',
                    image_url: './assets/kamatis.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Sitaw',
                    description: 'Fresh string beans',
                    price: 15.00,
                    unit: 'kg',
                    quantity: 35,
                    category: 'vegetables',
                    image_url: './assets/sitaw.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Kalabasa',
                    description: 'Sweet squash',
                    price: 40.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'vegetables',
                    image_url: './assets/kalabasa.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Ampalaya',
                    description: 'Bitter gourd',
                    price: 60.00,
                    unit: 'kg',
                    quantity: 25,
                    category: 'vegetables',
                    image_url: './assets/ampalaya.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Pechay',
                    description: 'Chinese cabbage',
                    price: 50.00,
                    unit: 'kg',
                    quantity: 35,
                    category: 'vegetables',
                    image_url: './assets/pechay.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // FRUITS (5 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Mangga',
                    description: 'Sweet ripe mangoes',
                    price: 120.00,
                    unit: 'kg',
                    quantity: 25,
                    category: 'fruits',
                    image_url: './assets/mangga.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Lakatan',
                    description: 'Sweet bananas',
                    price: 50.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'fruits',
                    image_url: './assets/lakatan.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Kalamansi',
                    description: 'Fresh calamansi citrus',
                    price: 30.00,
                    unit: 'kg',
                    quantity: 40,
                    category: 'fruits',
                    image_url: './assets/kalamansi.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Pinya',
                    description: 'Sweet pineapples',
                    price: 80.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'fruits',
                    image_url: './assets/pinya.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Saging',
                    description: 'Cooking bananas',
                    price: 30.00,
                    unit: 'kg',
                    quantity: 40,
                    category: 'fruits',
                    image_url: './assets/saging.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // GRAINS (3 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Bigas',
                    description: 'Premium white rice',
                    price: 45.00,
                    unit: 'kg',
                    quantity: 100,
                    category: 'grains',
                    image_url: './assets/bigas.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Mais',
                    description: 'Fresh corn kernels',
                    price: 25.00,
                    unit: 'kg',
                    quantity: 50,
                    category: 'grains',
                    image_url: './assets/mais.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Oats',
                    description: 'Organic rolled oats',
                    price: 150.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'grains',
                    image_url: './assets/oats.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // HERBS (2 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Oregano',
                    description: 'Fresh oregano leaves',
                    price: 200.00,
                    unit: 'kg',
                    quantity: 15,
                    category: 'herbs',
                    image_url: './assets/oregano.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 2,
                    name: 'Basil',
                    description: 'Sweet basil leaves',
                    price: 180.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'herbs',
                    image_url: './assets/basil.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // FARMER 2 PRODUCTS (Pedro Garcia - farmer2@gmail.com)
                // VEGETABLES (5 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3, // Pedro Garcia (farmer2@gmail.com)
                    name: 'Talong',
                    description: 'Fresh eggplants',
                    price: 65.00,
                    unit: 'kg',
                    quantity: 25,
                    category: 'vegetables',
                    image_url: './assets/talong.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Okra',
                    description: 'Fresh okra pods',
                    price: 35.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'vegetables',
                    image_url: './assets/okra.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Patola',
                    description: 'Fresh sponge gourd',
                    price: 55.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'vegetables',
                    image_url: './assets/patola.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Mustasa',
                    description: 'Fresh mustard greens',
                    price: 45.00,
                    unit: 'kg',
                    quantity: 15,
                    category: 'vegetables',
                    image_url: './assets/mustasa.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Kangkong',
                    description: 'Fresh water spinach',
                    price: 30.00,
                    unit: 'kg',
                    quantity: 25,
                    category: 'vegetables',
                    image_url: './assets/kangkong.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // FRUITS (5 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Papaya',
                    description: 'Sweet ripe papaya',
                    price: 35.00,
                    unit: 'kg',
                    quantity: 20,
                    category: 'fruits',
                    image_url: './assets/papaya.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Guyabano',
                    description: 'Fresh soursop',
                    price: 80.00,
                    unit: 'kg',
                    quantity: 15,
                    category: 'fruits',
                    image_url: './assets/guyabano.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Santol',
                    description: 'Sweet santol fruit',
                    price: 25.00,
                    unit: 'kg',
                    quantity: 30,
                    category: 'fruits',
                    image_url: './assets/santol.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Lansones',
                    description: 'Fresh lanzones',
                    price: 90.00,
                    unit: 'kg',
                    quantity: 18,
                    category: 'fruits',
                    image_url: './assets/lansones.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Rambutan',
                    description: 'Fresh rambutan',
                    price: 75.00,
                    unit: 'kg',
                    quantity: 22,
                    category: 'fruits',
                    image_url: './assets/rambutan.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // GRAINS (3 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Monggo',
                    description: 'Premium mung beans',
                    price: 60.00,
                    unit: 'kg',
                    quantity: 40,
                    category: 'grains',
                    image_url: './assets/monggo.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Sesame',
                    description: 'Organic sesame seeds',
                    price: 120.00,
                    unit: 'kg',
                    quantity: 25,
                    category: 'grains',
                    image_url: './assets/sesame.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Quinoa',
                    description: 'Premium quinoa grains',
                    price: 200.00,
                    unit: 'kg',
                    quantity: 15,
                    category: 'grains',
                    image_url: './assets/quinoa.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                
                // HERBS (2 products)
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Mint',
                    description: 'Fresh mint leaves',
                    price: 150.00,
                    unit: 'kg',
                    quantity: 12,
                    category: 'herbs',
                    image_url: './assets/mint.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: generateDefaultId(),
                    farmer_id: 3,
                    name: 'Rosemary',
                    description: 'Fresh rosemary sprigs',
                    price: 220.00,
                    unit: 'kg',
                    quantity: 10,
                    category: 'herbs',
                    image_url: './assets/rosemary.jpg',
                    is_available: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ],
            carts: [],
            cart_items: [],
            orders: [],
            order_items: [],
            payments: [],
            subscriptions: []
        };

        Object.keys(defaultData).forEach(key => {
            localStorage.setItem(key, JSON.stringify(defaultData[key]));
        });
        
        // Clear session
        sessionStorage.clear();
        
        console.log('Storage reset to defaults with test users and sample products');
    }

    // Generic get data method
    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error getting data for key ${key}:`, error);
            return null;
        }
    }

    // Generic save data method
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            
            // Trigger sync event for cross-tab communication (debounced)
            if (typeof window.TabSync !== 'undefined') {
                // Use a small delay to prevent excessive calls
                clearTimeout(this._syncTimeout);
                this._syncTimeout = setTimeout(() => {
                    window.TabSync.notifyChange(key, data);
                }, 10);
            }
            
            return true;
        } catch (error) {
            console.error(`Error saving data for key ${key}:`, error);
            return false;
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // User management
    createUser(userData) {
        const users = this.getData('users') || [];
        const newUser = {
            user_id: this.generateId(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // Simple storage - in real app, hash this
            role: userData.role,
            phone: userData.phone || null,
            address: userData.address || null,
            created_at: new Date().toISOString()
        };
        
        users.push(newUser);
        this.saveData('users', users);
        return newUser;
    }

    getUserByEmail(email) {
        const users = this.getData('users') || [];
        return users.find(user => user.email === email);
    }

    getUserById(userId) {
        const users = this.getData('users') || [];
        return users.find(user => user.user_id === userId);
    }

    // Product management
    createProduct(productData) {
        const products = this.getData('products') || [];
        const newProduct = {
            product_id: this.generateId(),
            farmer_id: productData.farmer_id,
            name: productData.name,
            description: productData.description,
            price: parseFloat(productData.price),
            unit: productData.unit || 'piece',
            quantity: parseInt(productData.quantity),
            category: productData.category || 'vegetables',
            image_url: productData.image_url || null,
            is_available: productData.is_available !== undefined ? productData.is_available : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        products.push(newProduct);
        this.saveData('products', products);
        
        // Trigger custom event for product creation
        if (typeof window.TabSync !== 'undefined') {
            window.TabSync.triggerEvent('product_created', newProduct);
        }
        
        return newProduct;
    }

    getProducts() {
        return this.getData('products') || [];
    }

    getProductsByFarmer(farmerId) {
        const products = this.getProducts();
        return products.filter(product => product.farmer_id === farmerId);
    }

    updateProduct(productId, updateData) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.product_id === productId);
        
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...updateData,
                updated_at: new Date().toISOString()
            };
            this.saveData('products', products);
            return products[index];
        }
        return null;
    }

    updateProductAvailability(productId, isAvailable) {
        const products = this.getProducts();
        const product = products.find(p => p.product_id === productId);
        if (product) {
            product.is_available = isAvailable;
            product.updated_at = new Date().toISOString();
            this.saveData('products', products);
            return true;
        }
        return false;
    }

    deleteProduct(productId) {
        const products = this.getProducts();
        const filteredProducts = products.filter(p => p.product_id !== productId);
        this.saveData('products', filteredProducts);
        return true;
    }

    // Cart management
    getOrCreateCart(userId) {
        const carts = this.getData('carts') || [];
        let cart = carts.find(c => c.buyer_id === userId);
        
        if (!cart) {
            cart = {
                cart_id: this.generateId(),
                buyer_id: userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            carts.push(cart);
            this.saveData('carts', carts);
        }
        
        return cart;
    }

    addToCart(userId, productId, quantity = 1) {
        const cart = this.getOrCreateCart(userId);
        const cartItems = this.getData('cart_items') || [];
        
        // Check if item already exists in cart
        const existingItem = cartItems.find(item => 
            item.cart_id === cart.cart_id && item.product_id === productId
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const newItem = {
                cart_item_id: this.generateId(),
                cart_id: cart.cart_id,
                product_id: productId,
                quantity: quantity,
                created_at: new Date().toISOString()
            };
            cartItems.push(newItem);
        }
        
        this.saveData('cart_items', cartItems);
        
        // Trigger custom event for cart update
        if (typeof window.TabSync !== 'undefined') {
            window.TabSync.triggerEvent('cart_updated', { userId, productId, quantity });
        }
        
        return true;
    }

    getCartItems(userId) {
        const cart = this.getOrCreateCart(userId);
        const cartItems = this.getData('cart_items') || [];
        const products = this.getProducts();
        
        return cartItems
            .filter(item => item.cart_id === cart.cart_id)
            .map(item => {
                const product = products.find(p => p.product_id === item.product_id);
                return {
                    ...item,
                    product: product
                };
            })
            .filter(item => item.product); // Only return items with valid products
    }

    updateCartItemQuantity(userId, productId, quantity) {
        const cart = this.getOrCreateCart(userId);
        const cartItems = this.getData('cart_items') || [];
        const item = cartItems.find(item => 
            item.cart_id === cart.cart_id && item.product_id === productId
        );
        
        if (item) {
            if (quantity <= 0) {
                // Remove item
                const filteredItems = cartItems.filter(i => i.cart_item_id !== item.cart_item_id);
                this.saveData('cart_items', filteredItems);
            } else {
                item.quantity = quantity;
                this.saveData('cart_items', cartItems);
            }
            return true;
        }
        return false;
    }

    clearCart(userId) {
        const cart = this.getOrCreateCart(userId);
        const cartItems = this.getData('cart_items') || [];
        const filteredItems = cartItems.filter(item => item.cart_id !== cart.cart_id);
        this.saveData('cart_items', filteredItems);
        return true;
    }

    // Order management
    createOrder(userId, cartItems) {
        const orders = this.getData('orders') || [];
        const orderItems = this.getData('order_items') || [];
        
        const order = {
            order_id: this.generateId(),
            buyer_id: userId,
            total_amount: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
            status: 'pending_payment',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        orders.push(order);
        
        // Create order items
        cartItems.forEach(cartItem => {
            const orderItem = {
                order_item_id: this.generateId(),
                order_id: order.order_id,
                product_id: cartItem.product_id,
                farmer_id: cartItem.product.farmer_id,
                quantity: cartItem.quantity,
                price: cartItem.product.price,
                created_at: new Date().toISOString()
            };
            orderItems.push(orderItem);
        });
        
        this.saveData('orders', orders);
        this.saveData('order_items', orderItems);
        
        // Trigger custom event for order creation
        if (typeof window.TabSync !== 'undefined') {
            window.TabSync.triggerEvent('order_placed', order);
        }
        
        return order;
    }

    getOrders() {
        return this.getData('orders') || [];
    }

    getOrdersByBuyer(buyerId) {
        const orders = this.getOrders();
        return orders.filter(order => order.buyer_id === buyerId);
    }

    getOrdersByFarmer(farmerId) {
        const orders = this.getOrders();
        const orderItems = this.getData('order_items') || [];
        
        // Get order IDs that contain products from this farmer
        const farmerOrderIds = orderItems
            .filter(item => item.farmer_id === farmerId)
            .map(item => item.order_id);
        
        return orders.filter(order => farmerOrderIds.includes(order.order_id));
    }

    updateOrderStatus(orderId, status) {
        const orders = this.getOrders();
        const order = orders.find(o => o.order_id === orderId);
        
        if (order) {
            order.status = status;
            order.updated_at = new Date().toISOString();
            this.saveData('orders', orders);
            return order;
        }
        return null;
    }

    // Payment management
    createPayment(orderId, paymentData) {
        const payments = this.getData('payments') || [];
        const payment = {
            payment_id: this.generateId(),
            order_id: orderId,
            amount: paymentData.amount,
            status: paymentData.status,
            payment_method: paymentData.payment_method || 'stripe',
            transaction_id: paymentData.transaction_id,
            created_at: new Date().toISOString()
        };
        
        payments.push(payment);
        this.saveData('payments', payments);
        return payment;
    }

    // Session management (using sessionStorage for auto-logout on browser close)
    setSession(user) {
        const session = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            avatar_url: user.avatar_url,
            login_time: new Date().toISOString()
        };
        // Use sessionStorage instead of localStorage for session data
        try {
            sessionStorage.setItem('session', JSON.stringify(session));
        } catch (error) {
            console.error('Error saving session:', error);
        }
        return session;
    }

    getSession() {
        try {
            const data = sessionStorage.getItem('session');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    }

    clearSession() {
        try {
            sessionStorage.removeItem('session');
        } catch (error) {
            console.error('Error clearing session:', error);
        }
    }

    isLoggedIn() {
        return this.getSession() !== null;
    }

    getCurrentUser() {
        const session = this.getSession();
        if (session) {
            // Return the full user data from users array, not just session data
            const fullUser = this.getUserById(session.user_id);
            return fullUser || session; // Fallback to session if user not found
        }
        return null;
    }

    // Subscription management methods
    createSubscription(subscriptionData) {
        const subscriptions = this.getData('subscriptions');
        const subscription = {
            id: this.generateId(),
            user_id: subscriptionData.user_id,
            plan: subscriptionData.plan, // 'monthly' or 'yearly'
            start_date: subscriptionData.start_date,
            due_date: subscriptionData.due_date,
            status: 'active', // 'active', 'expired', 'cancelled'
            created_at: new Date().toISOString()
        };
        
        subscriptions.push(subscription);
        this.saveData('subscriptions', subscriptions);
        return subscription;
    }

    getSubscriptionByUserId(userId) {
        const subscriptions = this.getData('subscriptions');
        return subscriptions.find(sub => sub.user_id === userId);
    }

    updateSubscription(subscriptionId, updateData) {
        const subscriptions = this.getData('subscriptions');
        const index = subscriptions.findIndex(sub => sub.id === subscriptionId);
        if (index !== -1) {
            subscriptions[index] = { ...subscriptions[index], ...updateData };
            this.saveData('subscriptions', subscriptions);
            return subscriptions[index];
        }
        return null;
    }

    calculateDueDate(startDate, plan) {
        const start = new Date(startDate);
        const dueDate = new Date(start);
        
        if (plan === 'yearly') {
            // Add 1 year for yearly subscription
            dueDate.setFullYear(dueDate.getFullYear() + 1);
        } else {
            // Add 30 days for monthly subscription
            dueDate.setDate(dueDate.getDate() + 30);
        }
        
        return dueDate.toISOString();
    }
}

// Create global instance
const storage = new StorageService();

// Global function for easy testing - can be called from browser console
window.resetToDefaults = function() {
    storage.resetToDefaults();
    console.log('✅ Data reset to defaults! You can now use:');
    console.log('👤 Consumer: consumer@gmail.com / Pass123');
    console.log('🌾 Farmer 1: farmer@gmail.com / Pass123');
    console.log('🌾 Farmer 2: farmer2@gmail.com / Pass123');
    console.log('📦 15 sample products have been added for each farmer account (30 total)');
};
