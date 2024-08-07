document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const themeBtn = document.querySelector('.theme-btn');
    const themeDropdown = document.querySelector('.theme-dropdown-content');
    const themeLinks = themeDropdown.querySelectorAll('a');
    const navbar = document.getElementById('navbar');

    // Get the stored theme from localStorage
    const storedTheme = localStorage.getItem('theme');
    // If a theme is stored, apply it
    if (storedTheme) {
        applyTheme(storedTheme);
    } else {
        // If no theme is stored, set the default theme to dark
        applyTheme('dark');
    }

    // Handle theme dropdown
    themeBtn.addEventListener('click', () => {
        themeDropdown.classList.toggle('show');
    });

    // Apply selected theme and store it in localStorage
    themeLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const theme = link.getAttribute('data-theme');
            applyTheme(theme);
            themeDropdown.classList.remove('show');
            localStorage.setItem('theme', theme);

            // Track theme change event in Google Analytics
            gtag('event', 'theme_change', {
                'event_category': 'Theme',
                'event_label': theme
            });
        });
    });

    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // Define routes
    function showTab(targetTab) {
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(targetTab).classList.add('active');

        tabs.forEach(tab => tab.classList.remove('active-tab'));
        document.querySelector(`.tab-link[data-tab="${targetTab}"]`).classList.add('active-tab');
    }

    page('/', () => showTab('home'));
    page('/home', () => showTab('home'));
    page('/about', () => showTab('about'));
    page('/work', () => showTab('work'));
    page('/blogs', () => showTab('blogs'));
    page('/contact', () => showTab('contact'));

    page();

    // Handle initial state
    const initialPath = window.location.pathname.split('/').filter(segment => segment !== '')[0];
    const initialTab = initialPath || 'home';
    document.getElementById(initialTab).classList.add('active');
    tabs.forEach(tab => {
        if (tab.dataset.tab === initialTab) {
            tab.classList.add('active-tab');
        }
    });
});

// Apply theme by updating body classes and CSS variables
function applyTheme(theme) {
    console.log(`Applying theme: ${theme}`);
    const themeClasses = ['theme-dark', 'theme-blue', 'theme-neutral', 'theme-monochrome'];
    try {
        themeClasses.forEach(cls => document.body.classList.remove(cls));
        document.body.classList.add(`theme-${theme}`);

        // Update the CSS variables based on the theme
        document.body.style.setProperty('--main-background', getThemeValue(`--main-background-${theme}`));
        document.body.style.setProperty('--main-text', getThemeValue(`--main-text-${theme}`));
        document.body.style.setProperty('--accent-color', getThemeValue(`--accent-color-${theme}`));
        document.body.style.setProperty('--hover-text-color', getThemeValue(`--hover-text-color-${theme}`));

    } catch (error) {
        console.error(`Error applying theme: ${error}`);
    }
}

// Get the value of the CSS variable
function getThemeValue(varName) {
    try {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    } catch (error) {
        console.error(`Error getting theme value: ${error}`);
        return null;
    }
}
