import { Car } from './types';

export interface Reservation {
  carId: string;
  startDate: string;
  endDate: string;
}

// Simulated reservations database
export const reservations: Reservation[] = [
  {
    carId: '2',
    startDate: '2024-04-01',
    endDate: '2024-04-15',
  },
  {
    carId: '4',
    startDate: '2024-04-10',
    endDate: '2024-04-20',
  },
];

export function isCarAvailable(car: Car, startDate: Date, endDate: Date): boolean {
  if (car.status === 'reserved') {
    if (!car.nextAvailableDate) return false;
    const availableFrom = new Date(car.nextAvailableDate);
    return startDate >= availableFrom;
  }
  
  const carReservations = reservations.filter(r => r.carId === car.id);
  
  for (const reservation of carReservations) {
    const reservationStart = new Date(reservation.startDate);
    const reservationEnd = new Date(reservation.endDate);
    
    // Check if there's any overlap with existing reservations
    if (
      (startDate >= reservationStart && startDate <= reservationEnd) ||
      (endDate >= reservationStart && endDate <= reservationEnd) ||
      (startDate <= reservationStart && endDate >= reservationEnd)
    ) {
      return false;
    }
  }
  
  return true;
}