# Weather App - Beautiful Glass Design

A stunning weather application built with Next.js featuring Apple glass-like design aesthetics with comprehensive weather data including advanced features like air quality index, UV index, and pollen count.

## Features

✨ **Apple Glass-like Design** - Beautiful frosted glass effects with smooth animations  
🌤️ **Current Weather** - Real-time weather conditions with detailed information  
📅 **7-Day Forecast** - Comprehensive weather predictions for the week ahead  
🔬 **Advanced Features** - Air quality index, UV index, and pollen count  
🌍 **Global Search** - Search weather for any city, state, or country worldwide  
📱 **Responsive Design** - Perfect experience on mobile, tablet, and desktop  
♿ **Accessibility** - Full keyboard navigation and screen reader support  

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **OpenWeatherMap API** - Comprehensive weather data

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-app-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Get your free API key from [OpenWeatherMap](https://openweathermap.org/api) and add it to `.env.local`:
```env
OPENWEATHER_API_KEY=your_api_key_here
```

### Running the Application

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

## API Integration

The application uses OpenWeatherMap API for comprehensive weather data:

- **Current Weather API** - Real-time weather conditions
- **One Call API** - 7-day forecast and weather alerts
- **Air Quality API** - Air pollution and quality data
- **UV Index API** - Ultraviolet radiation information
- **Geocoding API** - Location search and coordinates

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key | Required |
| `OPENWEATHER_BASE_URL` | API base URL | `https://api.openweathermap.org/data/2.5` |
| `GEOCODING_API_URL` | Geocoding API URL | `https://api.openweathermap.org/geo/1.0` |
| `NODE_ENV` | Environment mode | `development` |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with glass theme
│   ├── page.tsx           # Main weather page
│   ├── globals.css        # Global styles
│   └── api/weather/       # Weather API endpoints
├── components/            # Reusable components
│   ├── GlassCard.tsx      # Glass container component
│   ├── SearchBar.tsx      # Location search component
│   ├── WeatherIcon.tsx    # Animated weather icons
│   └── WeatherCard.tsx    # Weather display component
├── lib/                   # Utilities and services
│   ├── weather-api.ts     # API service layer
│   ├── types.ts           # TypeScript interfaces
│   └── utils.ts           # Helper functions
└── hooks/                 # Custom React hooks
    └── useWeather.ts      # Weather data management
```

## Design System

### Color Palette (Apple Glass Inspired)

- **Primary Glass**: `rgba(255, 255, 255, 0.15)` - Frosted glass white
- **Secondary Glass**: `rgba(255, 255, 255, 0.10)` - Light glass effect
- **Background**: `#0a0a0a` - Dark gradient background
- **Text**: `#ffffff` - White text
- **Accent**: `#3b82f6` - Blue accents
- **Success**: `#10b981` - Green for good conditions
- **Warning**: `#f59e0b` - Yellow for moderate
- **Danger**: `#ef4444` - Red for poor conditions

### Typography

- **Font Family**: System font stack (San Francisco/Arial)
- **Font Weights**: 300 (light), 400 (regular), 600 (semibold)
- **Scale**: 0.875rem to 2.25rem

### Animations

- **Transitions**: 300ms ease for hover effects
- **Loading**: Skeleton shimmer animation
- **Weather Icons**: Smooth state transitions
- **Glass Effect**: Subtle opacity changes on interaction

## Features in Detail

### Current Weather Display

Shows comprehensive current weather information:
- Temperature and feels-like temperature
- Humidity, pressure, and wind speed
- Weather description and animated icons
- Air quality index with color-coded indicators
- UV index with safety recommendations
- Pollen count for allergy sufferers

### 7-Day Forecast

Interactive forecast cards showing:
- Daily high/low temperatures
- Weather conditions and descriptions
- UV index and humidity levels
- Precipitation probabilities
- Smooth hover animations

### Location Search

Global location search with:
- Real-time suggestions as you type
- Recent searches history
- Support for cities, states, and countries
- Instant weather updates

### Advanced Features

#### Air Quality Index (AQI)
- Real-time air pollution data
- Color-coded quality indicators
- Detailed pollutant information (CO, NO2, O3, PM2.5, etc.)

#### UV Index
- Current and maximum UV index
- Safety exposure time recommendations
- Risk level indicators

#### Pollen Count
- Simulated pollen data based on weather conditions
- Grass, ragweed, and tree pollen levels
- Allergy risk level indicators

## Responsive Design

The application is fully responsive and optimized for:

- **Mobile** (`< 640px`) - Single column layout with touch-friendly interface
- **Tablet** (`640px - 1024px`) - Two column layout with swipe gestures
- **Desktop** (`> 1024px`) - Three column layout with full features

## Accessibility

The application includes comprehensive accessibility features:

- **Semantic HTML** structure
- **ARIA labels** for interactive elements
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** mode support
- **Reduced motion** option for animations

## Performance Optimization

- **Server-Side Rendering** for initial weather data
- **Client-Side Updates** for real-time changes
- **Image Optimization** with Next.js Image component
- **Code Splitting** for faster loading
- **Caching** for API responses
- **Bundle Size** optimization with tree-shaking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [FAQ](#faq) section
2. Search existing [issues](../../issues)
3. Create a new [issue](../../issues/new)

## FAQ

**Q: How do I get an API key?**
A: Visit [OpenWeatherMap](https://openweathermap.org/api) and sign up for a free account.

**Q: Can I use this app for commercial purposes?**
A: Yes, this project is licensed under MIT license.

**Q: How often is weather data updated?**
A: The app fetches fresh data on each search and caches responses for performance.

**Q: Is there a mobile app version?**
A: The web app is fully responsive and works great on mobile devices.

## Changelog

### v1.0.0 (November 2023)
- Initial release with glass design
- Current weather display
- 7-day forecast
- Air quality, UV index, and pollen data
- Global location search
- Responsive design

## Contact

For support and questions:
- Open an [issue](../../issues)
- Email: support@example.com

---

**Made with ❤️ using Next.js and Tailwind CSS**