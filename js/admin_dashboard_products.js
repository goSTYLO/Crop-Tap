// Admin Dashboard Product Management
// Handles all product-related operations

class AdminDashboardProducts {
    constructor(adminDashboard) {
        this.adminDashboard = adminDashboard;
    }

    loadProductsTable() {
        const products = productService.getAllProducts();
        const tbody = document.querySelector('#productsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        products.forEach(product => {
            const row = this.createProductRow(product);
            tbody.appendChild(row);
        });
    }

    createProductRow(product) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image || 'assets/placeholder.jpg'}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₱${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>${product.unit}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="adminDashboard.products.editProduct(${product.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="adminDashboard.products.deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        return row;
    }

    handleProductSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            quantity: parseInt(formData.get('quantity')),
            unit: formData.get('unit'),
            description: formData.get('description'),
            image: formData.get('image') || 'assets/placeholder.jpg'
        };

        const result = productService.createProduct(productData);
        if (result.success) {
            alert('Product added successfully!');
            e.target.reset();
            this.loadProductsTable();
            this.adminDashboard.stats.updateDashboardStats();
        } else {
            alert('Error adding product: ' + result.message);
        }
    }

    editProduct(id) {
        const product = productService.getProductById(id);
        if (!product) return;

        // Fill form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productUnit').value = product.unit;
        document.getElementById('productDescription').value = product.description;

        // Change form to edit mode
        const form = document.getElementById('productForm');
        form.dataset.editId = id;
        form.querySelector('button[type="submit"]').textContent = 'Update Product';
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            const result = productService.deleteProduct(id);
            if (result.success) {
                alert('Product deleted successfully!');
                this.loadProductsTable();
                this.adminDashboard.stats.updateDashboardStats();
            } else {
                alert('Error deleting product: ' + result.message);
            }
        }
    }
}
