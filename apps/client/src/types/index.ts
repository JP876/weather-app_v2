export type CityType = {
    admin_name: string;
    capital: "primary" | "admin" | "minor" | "";
    city: string;
    city_ascii: string;
    country: string;
    id: number | string;
    iso2: string;
    iso3: string;
    lat: number | string;
    lng: number | string;
    population: number | string;
    timezone?: string;
};
