/* ============================================
   OMNI.DAILY - COMPLETE JAVASCRIPT
   All interactive functionality and features
   ============================================ */

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all features
    setupMobileMenu();
    setupSmoothScrolling();
    setupSearch();
    setupBackToTop();
    setupHeaderScroll();
    setupToolCards();
    setupCategoryFilter();
    setupLazyLoading();
    
    console.log('Omni.Daily initialized successfully!');
}

// ============================================
// MOBILE MENU
// ============================================
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (!mobileMenuBtn || !mobileNav) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuBtn.contains(event.target) && !mobileNav.contains(event.target)) {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty hrefs or just #
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const toolsGrid = document.getElementById('toolsGrid');
    
    if (!searchInput || !toolsGrid) return;
    
    const toolCards = toolsGrid.querySelectorAll('.tool-card');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        let visibleCount = 0;
        
        toolCards.forEach(card => {
            const title = card.querySelector('.tool-title').textContent.toLowerCase();
            const description = card.querySelector('.tool-description').textContent.toLowerCase();
            const category = card.dataset.category || '';
            
            const isMatch = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          category.includes(searchTerm);
            
            if (isMatch || searchTerm === '') {
                card.style.display = 'block';
                card.classList.add('fade-in');
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show "no results" message if needed
        showNoResultsMessage(visibleCount, searchTerm);
    });
    
    // Add search suggestions/autocomplete
    searchInput.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
}

function showNoResultsMessage(count, searchTerm) {
    const toolsGrid = document.getElementById('toolsGrid');
    let noResultsMsg = document.getElementById('noResultsMessage');
    
    if (count === 0 && searchTerm !== '') {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResultsMessage';
            noResultsMsg.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                color: white;
                font-size: 1.2rem;
                font-family: 'Inter', sans-serif;
            `;
            toolsGrid.appendChild(noResultsMsg);
        }
        noResultsMsg.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 20px;">🔍</div>
            <h3 style="font-family: 'Playfair Display', serif; margin-bottom: 15px; font-size: 2rem;">No tools found</h3>
            <p style="color: rgba(255,255,255,0.8);">Try searching for something else like "calculator", "converter", or "generator"</p>
        `;
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
function setupHeaderScroll() {
    const header = document.getElementById('header');
    
    if (!header) return;
    
    let lastScrollY = window.pageYOffset;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.pageYOffset;
        
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
}

// ============================================
// TOOL CARDS INTERACTION
// ============================================
function setupToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        // Make entire card clickable
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the button directly
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
            
            const link = this.querySelector('a');
            if (link) {
                link.click();
            }
        });
    });
}

// ============================================
// CATEGORY FILTER
// ============================================
function setupCategoryFilter() {
    const categoryCards = document.querySelectorAll('.category-card');
    const toolCards = document.querySelectorAll('.tool-card');
    
    categoryCards.forEach(categoryCard => {
        categoryCard.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Highlight selected category
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Filter tools
            filterToolsByCategory(category, toolCards);
            
            // Scroll to tools section
            const toolsSection = document.getElementById('tools');
            if (toolsSection) {
                setTimeout(() => {
                    toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
            
            // Show notification
            const categoryName = this.querySelector('.category-title').textContent;
            showNotification(`Showing ${categoryName} tools`, 'info');
        });
    });
}

function filterToolsByCategory(category, toolCards) {
    let visibleCount = 0;
    
    toolCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (cardCategory === category || category === 'all') {
            card.style.display = 'block';
            card.classList.add('fade-in');
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    return visibleCount;
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style based on type
    const colors = {
        info: '#667eea',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .category-card.active {
        transform: scale(1.05);
        box-shadow: 0 20px 50px rgba(102, 126, 234, 0.3);
        border: 3px solid #667eea;
    }
`;
document.head.appendChild(style);

// ============================================
// LAZY LOADING FOR IMAGES (if you add images)
// ============================================
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// ANALYTICS (Google Analytics Integration)
// ============================================
function trackPageView(pageName) {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: pageName,
            page_path: window.location.pathname
        });
    }
}

function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    }
});

// ============================================
// DARK MODE SUPPORT (Optional - for future)
// ============================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// ============================================
// LOCAL STORAGE FOR USER PREFERENCES
// ============================================
function saveUserPreference(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Failed to save preference:', e);
    }
}

function getUserPreference(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (e) {
        console.error('Failed to get preference:', e);
        return null;
    }
}

// ============================================
// TOOL USAGE TRACKING
// ============================================
function trackToolUsage(toolId) {
    const usageStats = getUserPreference('toolUsageStats') || {};
    usageStats[toolId] = (usageStats[toolId] || 0) + 1;
    saveUserPreference('toolUsageStats', usageStats);
}

function getPopularTools() {
    const usageStats = getUserPreference('toolUsageStats') || {};
    return Object.entries(usageStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([tool]) => tool);
}

// ============================================
// RESPONSIVE IMAGE LOADING
// ============================================
function loadResponsiveImage(img) {
    const width = window.innerWidth;
    let size = 'large';
    
    if (width < 768) {
        size = 'small';
    } else if (width < 1200) {
        size = 'medium';
    }
    
    const baseSrc = img.dataset.src;
    img.src = baseSrc.replace('{size}', size);
}

// ============================================
// COPY TO CLIPBOARD UTILITY
// ============================================
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            showNotification('Failed to copy', 'error');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy:', err);
            showNotification('Failed to copy', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// ============================================
// SHARE FUNCTIONALITY
// ============================================
function shareContent(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).then(() => {
            showNotification('Shared successfully!', 'success');
        }).catch(err => {
            console.error('Error sharing:', err);
        });
    } else {
        copyToClipboard(url);
        showNotification('Link copied to clipboard!', 'success');
    }
}

// ============================================
// PRINT FUNCTIONALITY
// ============================================
function printPage() {
    window.print();
}

// ============================================
// EXPORT TOOLS
// ============================================
function exportData(data, filename, type = 'json') {
    let content;
    let mimeType;
    
    switch (type) {
        case 'json':
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            filename = filename + '.json';
            break;
        case 'csv':
            content = convertToCSV(data);
            mimeType = 'text/csv';
            filename = filename + '.csv';
            break;
        case 'txt':
            content = data;
            mimeType = 'text/plain';
            filename = filename + '.txt';
            break;
        default:
            content = data;
            mimeType = 'text/plain';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification(`Downloaded ${filename}`, 'success');
}

function convertToCSV(data) {
    if (!Array.isArray(data) || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => obj[header]));
    
    return [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
}

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // You can send errors to an error tracking service here
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You can send errors to an error tracking service here
});

// ============================================
// PAGE VISIBILITY API
// ============================================
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page is hidden');
        // Pause any animations or videos
    } else {
        console.log('Page is visible');
        // Resume animations or videos
    }
});

// ============================================
// ONLINE/OFFLINE DETECTION
// ============================================
window.addEventListener('online', function() {
    showNotification('You are back online!', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are offline. Some features may not work.', 'warning');
});

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%c🎨 Welcome to Omni.Daily! ', 'color: #667eea; font-size: 20px; font-weight: bold; font-family: Playfair Display;');
console.log('%cBuilt with ❤️ using vanilla JavaScript', 'color: #764ba2; font-size: 14px; font-family: Inter;');
console.log('%cVersion 1.0.0', 'color: #666; font-size: 12px; font-family: Inter;');

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ============================================
window.OmniDaily = {
    showNotification,
    copyToClipboard,
    shareContent,
    exportData,
    trackEvent,
    toggleDarkMode,
    printPage
};

// ============================================
// SERVICE WORKER REGISTRATION (for PWA - Optional)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you create a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

console.log('✅ Omni.Daily JavaScript loaded successfully!');
