// Open-Meteo API — 100% free, no API key required
// Docs: https://open-meteo.com/en/docs

export interface WeatherData {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
    cityName?: string;
}

// WMO weather interpretation codes → label + emoji
const WMO_CODES: Record<number, { label: string; icon: string }> = {
    0: { label: 'Clear Sky', icon: '☀️' },
    1: { label: 'Mainly Clear', icon: '🌤️' },
    2: { label: 'Partly Cloudy', icon: '⛅' },
    3: { label: 'Overcast', icon: '☁️' },
    45: { label: 'Foggy', icon: '🌫️' },
    48: { label: 'Icy Fog', icon: '🌫️' },
    51: { label: 'Light Drizzle', icon: '🌦️' },
    53: { label: 'Drizzle', icon: '🌦️' },
    55: { label: 'Heavy Drizzle', icon: '🌧️' },
    61: { label: 'Light Rain', icon: '🌧️' },
    63: { label: 'Rain', icon: '🌧️' },
    65: { label: 'Heavy Rain', icon: '🌧️' },
    71: { label: 'Light Snow', icon: '🌨️' },
    73: { label: 'Snow', icon: '❄️' },
    75: { label: 'Heavy Snow', icon: '❄️' },
    80: { label: 'Rain Showers', icon: '🌦️' },
    81: { label: 'Rain Showers', icon: '🌧️' },
    82: { label: 'Violent Showers', icon: '⛈️' },
    95: { label: 'Thunderstorm', icon: '⛈️' },
    96: { label: 'Thunderstorm + Hail', icon: '⛈️' },
    99: { label: 'Thunderstorm + Hail', icon: '⛈️' },
};

const getWMO = (code: number) =>
    WMO_CODES[code] ?? { label: 'Unknown', icon: '🌡️' };

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
        `&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather fetch failed');
    const json = await res.json();
    const c = json.current;
    const { label, icon } = getWMO(c.weather_code);

    // Reverse-geocode city name via Nominatim (best-effort)
    let cityName: string | undefined;
    try {
        const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
        );
        const geoJson = await geoRes.json();
        cityName =
            geoJson?.address?.city ||
            geoJson?.address?.town ||
            geoJson?.address?.village ||
            geoJson?.address?.county;
    } catch { /* city name is optional */ }

    return {
        temp: Math.round(c.temperature_2m),
        feelsLike: Math.round(c.apparent_temperature),
        humidity: c.relative_humidity_2m,
        windSpeed: Math.round(c.wind_speed_10m),
        condition: label,
        icon,
        cityName,
    };
}

export function getUserLocation(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => reject(err),
            { timeout: 8000 }
        );
    });
}
