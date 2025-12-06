# Weather App Architecture Diagram

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js App Router] --> B[Main Page Component]
        B --> C[SearchBar Component]
        B --> D[WeatherCard Component]
        B --> E[ForecastCard Component]
        C --> F[GlassCard Wrapper]
        D --> F
        E --> F
    end
    
    subgraph "API Layer"
        G[Next.js API Routes]
        G --> H[Weather API Service]
        H --> I[OpenWeatherMap API]
        H --> J[Air Quality API]
        H --> K[UV Index API]
        H --> L[Geocoding API]
    end
    
    subgraph "Data Layer"
        M[Environment Variables]
        N[API Keys Storage]
        O[Cache Layer]
    end
    
    subgraph "External Services"
        I --> P[Current Weather Data]
        J --> Q[Air Quality Data]
        K --> R[UV Index Data]
        L --> S[Location Data]
    end
    
    C --> G
    B --> G
    G --> M
    G --> N
    G --> O
```

## Component Interaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as SearchBar
    participant A as API Route
    participant O as OpenWeatherMap
    participant W as WeatherCard
    participant F as ForecastCard
    
    U->>S: Enter location
    S->>A: Request weather data
    A->>O: Fetch current + forecast
    O->>A: Return weather data
    A->>A: Process and cache data
    A->>S: Send processed data
    S->>W: Display current weather
    S->>F: Display 7-day forecast
    W->>U: Show glass-style UI
    F->>U: Show forecast cards
```

## Data Flow Architecture

```mermaid
flowchart LR
    A[User Input] --> B[Location Search]
    B --> C[API Gateway]
    C --> D[Weather Data]
    C --> E[Air Quality]
    C --> F[UV Index]
    C --> G[Pollen Data]
    D --> H[Data Processing]
    E --> H
    F --> H
    G --> H
    H --> I[UI Components]
    I --> J[Glass Design System]
    J --> K[User Interface]
```

## File Structure Visualization

```mermaid
graph TD
    A[weather-app/] --> B[src/]
    B --> C[app/]
    B --> D[components/]
    B --> E[lib/]
    B --> F[hooks/]
    B --> G[styles/]
    
    C --> C1[layout.tsx]
    C --> C2[page.tsx]
    C --> C3[api/weather/]
    
    D --> D1[WeatherCard/]
    D --> D2[ForecastCard/]
    D --> D3[SearchBar/]
    D --> D4[GlassCard/]
    
    E --> E1[weather-api.ts]
    E --> E2[types.ts]
    E --> E3[utils.ts]
    
    F --> F1[useWeather.ts]
    
    G --> G1[tailwind.css]
    G --> G2[glass-effects.css]
```

## API Integration Architecture

```mermaid
graph LR
    A[Next.js API Route] --> B[Request Validator]
    B --> C[Cache Manager]
    C --> D{Cache Hit?}
    D -->|Yes| E[Return Cached Data]
    D -->|No| F[API Aggregator]
    
    F --> G[OpenWeatherMap Client]
    F --> H[Air Quality Client]
    F --> I[UV Index Client]
    
    G --> J[Data Normalizer]
    H --> J
    I --> J
    
    J --> K[Response Builder]
    K --> L[Cache Storage]
    L --> M[Return Response]
```

## Glass Design System

```mermaid
classDiagram
    class GlassCard {
        +string className
        +ReactNode children
        +string variant
        +render()
    }
    
    class WeatherIcon {
        +string condition
        +number size
        +string color
        +animate()
    }
    
    class SearchInput {
        +string placeholder
        +function onSearch
        +boolean isLoading
        +validate()
    }
    
    class ThemeProvider {
        +string theme
        +object colors
        +object spacing
        +applyTheme()
    }
    
    ThemeProvider <|-- GlassCard
    ThemeProvider <|-- WeatherIcon
    ThemeProvider <|-- SearchInput
```

This architecture provides a scalable, maintainable structure for the weather application with clear separation of concerns and efficient data flow management.