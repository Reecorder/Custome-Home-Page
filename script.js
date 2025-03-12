// Background image categories
const backgroundCategories = [
    'nature', 'night', 'abstract', 'minimal', 'mountains', 'ocean',
    'forest', 'space', 'architecture', 'cityscape'
];

// For storing and retrieving recent searches
const MAX_RECENT_SEARCHES = 10;

// Alternative background URLs (high-quality CC0 images as fallbacks)
const fallbackBackgrounds = [
    'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg',
    'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg',
    'https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg',
    'https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg',
    'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg',
    'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
    'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg',
    'https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg',
    'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg',
    'https://images.pexels.com/photos/1142950/pexels-photo-1142950.jpeg',
    // Additional fallback images
    'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg',
    'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
    'https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg',
    'https://images.pexels.com/photos/1834399/pexels-photo-1834399.jpeg',
    'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg',
    'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg',
    'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
    'https://images.pexels.com/photos/2775196/pexels-photo-2775196.jpeg',
    'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg',
    'https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg'
];

// Search suggestions to cycle through
const searchSuggestions = [
    "Try searching for a new recipe...",
    "Looking for travel inspiration?",
    "Search for productivity tips...",
    "Need a good book recommendation?",
    "Search for coding tutorials...",
    "Looking for workout routines?",
    "Find DIY project ideas...",
    "Explore new music genres...",
    "Search for meditation techniques..."
];

// Color themes that will change based on background
const colorThemes = [
    { name: 'cool', iconColor: '#a5f3fc', accent: '#06b6d4' },
    { name: 'warm', iconColor: '#fdba74', accent: '#f97316' },
    { name: 'forest', iconColor: '#86efac', accent: '#22c55e' },
    { name: 'lavender', iconColor: '#d8b4fe', accent: '#a855f7' },
    { name: 'sunset', iconColor: '#fda4af', accent: '#f43f5e' },
    { name: 'ocean', iconColor: '#93c5fd', accent: '#3b82f6' }
];

let currentTheme = colorThemes[0];
let currentBackground = '';
let currentBackgroundIndex = 0;
let fallbackIndex = 0;
let retryCount = 0;
const MAX_RETRIES = 3;

// Update time and date
function updateTimeAndDate() {
    const now = new Date();

    // Format time in 12-hour format with AM/PM
    const timeElement = document.getElementById('time');
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12-hour format
    timeElement.textContent = `${hours}:${minutes} ${amPm}`;

    // Update date
    const dateElement = document.getElementById('date');
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);

    // Update greeting
    const greetingElement = document.getElementById('greeting');
    const greeting = now.getHours() < 12 ? 'Good morning' :
        now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

    // Only update if different to avoid animation restart
    if (greetingElement.textContent !== greeting) {
        greetingElement.textContent = greeting;
    }
}

// Function to cycle through search suggestions with improved animation
function cycleSuggestions() {
    const suggestionElement = document.getElementById('search-suggestions');
    let currentIndex = 0;

    setInterval(() => {
        // Set up transition for smoother fade
        suggestionElement.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out';
        suggestionElement.style.opacity = '0';
        suggestionElement.style.transform = 'translateY(10px)';

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % searchSuggestions.length;
            suggestionElement.textContent = searchSuggestions[currentIndex];

            // Fade in with a slight upward animation
            suggestionElement.style.transform = 'translateY(0)';
            suggestionElement.style.opacity = '0.7';
        }, 800);
    }, 5000);

    // Set initial suggestion
    suggestionElement.textContent = searchSuggestions[0];
    suggestionElement.style.opacity = '0.7';
}

// Enhanced function to analyze image color and set theme
async function analyzeImageAndSetTheme(imageUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = function () {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            try {
                // Sample colors from different parts of the image
                const topLeft = ctx.getImageData(0, 0, 1, 1).data;
                const topRight = ctx.getImageData(img.width - 1, 0, 1, 1).data;
                const bottomLeft = ctx.getImageData(0, img.height - 1, 1, 1).data;
                const bottomRight = ctx.getImageData(img.width - 1, img.height - 1, 1, 1).data;
                const center = ctx.getImageData(Math.floor(img.width / 2), Math.floor(img.height / 2), 1, 1).data;

                // Convert to hex
                const colors = [
                    rgbToHex(topLeft[0], topLeft[1], topLeft[2]),
                    rgbToHex(topRight[0], topRight[1], topRight[2]),
                    rgbToHex(bottomLeft[0], bottomLeft[1], bottomLeft[2]),
                    rgbToHex(bottomRight[0], bottomRight[1], bottomRight[2]),
                    rgbToHex(center[0], center[1], center[2])
                ];

                // Create a custom theme from the dominant colors
                const customTheme = {
                    name: 'custom',
                    iconColor: colors[4], // Center color for icons (not used now)
                    accent: colors[0]     // Top left for accent
                };

                // Set the theme colors - but not for icons
                document.documentElement.style.setProperty('--accent-color', customTheme.accent);

                // Update greeting gradient
                const greeting = document.getElementById('greeting');
                greeting.style.background = `linear-gradient(90deg, ${customTheme.accent}, var(--icon-color))`;
                greeting.style.webkitBackgroundClip = 'text';
                greeting.style.backgroundClip = 'text';

                // Update quick links with new colors, but not icon colors
                updateQuickLinkColors(customTheme);

                currentTheme = customTheme;
                resolve(customTheme);
            } catch (error) {
                console.error("Error analyzing image:", error);
                fallbackToRandomTheme(resolve);
            }
        };

        img.onerror = function () {
            fallbackToRandomTheme(resolve);
        };

        // Set a timeout in case the image takes too long to load
        setTimeout(() => {
            if (!img.complete) {
                img.src = ""; // Cancel the image load
                fallbackToRandomTheme(resolve);
            }
        }, 5000);
    });
}

// Helper function for theme fallback
function fallbackToRandomTheme(resolve) {
    // Fallback to random theme if image can't be analyzed
    const randomTheme = colorThemes[Math.floor(Math.random() * colorThemes.length)];

    document.documentElement.style.setProperty('--accent-color', randomTheme.accent);

    const greeting = document.getElementById('greeting');
    greeting.style.background = `linear-gradient(90deg, ${randomTheme.accent}, var(--icon-color))`;
    greeting.style.webkitBackgroundClip = 'text';
    greeting.style.backgroundClip = 'text';

    updateQuickLinkColors(randomTheme);

    currentTheme = randomTheme;
    resolve(randomTheme);
}
// Helper function to convert RGB to HEX
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Update quick link colors based on theme
function updateQuickLinkColors(theme) {
    const cards = document.querySelectorAll('.link-card');

    cards.forEach(card => {
        card.style.transition = 'box-shadow 1.5s ease, transform 0.3s ease';
        card.style.boxShadow = `0 4px 6px rgba(0,0,0,0.1), 0 0 0 1px ${theme.accent}22`;

        // Hover effect
        card.onmouseenter = () => {
            card.style.boxShadow = `0 8px 15px rgba(0,0,0,0.1), 0 0 0 2px ${theme.accent}44`;
            card.style.transform = 'translateY(-5px)';
        };

        card.onmouseleave = () => {
            card.style.boxShadow = `0 4px 6px rgba(0,0,0,0.1), 0 0 0 1px ${theme.accent}22`;
            card.style.transform = 'translateY(0)';
        };
    });
}
// Enhanced function to change background with smoother transitions and error handling
function changeBackground() {``
    // Reset retry count on new background change attempt
    retryCount = 0;
    attemptBackgroundChange();
}

// Function to attempt background change with fallback mechanism
function attemptBackgroundChange() {
    const oldBg = document.getElementById('background');

    // Create new background that will fade in
    const newBg = document.createElement('div');
    newBg.id = 'background-new';
    newBg.className = 'bg-image';
    newBg.style.opacity = '0';
    newBg.style.transition = 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)';

    let imageUrl;

    // After MAX_RETRIES attempts with Unsplash, switch to fallback backgrounds
    if (retryCount >= MAX_RETRIES) {
        console.log("Using fallback background images");
        fallbackIndex = (fallbackIndex + 1) % fallbackBackgrounds.length;
        imageUrl = fallbackBackgrounds[fallbackIndex];
    } else {
        // Try Unsplash with a limited number of retries
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundCategories.length;
        const category = backgroundCategories[currentBackgroundIndex];

        // Use Picsum as it's more reliable than Unsplash random source
        imageUrl = `https://picsum.photos/1920/1080?random=${Date.now()}`;

        // Alternative APIs if needed:
        // - `https://source.unsplash.com/featured/1920x1080/?${category}&t=${Date.now()}`
        // - `https://picsum.photos/1920/1080?random=${Date.now()}`
    }

    // Preload the image before showing
    const preloadImg = new Image();
    preloadImg.src = imageUrl;

    // Set a timeout to handle cases where the image might hang
    const timeoutId = setTimeout(() => {
        console.log("Image load timed out");
        preloadImg.src = ""; // Cancel the current load
        retryCount++;
        attemptBackgroundChange();
    }, 8000);

    preloadImg.onload = () => {
        clearTimeout(timeoutId);

        // Set the new background
        newBg.style.backgroundImage = `url(${imageUrl})`;
        document.body.appendChild(newBg);

        // Fade in the new background
        setTimeout(() => {
            newBg.style.opacity = '1';

            // Remove old background after transition completes
            setTimeout(() => {
                if (oldBg) oldBg.remove();
                newBg.id = 'background';

                // Analyze image and update theme
                analyzeImageAndSetTheme(imageUrl);
            }, 2000);
        }, 100);

        currentBackground = imageUrl;
    };

    preloadImg.onerror = () => {
        clearTimeout(timeoutId);
        console.error("Failed to load image, trying another source");
        retryCount++;
        attemptBackgroundChange(); // Try another source
    };
}

// Add search field animation
function setupSearchFieldAnimation() {
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');

    if (!searchContainer || !searchInput) {
        console.error("Search elements not found");
        return;
    }

    // Initial state
    searchContainer.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

    // Focus animation
    searchInput.addEventListener('focus', () => {
        searchContainer.style.transform = 'scale(1.03)';
        searchContainer.style.boxShadow = `0 10px 25px rgba(0,0,0,0.2), 0 0 0 2px ${currentTheme.accent}55`;
    });

    // Blur animation
    searchInput.addEventListener('blur', () => {
        searchContainer.style.transform = 'scale(1)';
        searchContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    });

    // Add typing animation for placeholder
    searchInput.placeholder = "";
    let placeholderText = "Search the web";
    let placeholderIndex = 0;

    function typePlaceholder() {
        if (placeholderIndex < placeholderText.length && document.activeElement !== searchInput) {
            searchInput.placeholder += placeholderText.charAt(placeholderIndex);
            placeholderIndex++;
            setTimeout(typePlaceholder, 100);
        }
    }

    // Reset and start typing animation
    function resetPlaceholder() {
        if (document.activeElement !== searchInput) {
            searchInput.placeholder = "";
            placeholderIndex = 0;
            typePlaceholder();
        }
    }

    // Start initially and repeat occasionally
    resetPlaceholder();
    setInterval(resetPlaceholder, 15000);

    // Setup search functionality
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
        }
    });
}

// Function to shuffle an array randomly
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Fallback quotes (Shuffled dynamically)
const fallbackQuotes = shuffleArray([
    { quote: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { quote: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { quote: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha" },
    { quote: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
    { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { quote: "Dream big and dare to fail.", author: "Norman Vaughan" }
]);

// Enhanced version to fetch a random quote with better transitions
const proxyUrl = "https://api.allorigins.win/get?url=";
const apiUrl = "https://zenquotes.io/api/random?t=" + new Date().getTime(); // Add timestamp

async function fetchRandomQuote() {
    try {
        console.log("Fetching quote...");
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const quoteData = JSON.parse(data.contents); // Extract actual JSON from proxy response

        if (Array.isArray(quoteData) && quoteData.length > 0) {
            // Enhanced transition for quotes
            animateQuoteChange(quoteData[0].q, quoteData[0].a);
        } else {
            throw new Error("Invalid response format");
        }
    } catch (error) {
        console.error("Error fetching quote:", error);

        // Use fallback with the same animation
        const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        animateQuoteChange(randomFallback.quote, randomFallback.author);
    }
}

// Animated quote transition
function animateQuoteChange(quoteText, authorText) {
    const quoteElement = document.getElementById('quote');
    const authorElement = document.getElementById('author');

    if (!quoteElement || !authorElement) {
        console.error("Quote elements not found");
        return;
    }

    // Set up transitions
    quoteElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    authorElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    // Fade out with downward movement
    quoteElement.style.opacity = 0;
    quoteElement.style.transform = 'translateY(20px)';
    authorElement.style.opacity = 0;
    authorElement.style.transform = 'translateY(20px)';

    setTimeout(() => {
        // Update content
        quoteElement.textContent = quoteText;
        authorElement.textContent = `- ${authorText}`;

        // Prepare for fade in (move up slightly first)
        quoteElement.style.transform = 'translateY(-10px)';
        authorElement.style.transform = 'translateY(-10px)';

        // Execute fade in with downward movement to final position
        setTimeout(() => {
            quoteElement.style.opacity = 0.9;
            quoteElement.style.transform = 'translateY(0)';
            authorElement.style.opacity = 0.7;
            authorElement.style.transform = 'translateY(0)';
        }, 50);
    }, 800);
}

// Add ripple effect to link cards
function addRippleEffect() {
    const cards = document.querySelectorAll('.link-card');

    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            // Enhanced ripple effect
            ripple.style.backgroundColor = `${currentTheme.accent}55`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600); // Remove after animation completes
        });
    });
}

// Replace parallax with a subtle zoom/pulse animation
function setupBackgroundAnimation() {
    // Remove the mousemove event listener if it exists
    document.removeEventListener('mousemove', null);

    // Add a subtle breathing/pulsing effect to the background
    function animateBackground() {
        const backgroundElement = document.getElementById('background') || document.getElementById('background-new');
        if (!backgroundElement) return;

        backgroundElement.style.transition = 'transform 10s ease-in-out';
        backgroundElement.style.transform = 'scale(1.03)';

        setTimeout(() => {
            backgroundElement.style.transform = 'scale(1.0)';
        }, 10000);
    }

    // Start animation immediately
    animateBackground();

    // Repeat animation
    setInterval(animateBackground, 20000);
}

// Get recent searches from localStorage
function getRecentSearches() {
    const searches = localStorage.getItem('recentSearches');
    return searches ? JSON.parse(searches) : [];
}

// Save a search to localStorage
function saveSearch(query) {
    let searches = getRecentSearches();

    // Don't add duplicates, move to front if exists
    const index = searches.indexOf(query);
    if (index !== -1) {
        searches.splice(index, 1);
    }

    // Add to front of array
    searches.unshift(query);

    // Keep only MAX_RECENT_SEARCHES
    if (searches.length > MAX_RECENT_SEARCHES) {
        searches = searches.slice(0, MAX_RECENT_SEARCHES);
    }

    localStorage.setItem('recentSearches', JSON.stringify(searches));
}

// Setup search with auto-suggestions
function setupSearchWithSuggestions() {
    const searchInput = document.querySelector('.search-input');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-autocomplete';
    document.querySelector('.search-container').appendChild(suggestionsContainer);

    // Handle form submission - save search
    document.querySelector('.search-container form').addEventListener('submit', (e) => {
        const query = searchInput.value.trim();
        if (query) {
            saveSearch(query);
        }
    });

    // Show suggestions on input
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
            return;
        }

        const recentSearches = getRecentSearches();
        const matchingSearches = recentSearches.filter(search =>
            search.toLowerCase().includes(query)
        );

        if (matchingSearches.length > 0) {
            suggestionsContainer.innerHTML = '';

            matchingSearches.slice(0, 5).forEach(search => {
                const suggestion = document.createElement('div');
                suggestion.className = 'suggestion-item';

                // Create a span for the icon
                const iconSpan = document.createElement('span');
                iconSpan.className = 'suggestion-icon';
                iconSpan.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                `;

                // Create a span for the text content
                const textSpan = document.createElement('span');
                textSpan.textContent = search;

                suggestion.appendChild(iconSpan);
                suggestion.appendChild(textSpan);

                suggestion.addEventListener('click', () => {
                    searchInput.value = search;
                    suggestionsContainer.innerHTML = '';
                    suggestionsContainer.style.display = 'none';
                    saveSearch(search);
                    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(search)}`;
                });

                suggestionsContainer.appendChild(suggestion);
            });

            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
        }
    });

    // Show recent searches on focus if input is empty
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() === '') {
            const recentSearches = getRecentSearches();

            if (recentSearches.length > 0) {
                suggestionsContainer.innerHTML = '';

                recentSearches.slice(0, 5).forEach(search => {
                    const suggestion = document.createElement('div');
                    suggestion.className = 'suggestion-item';

                    // Create a span for the icon
                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'suggestion-icon';
                    iconSpan.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="12 8 12 12 14 14"></polyline>
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                    `;

                    // Create a span for the text content
                    const textSpan = document.createElement('span');
                    textSpan.textContent = search;

                    suggestion.appendChild(iconSpan);
                    suggestion.appendChild(textSpan);

                    suggestion.addEventListener('click', () => {
                        searchInput.value = search;
                        suggestionsContainer.innerHTML = '';
                        suggestionsContainer.style.display = 'none';
                        saveSearch(search);
                        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(search)}`;
                    });

                    suggestionsContainer.appendChild(suggestion);
                });

                suggestionsContainer.style.display = 'block';
            }
        }
    });
}

// Add Google Feed section with dynamic content
function addGoogleFeed() {
    // Create the Google Feed container
    const feedContainer = document.createElement('div');
    feedContainer.className = 'google-feed-container';

    // Create the header
    const feedHeader = document.createElement('div');
    feedHeader.className = 'feed-header';

    // Create Google icon
    const googleIcon = document.createElement('div');
    googleIcon.className = 'google-icon';
    googleIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
    `;

    const feedTitle = document.createElement('h3');
    feedTitle.textContent = 'Google Feed';

    feedHeader.appendChild(googleIcon);
    feedHeader.appendChild(feedTitle);

    // Create feed content
    const feedContent = document.createElement('div');
    feedContent.className = 'feed-content';
    
    // Loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.textContent = 'Loading news...';
    loadingElement.style.padding = '15px';
    loadingElement.style.textAlign = 'center';
    feedContent.appendChild(loadingElement);

    // Add a "View more" button
    const viewMoreBtn = document.createElement('a');
    viewMoreBtn.className = 'view-more-btn';
    viewMoreBtn.href = 'https://news.google.com/';
    viewMoreBtn.textContent = 'View more';
    viewMoreBtn.target = '_blank';

    // Assemble the feed
    feedContainer.appendChild(feedHeader);
    feedContainer.appendChild(feedContent);
    feedContainer.appendChild(viewMoreBtn);

    // Add to the page
    document.querySelector('.container').appendChild(feedContainer);
    
    // Fetch news data
    fetchNewsData(feedContent);
}

// Function to fetch news data
async function fetchNewsData(feedContent) {
    // Sample news topics to fetch randomly
    const newsTopics = [
        'technology', 'science', 'business', 
        'health', 'entertainment', 'sports',
        'environment', 'politics', 'education'
    ];
    
    // Select a random topic
    const randomTopic = newsTopics[Math.floor(Math.random() * newsTopics.length)];
    
    try {
        // Clear loading message
        feedContent.innerHTML = '';
        
        // Since we can't make actual API calls, we'll simulate dynamic content
        // with predefined articles based on the random topic
        const articles = generateArticlesForTopic(randomTopic);
        
        articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.className = 'feed-article';
            articleElement.onclick = () => window.open(article.url, '_blank');

            // Create article thumbnail
            const articleThumbnail = document.createElement('div');
            articleThumbnail.className = 'article-thumbnail';
            articleThumbnail.style.backgroundImage = `url(${article.image})`;

            // Create article content
            const articleContent = document.createElement('div');
            articleContent.className = 'article-content';

            const articleTitle = document.createElement('h4');
            articleTitle.textContent = article.title;

            const articleFooter = document.createElement('div');
            articleFooter.className = 'article-footer';

            const timeElement = document.createElement('span');
            timeElement.className = 'article-time';
            timeElement.textContent = article.time;

            articleFooter.appendChild(timeElement);
            articleContent.appendChild(articleTitle);
            articleContent.appendChild(articleFooter);

            articleElement.appendChild(articleThumbnail);
            articleElement.appendChild(articleContent);

            feedContent.appendChild(articleElement);
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        feedContent.innerHTML = '<div style="padding: 15px; text-align: center;">Failed to load news</div>';
    }
}

// Generate articles based on topic
function generateArticlesForTopic(topic) {
    const currentTime = new Date();
    const articles = [];
    
    // Topic-specific articles
    switch(topic) {
        case 'technology':
            articles.push(
                {
                    title: 'New AI breakthrough enables more natural conversations',
                    time: '2 hours ago',
                    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=150',
                    url: 'https://news.google.com/search?q=ai%20breakthrough'
                },
                {
                    title: 'Tech giants announce new AR glasses for consumers',
                    time: '5 hours ago',
                    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=150',
                    url: 'https://news.google.com/search?q=ar%20glasses'
                },
                {
                    title: 'Quantum computing reaches new milestone',
                    time: '7 hours ago',
                    image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=150',
                    url: 'https://news.google.com/search?q=quantum%20computing'
                }
            );
            break;
        case 'science':
            articles.push(
                {
                    title: 'Scientists discover new exoplanet with potential for life',
                    time: '3 hours ago',
                    image: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=150',
                    url: 'https://news.google.com/search?q=exoplanet%20discovery'
                },
                {
                    title: 'New research shows promising results for cancer treatment',
                    time: '6 hours ago',
                    image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=150',
                    url: 'https://news.google.com/search?q=cancer%20research'
                },
                {
                    title: 'Study reveals new insights about deep ocean ecosystems',
                    time: '9 hours ago',
                    image: 'https://images.pexels.com/photos/3100361/pexels-photo-3100361.jpeg?auto=compress&cs=tinysrgb&w=150',
                    url: 'https://news.google.com/search?q=ocean%20ecosystem'
                }
            );
            break;
        case 'business':
            articles.push(
                {
                    title: 'Global markets show positive trends after policy changes',
                    time: '1 hour ago',
                    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=150',
                    url: 'https://news.google.com/search?q=global%20markets'
                },
                {
                    title: 'New startup raises record funding for sustainable products',
                    time: '4 hours ago',
                    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150',
                    url: 'https://news.google.com/search?q=startup%20funding'
                },
                {
                    title: 'Major retailer announces expansion into new markets',
                    time: '8 hours ago',
                    image: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=150',
                    url: 'https://news.google.com/search?q=retail%20expansion'
                }
            );
            break;
        default:
            articles.push(
                {
                    title: 'Top stories trending today across multiple categories',
                    time: '2 hours ago',
                    image: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=150',
                    url: 'https://news.google.com'
                },
                {
                    title: 'New developments in global events making headlines',
                    time: '5 hours ago',
                    image: 'https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg?auto=compress&cs=tinysrgb&w=150',
                    url: 'https://news.google.com'
                },
                {
                    title: 'Latest updates on trending topics around the world',
                    time: '7 hours ago',
                    image: 'https://images.pexels.com/photos/3957987/pexels-photo-3957987.jpeg?auto=compress&cs=tinysrgb&w=150',
                    url: 'https://news.google.com'
                }
            );
    }
    
    // Add relative time (e.g., "2 hours ago")
    articles.forEach(article => {
        // Make articles clickable
        article.url = article.url || 'https://news.google.com';
    });
    
    return articles;
}

// Modify the initializePage function to call our new functions
function initializePage() {
    // Set initial time and date
    updateTimeAndDate();
    setInterval(updateTimeAndDate, 1000);

    // Start cycling through search suggestions
    cycleSuggestions();

    // Initial background change
    changeBackground();
    // Change background every 30 seconds
    setInterval(changeBackground, 30000);

    // Setup search field animations
    setupSearchFieldAnimation();

    // Setup search with auto-suggestions (new)
    setupSearchWithSuggestions();

    // Add Google Feed (new)
    addGoogleFeed();

    // Add ripple effects
    addRippleEffect();

    // Setup background animation instead of parallax
    setupBackgroundAnimation();

    // Fetch initial quote
    fetchRandomQuote();
    // Change quote every 2 minutes
    setInterval(fetchRandomQuote, 120000);

    // Add animated entrance for main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';

        setTimeout(() => {
            mainContent.style.transition = 'opacity 1s ease, transform 1s ease';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 300);
    }
}

// Call the function when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);