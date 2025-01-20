import supabase from "@/supabase/authTest";

interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
  fuelType: string;
  transmission: string;
  imageUrl: string; // URL de la imagen del coche
}

interface ReservationFormProps {
  car: Car; // El auto seleccionado
  onClose: () => void; // Para cerrar el formulario
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ car, onClose }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const reservationData = {
      carId: car.id, // ID del auto seleccionado
      brand: car.brand,
      model: car.model,
      price: car.price,
      transmission: car.transmission,
      fuelType: car.fuelType,
      buyerName: formData.get("buyerName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      idType: formData.get("idType"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      paymentMethod: formData.get("paymentMethod"),
      deliveryAddress: formData.get("deliveryAddress"),
      additionalNotes: formData.get("additionalNotes"),
    };

    // Enviar los datos a Supabase
    const { error } = await supabase.from("reservations").insert(reservationData);
    if (error) {
      console.error("Error al guardar la reserva:", error);
    } else {
      console.log("Reserva guardada con éxito!");
      onClose();
    }

    // Crear el mensaje para WhatsApp
    const buyerName = formData.get("buyerName") as string;
    const carDetails = `${car.brand} ${car.model}`;
    const price = car.price;
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");
    const phone = formData.get("phone");
    const imageUrl = car.imageUrl; // URL de la imagen del coche
    
    const message = encodeURIComponent(
      `Hola, soy el cliente: ${buyerName} 👋👋 . Quiero hacer la reserva del siguiente auto: 🚘 ${carDetails}.\n` +
      `Precio: $${price}/día.\n` +
      `Fechas: Desde ${startDate} hasta ${endDate}.\n` +
      `Teléfono de contacto: ${phone}. \n` +
      `Imagen del coche: ${imageUrl} 📸\n` +  // Incluyendo la URL de la imagen
      `¡Gracias! 🥳`
    );

    // URL de la API de WhatsApp con el mensaje predefinido
    const whatsappApiUrl = `https://wa.me/+61421602018?text=${message}`; // Reemplaza 1234567890 por el número de WhatsApp del admin

    // Abrir el enlace para enviar el mensaje a WhatsApp
    window.open(whatsappApiUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Reservar {car.brand} {car.model}</h2>
        <p className="text-gray-600 mb-4 text-center">Precio: ${car.price}/día</p>
        <p className="text-gray-600 mb-4 text-center">Combustible: {car.fuelType}</p>
        <p className="text-gray-600 mb-4 text-center">Transmición: {car.transmission}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <label className="block w-full sm:w-1/2 mb-2">
              Nombre del Comprador:
              <input type="text" name="buyerName" className="w-full p-2 border rounded" required />
            </label>
            <label className="block w-full sm:w-1/2 mb-2">
              Correo Electrónico:
              <input type="email" name="email" className="w-full p-2 border rounded" required />
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <label className="block w-full sm:w-1/2 mb-2">
              Número de Teléfono:
              <input type="tel" name="phone" className="w-full p-2 border rounded" required />
            </label>
            <label className="block w-full sm:w-1/2 mb-2">
              Tipo de Documento:
              <input type="text" name="idType" className="w-full p-2 border rounded" required />
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <label className="block w-full sm:w-1/2 mb-2">
              Fecha de Inicio:
              <input type="date" name="startDate" className="w-full p-2 border rounded" required />
            </label>
            <label className="block w-full sm:w-1/2 mb-2">
              Fecha de Fin:
              <input type="date" name="endDate" className="w-full p-2 border rounded" required />
            </label>
          </div>

          <label className="block mb-2">
            Método de Pago:
            <select name="paymentMethod" className="w-full p-2 border rounded" required>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia Bancaria</option>
              <option value="cash">Efectivo</option>
            </select>
          </label>

          <label className="block mb-2">
            Dirección de Entrega o Recogida:
            <input type="text" name="deliveryAddress" className="w-full p-2 border rounded" />
          </label>

          <label className="block mb-4">
            Observaciones Adicionales:
            <textarea name="additionalNotes" className="w-full p-2 border rounded" />
          </label>

          <div className="flex justify-between items-center">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
              Confirmar Reserva
            </button>
            <button
              type="button"
              className="text-gray-500 ml-4"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
