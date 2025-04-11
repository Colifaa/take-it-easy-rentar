import { useState, useEffect } from 'react';
import supabase from "@/supabase/authTest";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import { Calendar } from 'lucide-react';

interface CarAvailability {
  id: string;
  car_id: string;
  start_date: string;
  end_date: string;
}

interface Car {
  id: string;
  brand: string;
  model: string;
}

export default function CarAvailabilityManager() {
  const [cars, setCars] = useState<Car[]>([]);
  const [availabilities, setAvailabilities] = useState<CarAvailability[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { language } = useLanguage();
  const t = languages[language];

  useEffect(() => {
    fetchCars();
    fetchAvailabilities();
  }, []);

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from('cars')
      .select('id, brand, model');
    
    if (error) {
      console.error('Error fetching cars:', error);
      return;
    }
    
    setCars(data || []);
  };

  const fetchAvailabilities = async () => {
    const { data, error } = await supabase
      .from('car_availability')
      .select('*')
      .gte('end_date', new Date().toISOString().split('T')[0]);
    
    if (error) {
      console.error('Error fetching availabilities:', error);
      return;
    }
    
    setAvailabilities(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('car_availability')
      .insert({
        car_id: selectedCar,
        start_date: startDate,
        end_date: endDate
      });

    if (error) {
      console.error('Error saving availability:', error);
      return;
    }

    // Refresh availabilities
    fetchAvailabilities();
    
    // Reset form
    setSelectedCar('');
    setStartDate('');
    setEndDate('');
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('car_availability')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting availability:', error);
      return;
    }

    fetchAvailabilities();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Gestionar Disponibilidad de Autos</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Auto
          </label>
          <select
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Seleccionar un auto...</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.brand} {car.model}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
              min={startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Guardar Disponibilidad
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Disponibilidades Actuales</h3>
        
        {availabilities.map((availability) => {
          const car = cars.find(c => c.id === availability.car_id);
          return (
            <div
              key={availability.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
            >
              <div>
                <p className="font-medium">
                  {car ? `${car.brand} ${car.model}` : 'Auto no encontrado'}
                </p>
                <p className="text-sm text-gray-600">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  {new Date(availability.start_date).toLocaleDateString()} - {new Date(availability.end_date).toLocaleDateString()}
                </p>
              </div>
              
              <button
                onClick={() => handleDelete(availability.id)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
} 