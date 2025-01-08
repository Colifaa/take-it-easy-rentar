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
}

export interface FilterState {
  type: string[];
  transmission: string[];
  fuelType: string[];
  minPrice: number;
  maxPrice: number;
}