# Crop-Tap - Local Storage Based Marketplace

A simple, portable marketplace application for farmers and buyers built with HTML, CSS, and JavaScript using localStorage for data persistence.

## Features

### For Farmers
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order statuses
- **Data Management**: Export/import data, create sample data, clear all data
- **Dashboard**: View statistics and manage your farm products

### For Buyers
- **Browse Products**: Search and filter available products
- **Shopping Cart**: Add products to cart and manage quantities
- **Order History**: View past orders and their status
- **Data Export**: Export personal data for backup

## Getting Started

1. **Open the Application**: Simply open `landing_page.html` in your web browser
2. **Create Account**: Click "Sign Up" to create a farmer or buyer account
3. **Login**: Use your credentials to access the appropriate dashboard

## Data Storage

All data is stored in your browser's localStorage, making the application:
- **Portable**: No server required
- **Private**: Data stays on your device
- **Transferable**: Export/import data between devices

## File Structure

```
FRONT/
├── HTML/
│   ├── landing_page.html      # Main landing page
│   ├── Login.html             # Login page
│   ├── signUp.html            # Registration page
│   ├── admin_dashboard.html   # Farmer dashboard
│   └── user_dashboard.html    # Buyer dashboard
├── CSS/
│   ├── landing_page.css       # Landing page styles
│   ├── Login.css              # Login page styles
│   ├── signUp.css             # Registration page styles
│   ├── admin_dashboard.css    # Farmer dashboard styles
│   └── user_dashboard.css     # Buyer dashboard styles
├── JS/
│   ├── storage.js             # localStorage service
│   ├── auth.js                # Authentication service
│   ├── products.js            # Product management service
│   ├── cart.js                # Shopping cart service
│   ├── dataManager.js         # Data export/import service
│   ├── landing_page.js        # Landing page functionality
│   ├── Login.js               # Login functionality
│   ├── signUp.js              # Registration functionality
│   ├── admin_dashboard.js     # Farmer dashboard functionality
│   └── user_dashboard.js      # Buyer dashboard functionality
└── README.md                  # This file
```

## Data Models

The application uses the following data structures in localStorage:

- **users**: User accounts (farmers and buyers)
- **products**: Product listings from farmers
- **carts**: Shopping cart data
- **cart_items**: Individual items in carts
- **orders**: Order records
- **order_items**: Individual items in orders
- **payments**: Payment records
- **session**: Current user session

## Data Management

### Export Data
- **Farmers**: Use the "Data Management" section in the farmer dashboard
- **Buyers**: Click "Export Data" in the user menu

### Import Data
- **Farmers**: Use the "Data Management" section to import previously exported data
- **Buyers**: Contact support for data import assistance

### Sample Data
- **Farmers**: Use "Create Sample Data" in the Data Management section to populate the app with test data

## Browser Compatibility

This application works in all modern browsers that support:
- localStorage API
- HTML5 File API
- ES6 JavaScript features

## Security Notes

- Passwords are stored in plain text (for demo purposes)
- In a production environment, implement proper password hashing
- All data is stored locally - no external servers involved

## Troubleshooting

### Data Not Loading
- Check browser console for errors
- Ensure localStorage is enabled in your browser
- Try refreshing the page

### Export/Import Issues
- Ensure you're using a modern browser
- Check file permissions for downloads
- Verify JSON file format for imports

## Support

For issues or questions:
1. Check the browser console for error messages
2. Ensure all JavaScript files are loading correctly
3. Verify localStorage is available and not full

## License

This is a demo application for educational purposes.
