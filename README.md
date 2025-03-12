# Custom Google Homepage

This project helps you create a personalized Google homepage that replaces the default Google search page when you open a new tab or visit Google.com.

## Overview

This custom homepage maintains Google's search functionality while allowing you to personalize the appearance and add additional features like:
- Custom background images
- Personalized bookmarks
- Clock and weather widgets
- Custom themes and colors
- Quick access to frequently used services

## Getting Started

### Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript
- A web browser that supports extensions (Chrome, Firefox, Edge, etc.)
- A code editor (VS Code, Sublime Text, etc.)

### Installation Options

#### Method 1: Browser Extension

1. Clone this repository to your local machine
2. Follow your browser's instructions for loading unpacked extensions:
   - **Chrome**: Go to chrome://extensions, enable "Developer mode", click "Load unpacked", and select the project folder
   - **Firefox**: Go to about:debugging, click "This Firefox", click "Load Temporary Add-on", and select the manifest.json file
   - **Edge**: Go to edge://extensions, enable "Developer mode", click "Load unpacked", and select the project folder

#### Method 2: Local HTML Page (No Extension)

1. Set the included `index.html` file as your browser's homepage
2. Whenever you open a new tab, navigate to your locally saved file

## Customization

### Changing Background

1. Open `styles.css` and modify the `.background` class
2. Add your image to the `images` folder and update the CSS background-image path
3. Alternatively, use the built-in image picker in the settings menu

### Adding Bookmarks

1. Edit the `bookmarks.js` file to add your frequently visited sites
2. Format: `{ name: "Site Name", url: "https://example.com", icon: "icon-name.png" }`
3. Place custom icons in the `icons` folder

### Customizing Search

The search bar is configured to use Google by default, but you can modify `search.js` to use alternative search engines.

## Project Structure

```
custom-google-homepage/
├── index.html          # Main HTML file
├── css/
│   ├── styles.css      # Main stylesheet
│   └── themes.css      # Color themes
├── js/
│   ├── main.js         # Core functionality
│   ├── bookmarks.js    # Bookmark management
│   ├── search.js       # Search functionality
│   └── widgets.js      # Clock, weather, etc.
├── images/             # Background images
├── icons/              # Bookmark and UI icons
└── manifest.json       # Browser extension manifest
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various new tab extensions and custom homepage projects
- Weather data provided by [OpenWeatherMap](https://openweathermap.org/) API (requires free API key)
