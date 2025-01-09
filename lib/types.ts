export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: 'SUV' | 'Sedan' | 'Hatchback' | 'Pickup' | 'Sports';
  transmission: 'Manual' | 'Automático';
  seats: number;
  pricePerDay: number;
  fuelType: 'Gasolina' | 'Diesel' | 'Híbrido' | 'Eléctrico';
  image: string;
  status: 'available' | 'reserved';
  nextAvailableDate?: string;
}

export interface FilterState {
  type: string[];
  transmission: string[];
  fuelType: string[];
  minPrice: number;
  maxPrice: number;
  availability?: 'all' | 'available' | 'reserved';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchParams {
  pickupDate: Date;
  returnDate: Date;
  location: string;
}