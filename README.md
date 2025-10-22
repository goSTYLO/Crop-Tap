# Crop-Tap - Local Farm Marketplace

A simple, self-contained eCommerce platform for local farmers and buyers, built with HTML, CSS, and JavaScript using localStorage for data persistence. Features real-time multi-tab synchronization for seamless multi-user experiences.

## 🌱 Features

- **User Authentication**: Simple registration and login for farmers and buyers
- **Product Management**: Farmers can add, edit, and manage their product listings with real-time stock updates
- **Shopping Cart**: Buyers can add products to cart and manage quantities
- **Order Processing**: Complete order placement and tracking system
- **Payment Integration**: Stripe integration for secure payments (test mode)
- **Farmer Dashboard**: Manage products and track orders with live updates
- **Buyer Dashboard**: View order history and track order status
- **Real-Time Multi-Tab Sync**: Live updates across multiple browser tabs/windows
- **Visual Notifications**: Toast notifications for real-time updates
- **Sample Data**: Pre-loaded with 30 sample products with images
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Modern web browser with localStorage support
- No server setup required - runs entirely in the browser!

### Installation

1. **Download/Clone** the project files to your local machine
2. **Open** `index.html` in your web browser
3. **Start using** the application immediately!

### Project Structure

```
Crop-Tap/
├── index.html              # Main marketplace page
├── login.html              # User login page
├── register.html           # User registration page
├── cart.html               # Shopping cart page
├── checkout.html           # Payment and checkout page
├── order-confirmation.html # Order confirmation page
├── user_dashboard.html     # Consumer dashboard
├── admin_dashboard.html    # Farmer management dashboard
├── assets/                 # Product images and media
│   └── *.jpg              # Sample product images
├── styles/
│   └── main.css           # Main stylesheet
├── js/
│   ├── storage.js         # localStorage service with sync triggers
│   ├── auth.js            # Authentication system
│   ├── products.js        # Product management
│   ├── cart.js            # Shopping cart functionality
│   ├── payment.js         # Payment processing
│   ├── landing_page.js    # Main marketplace logic
│   ├── user_dashboard.js  # Consumer dashboard logic
│   ├── admin_dashboard.js # Farmer dashboard logic
│   └── sync.js            # Real-time multi-tab synchronization
├── FRONT/                 # Alternative frontend structure
│   ├── HTML/              # HTML files
│   └── JS/                # JavaScript files
└── README.md              # This file
```

## 👥 User Roles

### Farmer (Admin Dashboard)
- Register and login to farmer account
- Add, edit, and delete product listings with real-time updates
- Upload product images (stored as base64 or linked to assets folder)
- View and manage orders for their products with live notifications
- Update order status (paid → shipped → completed) with instant sync
- Real-time dashboard with live statistics and order updates
- Stock management with immediate availability updates

### Consumer (User Dashboard)
- Register and login to consumer account
- Browse and search products from all farmers with live stock updates
- Add products to shopping cart with real-time quantity validation
- Place orders and make payments
- Track order history and status with live updates
- Receive real-time notifications for order status changes

## 💾 Data Storage

All data is stored in the browser's localStorage, including:
- User accounts and authentication
- Product listings with images and stock information
- Shopping carts
- Orders and order items
- Payment records

**Real-Time Synchronization**: The application uses localStorage events and custom event systems to synchronize data across multiple browser tabs/windows in real-time. Changes made in one tab are immediately reflected in all other open tabs.

**Note**: Data is stored locally in your browser and will persist between sessions, but will be lost if you clear browser data.

## 💳 Payment Integration

The application integrates with Stripe for payment processing:
- Uses Stripe.js for client-side payment handling
- Test mode enabled by default
- Simulates payment processing for demonstration

**Important**: Replace the test publishable key in `js/payment.js` with your own Stripe test key for actual payment processing.

## 🔄 Real-Time Multi-Tab Synchronization

The application features a sophisticated real-time synchronization system that allows multiple users to interact with the platform simultaneously across different browser tabs or windows.

### How It Works
- **Storage Events**: Uses browser localStorage events to detect changes across tabs
- **Custom Event System**: Implements custom events for specific actions (product updates, order changes, cart modifications)
- **Debounced Updates**: Optimized to prevent excessive UI updates and improve performance
- **Visual Notifications**: Toast notifications inform users of real-time changes

### Supported Real-Time Updates
- **Product Management**: Stock changes, availability updates, new products
- **Order Processing**: Status changes, new orders, order modifications
- **Shopping Cart**: Cart updates, quantity changes
- **User Actions**: Login/logout status across tabs

### Demo Scenarios
1. **Farmer-Consumer Demo**: Open admin dashboard in one tab, user dashboard in another
   - Farmer updates product stock → Consumer sees changes immediately
   - Consumer places order → Farmer receives notification instantly
2. **Multi-User Shopping**: Multiple consumers can shop simultaneously with live stock updates

## 🎨 Customization

### Styling
- Modify `styles/main.css` to customize the appearance
- Uses Bootstrap 5 for responsive design
- Font Awesome icons for UI elements
- Custom toast notification styles for real-time updates

### Functionality
- All JavaScript modules are modular and can be easily modified
- localStorage service can be extended for additional data types
- Payment integration can be enhanced with webhook support
- Real-time sync system can be extended for additional data types
- Sample product data can be customized in `js/storage.js`

## 🔧 Development

### Adding New Features
1. Create new HTML pages as needed
2. Add corresponding JavaScript modules
3. Update the navigation in existing pages
4. Add sync triggers to `js/storage.js` for real-time updates
5. Implement refresh functions in page-specific JavaScript files
6. Test functionality across different browsers and tabs

### Data Backup
To backup your data:
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Copy localStorage data
4. Save to a text file for backup

## 🌐 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚨 Important Notes

1. **Data Persistence**: All data is stored locally in your browser
2. **No Server Required**: Runs entirely client-side
3. **Portable**: Copy the entire folder to any device to use
4. **Test Mode**: Payment integration is in test mode
5. **Real-Time Sync**: Multi-tab synchronization works within the same browser instance
6. **Sample Data**: Includes 30 pre-loaded products with images for immediate testing
7. **Security**: For production use, implement proper server-side validation

## 🛠️ Troubleshooting

### Common Issues

1. **Data Not Saving**: Check if localStorage is enabled in your browser
2. **Images Not Loading**: Ensure image files are in the `assets/` folder or properly converted to base64
3. **Payment Errors**: Verify Stripe test keys are correctly configured
4. **Real-Time Updates Not Working**: Ensure both tabs are from the same origin and localStorage is enabled
5. **Sync Performance Issues**: Check browser console for excessive event firing (debouncing should prevent this)

### Browser Developer Tools
Use F12 to open developer tools for:
- Console errors and debugging
- localStorage inspection
- Network requests monitoring
- Real-time sync event monitoring (look for 🔄 sync logs)
- Performance monitoring for multi-tab scenarios

## 📄 License

This project is for educational purposes. Feel free to modify and use as needed.

## 🤝 Contributing

This is a simple, self-contained project. Feel free to:
- Add new features
- Improve the UI/UX
- Fix bugs
- Optimize performance

---

**Happy Farming! 🌱**