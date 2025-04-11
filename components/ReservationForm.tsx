import supabase from "@/supabase/authTest";
import { useLanguage } from "../hooks/use-language";
import { languages } from "../lib/languages";
import { motion } from "framer-motion";
import { X, Calendar, CreditCard, MapPin, User, Mail, Phone, FileText, Clock } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [totalDays, setTotalDays] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Calcular el total de días cuando cambian las fechas
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays || 1);
    }
  }, [startDate, endDate]);

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
      totalPrice: car.price * totalDays
    };

    // Formatear el mensaje para WhatsApp usando las traducciones del idioma actual
    const message = encodeURIComponent(
      `🚗 *${t.reservationMessages.NewCarReservation}*\n\n` +
      `*${t.reservationMessages.Customer}*\n` +
      `👤 ${t.reservation.buyerName}: ${reservationData.buyerName}\n` +
      `📧 ${t.reservation.email}: ${reservationData.email}\n` +
      `📱 ${t.reservation.phone}: ${reservationData.phone}\n` +
      `🪪 ${t.reservation.idType}: ${reservationData.idType}\n\n` +
      `*${t.reservationMessages.ReservedCar}*\n` +
      `🚘 ${t.reservation.title.replace("{carBrand}", car.brand).replace("{carModel}", car.model)}\n` +
      `💰 ${t.reservation.price}: $${car.price}\n` +
      `📅 ${t.reservation.startDate}: ${reservationData.startDate}\n` +
      `📅 ${t.reservation.endDate}: ${reservationData.endDate}\n` +
      `📊 ${t.reservationMessages.TotalDays}: ${totalDays}\n` +
      `💵 ${t.reservationMessages.TotalPrice}: $${reservationData.totalPrice}\n` +
      `⚙️ ${t.reservation.transmission}: ${reservationData.transmission}\n` +
      `⛽ ${t.reservation.fuel}: ${reservationData.fuelType}\n\n` +
      `*${t.reservationMessages.PaymentMethod}*\n` +
      `💳 ${t.reservation.paymentMethod}: ${reservationData.paymentMethod}\n` +
      `📍 ${t.reservation.deliveryAddress}: ${reservationData.deliveryAddress || t.reservationMessages.defaultDeliveryAddress}\n` +
      `📝 ${t.reservation.additionalNotes}: ${reservationData.additionalNotes || "-"}\n\n` +
      `${t.reservationMessages.ThankYou}\n` +
      `${t.reservationMessages.ContactInfo}`
    );

    // Abrir WhatsApp con el mensaje formateado
    const whatsappUrl = `https://wa.me/61421602018?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Cerrar el formulario después de enviar
    onClose();
  };

  const { language } = useLanguage();
  const t = languages[language];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto pt-16 sm:pt-24"
    >
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <div className="min-h-screen py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl mx-auto px-4"
        >
          <div className="bg-gradient-to-b from-[#C47369] to-[#D88C7A] shadow-2xl rounded-xl p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all z-50"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 mb-6 pt-4">
              <div className="w-full md:w-1/3">
                {car.imageUrls && car.imageUrls.length > 0 && (
                  <div className="rounded-lg overflow-hidden shadow-lg h-48 md:h-64">
                    <img 
                      src={car.imageUrls[0]} 
                      alt={`${car.brand} ${car.model}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-bold mb-2 text-center md:text-left">
                  {t.reservation.title.replace("{carBrand}", car.brand).replace("{carModel}", car.model)}
                </h2>

                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-2xl font-bold text-center md:text-left text-yellow-300">
                      ${car.price} <span className="text-lg text-white/70">/día</span>
                    </p>
                    {totalDays > 1 && (
                      <p className="text-sm text-white/90">
                        Total por {totalDays} días: <span className="font-bold text-yellow-300">${car.price * totalDays}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 text-sm text-white/90">
                    <div className="flex items-center">
                      <span className="mr-1">⛽</span> {car.fuelType}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">⚙️</span> {car.transmission}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium">
                    <User className="h-4 w-4 mr-2" />
                    {t.reservation.buyerName}
                  </label>
                  <input
                    type="text"
                    name="buyerName"
                    className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    required
                    placeholder={t.reservation.buyerName}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium">
                    <Mail className="h-4 w-4 mr-2" />
                    {t.reservation.email}
                  </label>
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
                  <label className="flex items-center text-sm font-medium">
                    <Phone className="h-4 w-4 mr-2" />
                    {t.reservation.phone}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    required
                    placeholder={t.reservation.phone}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium">
                    <FileText className="h-4 w-4 mr-2" />
                    {t.reservation.idType}
                  </label>
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
                  <label className="flex items-center text-sm font-medium">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t.reservation.startDate}
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    required
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium">
                    <Clock className="h-4 w-4 mr-2" />
                    {t.reservation.endDate}
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    required
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t.reservation.paymentMethod}
                </label>
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
                <label className="flex items-center text-sm font-medium">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t.reservation.deliveryAddress}
                </label>
                <div className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white">
                  {t.reservationMessages.defaultDeliveryAddress}
                </div>
                <input
                  type="hidden"
                  name="deliveryAddress"
                  value={t.reservationMessages.defaultDeliveryAddress}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t.reservation.additionalNotes}
                </label>
                <textarea
                  name="additionalNotes"
                  className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent h-24"
                  placeholder={t.reservation.additionalNotes}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
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
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
  