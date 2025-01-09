import { Car } from './types';

export const cars: Car[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'RAV4',
    year: 2023,
    type: 'SUV',
    transmission: 'Automático',
    seats: 5,
    pricePerDay: 75,
    fuelType: 'Híbrido',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    status: 'available'
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Civic',
    year: 2023,
    type: 'Sedan',
    transmission: 'Automático',
    seats: 5,
    pricePerDay: 55,
    fuelType: 'Gasolina',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    status: 'reserved',
    nextAvailableDate: '2024-04-15'
  },
  {
    id: '3',
    brand: 'Ford',
    model: 'Mustang',
    year: 2023,
    type: 'Sports',
    transmission: 'Manual',
    seats: 4,
    pricePerDay: 120,
    fuelType: 'Gasolina',
    image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    status: 'available'
  },
  {
    id: '4',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    type: 'Sedan',
    transmission: 'Automático',
    seats: 5,
    pricePerDay: 100,
    fuelType: 'Eléctrico',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    status: 'reserved',
    nextAvailableDate: '2024-04-20'
  }
];