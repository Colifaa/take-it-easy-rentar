import supabase from "@/supabase/authTest";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-gradient-to-b from-[#C47369] to-[#D88C7A] shadow-2xl rounded-xl p-6 w-full max-w-2xl text-white max-h-[90vh] overflow-y-auto mt-16 sm:mt-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {t.reservation.title.replace("{carBrand}", car.brand).replace("{carModel}", car.model)}
        </h2>

        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <p className="text-lg font-semibold text-center text-yellow-300">
            {t.reservation.price.replace("{price}", car.price.toString())}
          </p>
          <p className="text-center text-white/90">{t.reservation.fuel.replace("{fuelType}", car.fuelType)}</p>
          <p className="text-center text-white/90">{t.reservation.transmission.replace("{transmission}", car.transmission)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t.reservation.buyerName}</label>
              <input
                type="text"
                name="buyerName"
                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                required
                placeholder={t.reservation.buyerName}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t.reservation.email}</label>
              <input
                type="email"
                name="email"
                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                required
                placeholder={t.reservation.email}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t.reservation.phone}</label>
              <input
                type="tel"
                name="phone"
                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                required
                placeholder={t.reservation.phone}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t.reservation.idType}</label>
              <input
                type="text"
                name="idType"
                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                required
                placeholder={t.reservation.idType}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t.reservation.startDate}</label>
              <input
                type="date"
                name="startDate"
                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t.reservation.endDate}</label>
              <input
                type="date"
                name="endDate"
                className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">{t.reservation.paymentMethod}</label>
            <select
              name="paymentMethod"
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
              required
            >
              <option value="" className="bg-[#C47369]">{t.reservation.paymentMethod}</option>
              <option value="card" className="bg-[#C47369]">{t.reservation.card}</option>
              <option value="transfer" className="bg-[#C47369]">{t.reservation.transfer}</option>
              <option value="cash" className="bg-[#C47369]">{t.reservation.cash}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">{t.reservation.deliveryAddress}</label>
            <input
              type="text"
              name="deliveryAddress"
              defaultValue="El dueño te dirá la ubicación exacta donde puedes retirar el auto."
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">{t.reservation.additionalNotes}</label>
            <textarea
              name="additionalNotes"
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent h-24"
              placeholder={t.reservation.additionalNotes}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg transition-all"
            >
              {t.reservation.confirm}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              {t.reservation.cancel}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
  