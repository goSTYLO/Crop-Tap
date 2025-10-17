// Data Manager for Crop-Tap
// Handles data export/import and file management

class DataManager {
    constructor() {
        this.storage = storage; // Use the global storage instance
    }

    // Export all data to JSON file
    exportData() {
        try {
            const allData = {
                users: this.storage.getData('users') || [],
                products: this.storage.getData('products') || [],
                carts: this.storage.getData('carts') || [],
                cart_items: this.storage.getData('cart_items') || [],
                orders: this.storage.getData('orders') || [],
                order_items: this.storage.getData('order_items') || [],
                payments: this.storage.getData('payments') || [],
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const dataStr = JSON.stringify(allData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `crop-tap-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            return {
                success: true,
                message: 'Data exported successfully!'
            };
        } catch (error) {
            console.error('Export error:', error);
            return {
                success: false,
                message: 'Failed to export data.'
            };
        }
    }

    // Import data from JSON file
    importData(file) {
        return new Promise((resolve) => {
            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        
                        // Validate data structure
                        if (!this.validateDataStructure(importedData)) {
                            resolve({
                                success: false,
                                message: 'Invalid data format. Please check the file.'
                            });
                            return;
                        }

                        // Import data
                        Object.keys(importedData).forEach(key => {
                            if (key !== 'exportDate' && key !== 'version') {
                                this.storage.saveData(key, importedData[key]);
                            }
                        });

                        resolve({
                            success: true,
                            message: 'Data imported successfully!'
                        });
                    } catch (parseError) {
                        console.error('Parse error:', parseError);
                        resolve({
                            success: false,
                            message: 'Failed to parse the file. Please check the format.'
                        });
                    }
                };
                
                reader.onerror = () => {
                    resolve({
                        success: false,
                        message: 'Failed to read the file.'
                    });
                };
                
                reader.readAsText(file);
            } catch (error) {
                console.error('Import error:', error);
                resolve({
                    success: false,
                    message: 'Failed to import data.'
                });
            }
        });
    }

    // Validate imported data structure
    validateDataStructure(data) {
        const requiredKeys = ['users', 'products', 'carts', 'cart_items', 'orders', 'order_items', 'payments'];
        
        for (const key of requiredKeys) {
            if (!data.hasOwnProperty(key) || !Array.isArray(data[key])) {
                return false;
            }
        }
        
        return true;
    }

    // Create sample data for testing
    createSampleData() {
        try {
            // Sample users
            const sampleUsers = [
                {
                    user_id: 'user_1',
                    name: 'Juan Dela Cruz',
                    email: 'juan@farmer.com',
                    password: 'password123',
                    role: 'farmer',
                    phone: '09123456789',
                    address: 'Pangasinan, Philippines',
                    created_at: new Date().toISOString()
                },
                {
                    user_id: 'user_2',
                    name: 'Maria Santos',
                    email: 'maria@buyer.com',
                    password: 'password123',
                    role: 'consumer',
                    phone: '09234567890',
                    address: 'Manila, Philippines',
                    created_at: new Date().toISOString()
                }
            ];

            // Sample products
            const sampleProducts = [
                {
                    product_id: 'prod_1',
                    farmer_id: 'user_1',
                    name: 'Organic Tomatoes',
                    description: 'Fresh organic tomatoes from local farms',
                    price: 85.00,
                    unit: 'kg',
                    quantity: 50,
                    image_url: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: 'prod_2',
                    farmer_id: 'user_1',
                    name: 'Sweet Corn',
                    description: 'Sweet and tender corn kernels',
                    price: 120.00,
                    unit: 'kg',
                    quantity: 30,
                    image_url: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    product_id: 'prod_3',
                    farmer_id: 'user_1',
                    name: 'Fresh Lettuce',
                    description: 'Crisp and fresh lettuce heads',
                    price: 65.00,
                    unit: 'head',
                    quantity: 45,
                    image_url: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ];

            // Save sample data
            this.storage.saveData('users', sampleUsers);
            this.storage.saveData('products', sampleProducts);
            this.storage.saveData('carts', []);
            this.storage.saveData('cart_items', []);
            this.storage.saveData('orders', []);
            this.storage.saveData('order_items', []);
            this.storage.saveData('payments', []);

            return {
                success: true,
                message: 'Sample data created successfully!'
            };
        } catch (error) {
            console.error('Sample data creation error:', error);
            return {
                success: false,
                message: 'Failed to create sample data.'
            };
        }
    }

    // Clear all data
    clearAllData() {
        try {
            const defaultData = {
                users: [],
                products: [],
                carts: [],
                cart_items: [],
                orders: [],
                order_items: [],
                payments: [],
                session: null
            };

            Object.keys(defaultData).forEach(key => {
                this.storage.saveData(key, defaultData[key]);
            });

            return {
                success: true,
                message: 'All data cleared successfully!'
            };
        } catch (error) {
            console.error('Clear data error:', error);
            return {
                success: false,
                message: 'Failed to clear data.'
            };
        }
    }

    // Get data statistics
    getDataStats() {
        try {
            const stats = {
                users: (this.storage.getData('users') || []).length,
                products: (this.storage.getData('products') || []).length,
                orders: (this.storage.getData('orders') || []).length,
                payments: (this.storage.getData('payments') || []).length,
                lastUpdated: new Date().toISOString()
            };

            return {
                success: true,
                stats: stats
            };
        } catch (error) {
            console.error('Stats error:', error);
            return {
                success: false,
                message: 'Failed to get data statistics.'
            };
        }
    }
}

// Create global instance
const dataManager = new DataManager();
