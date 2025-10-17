# Crop-Tap - Local Farm Marketplace

A simple, self-contained eCommerce platform for local farmers and buyers, built with HTML, CSS, and JavaScript using localStorage for data persistence.

## 🌱 Features

- **User Authentication**: Simple registration and login for farmers and buyers
- **Product Management**: Farmers can add, edit, and manage their product listings
- **Shopping Cart**: Buyers can add products to cart and manage quantities
- **Order Processing**: Complete order placement and tracking system
- **Payment Integration**: Stripe integration for secure payments (test mode)
- **Farmer Dashboard**: Manage products and track orders
- **Buyer Dashboard**: View order history and track order status
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
├── index.html                    # Main landing page (GitHub Pages ready)
├── FRONT/
│   ├── HTML/
│   │   ├── Login.html           # User login page
│   │   ├── signUp.html          # User registration page
│   │   ├── admin_dashboard.html # Farmer management dashboard
│   │   └── user_dashboard.html  # Buyer dashboard
│   ├── CSS/
│   │   ├── landing_page.css     # Landing page styles
│   │   ├── Login.css            # Login page styles
│   │   ├── signUp.css           # Registration page styles
│   │   ├── admin_dashboard.css  # Farmer dashboard styles
│   │   └── user_dashboard.css   # Buyer dashboard styles
│   ├── JS/
│   │   ├── storage.js           # localStorage service
│   │   ├── auth.js              # Authentication system
│   │   ├── products.js          # Product management
│   │   ├── cart.js              # Shopping cart functionality
│   │   ├── admin_dashboard.js   # Farmer dashboard logic
│   │   ├── user_dashboard.js    # Buyer dashboard logic
│   │   ├── Login.js             # Login page logic
│   │   ├── signUp.js            # Registration logic
│   │   └── landing_page.js      # Landing page functionality
│   └── ASSETS/
│       ├── Farmer 1.jpg         # Farmer images
│       ├── farmer 2.jpg
│       ├── tomatoe.avif         # Product images
│       ├── lettuce.jpg
│       ├── Banana.jpg
│       ├── carrot.jpg
│       ├── rice.jpg
│       └── oregano.jpg
└── README.md                    # This file
```

## 👥 User Roles

### Farmer
- Register and login to farmer account
- Add, edit, and delete product listings
- Upload product images (stored as base64)
- View and manage orders for their products
- Update order status (paid → shipped → completed)

### Buyer
- Register and login to buyer account
- Browse and search products from all farmers
- Add products to shopping cart
- Place orders and make payments
- Track order history and status

## 💾 Data Storage

All data is stored in the browser's localStorage, including:
- User accounts and authentication
- Product listings
- Shopping carts
- Orders and order items
- Payment records

**Note**: Data is stored locally in your browser and will persist between sessions, but will be lost if you clear browser data.

## 💳 Payment Integration

The application integrates with Stripe for payment processing:
- Uses Stripe.js for client-side payment handling
- Test mode enabled by default
- Simulates payment processing for demonstration

**Important**: Replace the test publishable key in `js/payment.js` with your own Stripe test key for actual payment processing.

## 🎨 Customization

### Styling
- Modify `styles/main.css` to customize the appearance
- Uses Bootstrap 5 for responsive design
- Font Awesome icons for UI elements

### Functionality
- All JavaScript modules are modular and can be easily modified
- localStorage service can be extended for additional data types
- Payment integration can be enhanced with webhook support

## 🔧 Development

### Adding New Features
1. Create new HTML pages as needed
2. Add corresponding JavaScript modules
3. Update the navigation in existing pages
4. Test functionality across different browsers

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
5. **Security**: For production use, implement proper server-side validation

## 🛠️ Troubleshooting

### Common Issues

1. **Data Not Saving**: Check if localStorage is enabled in your browser
2. **Images Not Loading**: Ensure image files are properly converted to base64
3. **Payment Errors**: Verify Stripe test keys are correctly configured

### Browser Developer Tools
Use F12 to open developer tools for:
- Console errors and debugging
- localStorage inspection
- Network requests monitoring

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