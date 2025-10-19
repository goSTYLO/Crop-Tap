(function () {
    const STORAGE_KEY = 'cropTap_lang';
    const defaultLang = 'en';

    const translations = {
        en: {
            logo_text: 'Crop-Tap',
            search_placeholder: 'Search for fresh products...',
            mobile_search_placeholder: 'Search for fresh products...',
            nav_home: 'Home',
            nav_dashboard: 'Dashboard',
            nav_farmers: 'Farmers',
            nav_products: 'All Products',
            nav_orders: 'My Orders',
            nav_profile: 'Profile',
            nav_settings: 'Settings',
            settings_title: 'Settings',
            farmers_nav: 'Our Farmers',
            myorders: 'My Orders',
            myprofile: 'My Profile',
            personalinfo: 'Personal Information',
            fullname: 'Full Name',
            email: 'Email',
            phone: 'Phone Number',
            delivery: 'Delivery Address',
            profile_image: 'Profile Image',
            update_profile: 'Update Profile',
            settings_language_label: 'Language',
            settings_language_desc: 'Choose your preferred language for the interface.',
            settings_select_label: 'Select language:',
            language_english: 'English',
            language_filipino: 'Filipino',
            featured_products: 'Featured Products',
            view_all: 'View All',
            browse_products: 'Browse Products',
            filter_all: 'All Products',
            filter_vegetables: 'Vegetables',
            filter_fruits: 'Fruits',
            filter_grains: 'Grains',
            filter_herbs: 'Herbs',
            cart_header: 'Shopping Cart',
            checkout_proceed: 'Proceed to Checkout',
            lang_status: 'Language updated to English ✅',
            add_to_cart: 'Add to Cart',
            stock_in: '{count} in stock',
            unit_per: 'per {unit}',
            no_products: 'No products available',
            no_orders: 'No orders yet',
            products_available: '{count} products available',
            all_products: 'All Products',
            vegetables: 'Vegetables',
            fruits: 'Fruits',
            grains: 'Grains',
            herbs: 'Herbs',
            // Admin Dashboard translations
            dashboard_title: 'Dashboard',
            product_management: 'Product Management',
            total_products: 'Total Products',
            total_orders: 'Total Orders',
            pending_orders: 'Pending Orders',
            total_users: 'Total Users',
            add_product: 'Add Product',
            edit_product: 'Edit Product',
            delete_product: 'Delete Product',
            product_name: 'Product Name',
            product_price: 'Price',
            product_quantity: 'Quantity',
            product_unit: 'Unit',
            product_description: 'Description',
            product_category: 'Category',
            product_image: 'Product Image',
            save_product: 'Save Product',
            cancel: 'Cancel',
            actions: 'Actions',
            no_products_yet: 'No products added yet.',
            add_first_product: 'Add your first product',
            no_orders_yet: 'No orders received yet.',
            order_id: 'Order ID',
            buyer: 'Buyer',
            items: 'Items',
            total_amount: 'Total Amount',
            status: 'Status',
            date: 'Date',
            update_status: 'Update Status',
            profile_title: 'Profile',
            personal_information: 'Personal Information',
            full_name: 'Full Name',
            email_address: 'Email Address',
            phone_number: 'Phone Number',
            address: 'Address',
            profile_image: 'Profile Image',
            update_profile: 'Update Profile',
            site_settings: 'Site Settings',
            general_settings: 'General Settings',
            site_name: 'Site Name',
            contact_email: 'Contact Email',
            contact_phone: 'Contact Phone',
            currency: 'Currency',
            site_description: 'Site Description',
            save_settings: 'Save Settings',
            data_management: 'Data Management',
            export_data: 'Export Data',
            import_data: 'Import Data',
            create_sample_data: 'Create Sample Data',
            clear_all_data: 'Clear All Data',
            refresh_stats: 'Refresh Stats',
            total_users_count: 'Total Users',
            total_products_count: 'Total Products',
            total_orders_count: 'Total Orders',
            total_payments_count: 'Total Payments',
            farmer: 'Farmer',
            consumer: 'Consumer',
            active: 'Active',
            inactive: 'Inactive',
            pending: 'Pending',
            confirmed: 'Confirmed',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
            kg: 'kg',
            piece: 'piece',
            box: 'box',
            bag: 'bag',
            // User Dashboard translations
            welcome_back: 'Welcome back!',
            subscription_details: 'Subscription Details',
            subscription_plan: 'Plan',
            subscription_status: 'Status',
            subscription_start_date: 'Start Date',
            subscription_due_date: 'Due Date',
            free_trial: 'Free Trial',
            monthly_plan: 'Monthly Plan',
            yearly_plan: 'Yearly Plan',
            active_status: 'Active',
            expiring_soon: 'Expiring Soon',
            expired: 'Expired',
            subscribe_now: 'Subscribe Now',
            renew_subscription: 'Renew Subscription',
            personal_information: 'Personal Information',
            full_name: 'Full Name',
            email_address: 'Email Address',
            phone_number: 'Phone Number',
            delivery_address: 'Delivery Address',
            profile_image: 'Profile Image',
            update_profile: 'Update Profile',
            shopping_cart: 'Shopping Cart',
            proceed_to_checkout: 'Proceed to Checkout',
            my_orders: 'My Orders',
            track_order: 'Track Order',
            our_farmers: 'Our Farmers',
            products_available: 'products available',
            no_products_available: 'No products available',
            no_orders_yet: 'No orders yet',
            choose_file: 'Choose File',
            no_file_chosen: 'No file chosen'
        },
        fil: {
            logo_text: 'Crop-Tap',
            search_placeholder: 'Maghanap ng sariwang produkto...',
            mobile_search_placeholder: 'Maghanap ng sariwang produkto...',
            nav_home: 'Home',
            nav_dashboard: 'Dashboard',
            nav_farmers: 'Magsasaka',
            nav_products: 'Lahat ng Produkto',
            nav_orders: 'Aking Mga Order',
            nav_profile: 'Impormasyon',
            nav_settings: 'Mga Setting',
            settings_title: 'Mga Setting',
            farmers_nav: 'Aming mga Magsasaka',
            myorders: 'Aking Mga Order',
            myprofile: 'Impormasyon',
            personalinfo: 'Sariling Impormasyon',
            fullname: 'Buong Pangalan',
            email: 'E-liham',
            phone: 'Numero ng Telepono',
            delivery: 'Address ng Paghahatid',
            profile_image: 'Larawan ng Impormasyon',
            update_profile: 'I-update ang Profile',
            settings_language_label: 'Wika',
            settings_language_desc: 'Piliin ang nais mong wika para sa interface.',
            settings_select_label: 'Piliin ang wika:',
            language_english: 'Ingles',
            language_filipino: 'Filipino',
            featured_products: 'Itinatampok na Produkto',
            view_all: 'Tingnan Lahat',
            browse_products: 'Mag-browse ng Mga Produkto',
            filter_all: 'Lahat ng Produkto',
            filter_vegetables: 'Mga Gulay',
            filter_fruits: 'Mga Prutas',
            filter_grains: 'Mga Butil',
            filter_herbs: 'Mga Halaman',
            cart_header: 'Bag ng Pamimili',
            checkout_proceed: 'Magpatuloy sa Pag-checkout',
            lang_status: 'Ang wika ay na-update sa Filipino ✅',
            add_to_cart: 'Idagdag sa Bag',
            stock_in: '{count} magagamit',
            unit_per: 'bawat {unit}',
            no_products: 'Walang magagamit na produkto',
            no_orders: 'Wala pang order',
            products_available: '{count} produktong magagamit',
            all_products: 'Lahat ng Produkto',
            vegetables: 'Mga Gulay',
            fruits: 'Mga Prutas',
            grains: 'Mga Butil',
            herbs: 'Mga Halaman',
            // Admin Dashboard translations
            dashboard_title: 'Dashboard',
            product_management: 'Pamamahala ng Produkto',
            total_products: 'Kabuuang Produkto',
            total_orders: 'Kabuuang Order',
            pending_orders: 'Nakabinbing Order',
            total_users: 'Kabuuang User',
            add_product: 'Magdagdag ng Produkto',
            edit_product: 'I-edit ang Produkto',
            delete_product: 'Tanggalin ang Produkto',
            product_name: 'Pangalan ng Produkto',
            product_price: 'Presyo',
            product_quantity: 'Dami',
            product_unit: 'Yunit',
            product_description: 'Paglalarawan',
            product_category: 'Kategorya',
            product_image: 'Larawan ng Produkto',
            save_product: 'I-save ang Produkto',
            cancel: 'Kanselahin',
            actions: 'Mga Aksyon',
            no_products_yet: 'Wala pang produkto na naidagdag.',
            add_first_product: 'Magdagdag ng unang produkto',
            no_orders_yet: 'Wala pang natatanggap na order.',
            order_id: 'ID ng Order',
            buyer: 'Bumibili',
            items: 'Mga Item',
            total_amount: 'Kabuuang Halaga',
            status: 'Katayuan',
            date: 'Petsa',
            update_status: 'I-update ang Katayuan',
            profile_title: 'Profile',
            personal_information: 'Personal na Impormasyon',
            full_name: 'Buong Pangalan',
            email_address: 'Email Address',
            phone_number: 'Numero ng Telepono',
            address: 'Address',
            profile_image: 'Larawan ng Profile',
            update_profile: 'I-update ang Profile',
            site_settings: 'Mga Setting ng Site',
            general_settings: 'Pangkalahatang Setting',
            site_name: 'Pangalan ng Site',
            contact_email: 'Contact Email',
            contact_phone: 'Contact Phone',
            currency: 'Currency',
            site_description: 'Paglalarawan ng Site',
            save_settings: 'I-save ang Setting',
            data_management: 'Pamamahala ng Data',
            export_data: 'I-export ang Data',
            import_data: 'I-import ang Data',
            create_sample_data: 'Gumawa ng Sample Data',
            clear_all_data: 'Burahin ang Lahat ng Data',
            refresh_stats: 'I-refresh ang Stats',
            total_users_count: 'Kabuuang User',
            total_products_count: 'Kabuuang Produkto',
            total_orders_count: 'Kabuuang Order',
            total_payments_count: 'Kabuuang Bayad',
            farmer: 'Magsasaka',
            consumer: 'Mamimili',
            active: 'Aktibo',
            inactive: 'Hindi Aktibo',
            pending: 'Nakabinbing',
            confirmed: 'Nakumpirma',
            delivered: 'Naihatid',
            cancelled: 'Nakansela',
            kg: 'kg',
            piece: 'piraso',
            box: 'kahon',
            bag: 'bag',
            // User Dashboard translations
            welcome_back: 'Maligayang pagbabalik!',
            subscription_details: 'Mga Detalye ng Subscription',
            subscription_plan: 'Plano',
            subscription_status: 'Katayuan',
            subscription_start_date: 'Petsa ng Simula',
            subscription_due_date: 'Petsa ng Pagbabayad',
            free_trial: 'Libreng Trial',
            monthly_plan: 'Buwanang Plano',
            yearly_plan: 'Taunang Plano',
            active_status: 'Aktibo',
            expiring_soon: 'Malapit nang Mag-expire',
            expired: 'Nag-expire na',
            subscribe_now: 'Mag-subscribe Ngayon',
            renew_subscription: 'I-renew ang Subscription',
            personal_information: 'Personal na Impormasyon',
            full_name: 'Buong Pangalan',
            email_address: 'Email Address',
            phone_number: 'Numero ng Telepono',
            delivery_address: 'Address ng Paghahatid',
            profile_image: 'Larawan ng Profile',
            update_profile: 'I-update ang Profile',
            shopping_cart: 'Bag ng Pamimili',
            proceed_to_checkout: 'Magpatuloy sa Pag-checkout',
            my_orders: 'Aking Mga Order',
            track_order: 'I-track ang Order',
            our_farmers: 'Aming mga Magsasaka',
            products_available: 'produktong magagamit',
            no_products_available: 'Walang magagamit na produkto',
            no_orders_yet: 'Wala pang order',
            choose_file: 'Pumili ng File',
            no_file_chosen: 'Walang napiling file'
        }
    };

    function getSavedLang() {
        return localStorage.getItem(STORAGE_KEY) || defaultLang;
    }

    function saveLang(lang) {
        localStorage.setItem(STORAGE_KEY, lang);
    }

    function translatePage(lang) {
        const dict = translations[lang] || translations[defaultLang];

        // Static elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key && dict[key]) el.innerText = dict[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key && dict[key]) el.setAttribute('placeholder', dict[key]);
        });

        document.querySelectorAll('option[data-i18n]').forEach(opt => {
            const key = opt.getAttribute('data-i18n');
            if (key && dict[key]) opt.innerText = dict[key];
        });
    }

    // Dynamic translation for content generated later
    function translateDynamicText() {
        const lang = getSavedLang();
        const dict = translations[lang] || translations[defaultLang];

        document.querySelectorAll('[data-i18n-dynamic]').forEach(el => {
            const key = el.getAttribute('data-i18n-dynamic');
            if (!key) return;

            let text = dict[key] || el.innerText;

            // Replace dynamic placeholders
            if (el.dataset.count) text = text.replace('{count}', el.dataset.count);
            if (el.dataset.unit) text = text.replace('{unit}', el.dataset.unit);

            el.innerText = text;
        });
    }

    function setLanguage(lang) {
        saveLang(lang);
        translatePage(lang);
        translateDynamicText();
        showLanguageStatus(lang);
    }

    function showLanguageStatus(lang) {
        const statusEl = document.getElementById('languageStatus');
        if (statusEl) {
            statusEl.textContent = translations[lang].lang_status;
            statusEl.style.opacity = '1';
            setTimeout(() => {
                statusEl.style.opacity = '0';
            }, 3000);
        }
    }

    function initLanguageControls() {
        const select = document.getElementById('languageSelect');
        if (!select) return;
        const saved = getSavedLang();
        select.value = saved;

        select.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const lang = getSavedLang();
        translatePage(lang);
        translateDynamicText();
        initLanguageControls();
    });

    window.setLanguage = setLanguage;
    window.translateDynamicText = translateDynamicText;
})();
