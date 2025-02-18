import supabase from "@/supabase/authTest";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";

interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
  fuelType: string;
  transmission: string;
  imageUrls: string[];
}

interface ReservationFormProps {
  car: Car;
  onClose: () => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ car, onClose }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const reservationData = {
      carId: car.id,
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

    const { error } = await supabase.from("reservations").insert(reservationData);
    if (error) {
      console.error("Error al guardar la reserva:", error);
    } else {
      console.log("Reserva guardada con éxito!");
      onClose();
    }
    const message = encodeURIComponent(
      `${t.reservationMessages.NewCarReservation}\n\n` +
      `${t.reservationMessages.Customer} ${reservationData.buyerName}\n` +
      `${t.reservationMessages.Email} ${reservationData.email}\n` +
      `${t.reservationMessages.Phone} ${reservationData.phone}\n` +
      `${t.reservationMessages.ID} ${reservationData.idType}\n\n` +
      `${t.reservationMessages.ReservedCar} ${reservationData.brand} ${reservationData.model}\n` +
      `${t.reservationMessages.Price} $${reservationData.price}/día\n` +
      `${t.reservationMessages.From} ${reservationData.startDate}  ➡️  ${t.reservationMessages.To} ${reservationData.endDate}\n` +
      `${t.reservationMessages.Transmission} ${reservationData.transmission}\n` +
      `${t.reservationMessages.FuelType} ${reservationData.fuelType}\n\n` +
      `${t.reservationMessages.PaymentMethod} ${reservationData.paymentMethod}\n` +
      `${t.reservationMessages.DeliveryAddress} ${reservationData.deliveryAddress || "No especificada"}\n` +
      `${t.reservationMessages.AdditionalNotes} ${reservationData.additionalNotes || "Ninguna"}\n\n` +
      `${t.reservationMessages.CarImage} ${car.imageUrls.length > 0 ? car.imageUrls[0] : "No disponible"}\n\n` +
      `${t.reservationMessages.ThankYou}`
    );
    

    const whatsappApiUrl = `https://wa.me/+61421602018?text=${message}`;

    window.open(whatsappApiUrl, "_blank");
  };

  const { language } = useLanguage();
  const t = languages[language];

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-md">
        <div className="bg-gradient-to-b from-[#C47369] to-[#D88C7A] shadow-lg rounded-lg p-6 w-full max-w-2xl text-white max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {t.reservation.title.replace("{carBrand}", car.brand).replace("{carModel}", car.model)}
          </h2>
  
          <p className="text-lg font-semibold text-center text-yellow-300">
            {t.reservation.price.replace("{price}", car.price.toString())}
          </p>
          <p className="text-center">{t.reservation.fuel.replace("{fuelType}", car.fuelType)}</p>
          <p className="text-center mb-4">{t.reservation.transmission.replace("{transmission}", car.transmission)}</p>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                {t.reservation.buyerName}:
                <input type="text" name="buyerName" className="w-full p-3 bg-white/20 border border-white/30 rounded-md text-black focus:ring-2 focus:ring-yellow-300" required />
              </label>
              <label className="block">
                {t.reservation.email}:
                <input type="email" name="email" className="w-full p-3 bg-white/20 border border-white/30 rounded-md text-black focus:ring-2 focus:ring-yellow-300" required />
              </label>
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                {t.reservation.phone}:
                <input type="tel" name="phone" className="w-full p-3 bg-white/20 border border-white/30 rounded-md text-black focus:ring-2 focus:ring-yellow-300" required />
              </label>
              <label className="block">
                {t.reservation.idType}:
                <input type="text" name="idType" className="w-full p-3 bg-white/20 border border-white/30 rounded-md text-black focus:ring-2 focus:ring-yellow-300" required />
              </label>
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                {t.reservation.startDate}:
                <input type="date" name="startDate" className="w-full p-3 bg-white/20 border border-white/30 rounded-md text-black focus:ring-2 focus:ring-yellow-300" required />
              </label>
              <label className="block">
                {t.reservation.endDate}:
                <input type="date" name="endDate" className="w-full p-3 bg-white/20 border border-white/30 rounded-md text-black focus:ring-2 focus:ring-yellow-300" required />
              </label>
            </div>
  
            <label className="block">
              {t.reservation.paymentMethod}:
              <select name="paymentMethod" className="w-full p-3 bg-white/20 border border-white/30 rounded-md text-black focus:ring-2 focus:ring-yellow-300" required>
                <option value="card">{t.reservation.card}</option>
                <option value="transfer">{t.reservation.transfer}</option>
                <option value="cash">{t.reservation.cash}</option>
              </select>
            </label>
  
         <label className="block">
  {t.reservation.deliveryAddress}:
  <input
    type="text"
    name="deliveryAddress"
    defaultValue="El dueño te dirá la ubicación exacta donde puedes retirar el auto."
    className="w-full p-3 bg-white/20 border border-white/30 rounded-md text-black focus:ring-2 focus:ring-yellow-300"
  />
</label>

  
            <label className="block">
              {t.reservation.additionalNotes}:
              <textarea name="additionalNotes" className="w-full p-3 bg-white/20 border border-white/30 rounded-md text-black focus:ring-2 focus:ring-yellow-300" />
            </label>
  
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <button type="submit" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-md transition-all">
                {t.reservation.confirm}
              </button>
              <button type="button" className="w-full sm:w-auto text-white hover:text-gray-300 transition-all" onClick={onClose}>
                {t.reservation.cancel}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  