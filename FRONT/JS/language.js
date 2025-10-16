(function () {
    const STORAGE_KEY = 'cropTap_lang';
    const defaultLang = 'en';

    const translations = {
        en: {
            logo_text: 'Crop-Tap',
            search_placeholder: 'Search for fresh products...',
            mobile_search_placeholder: 'Search for fresh products...',
            nav_home: 'Home',
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
            herbs: 'Herbs'
        },
        fil: {
            logo_text: 'Crop-Tap',
            search_placeholder: 'Maghanap ng sariwang produkto...',
            mobile_search_placeholder: 'Maghanap ng sariwang produkto...',
            nav_home: 'Home',
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
            herbs: 'Mga Halaman'
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
