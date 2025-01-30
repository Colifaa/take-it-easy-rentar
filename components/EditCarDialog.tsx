"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCarImage } from "../supabase/supabaseEdit"; // Actualiza la importación de la función que maneja la actualización de la imagen
import supabase from "@/supabase/authTest";

interface EditCarDialogProps {
  carId: string;
  initialData: {
    brand: string;
    model: string;
    year: number;
    price: number;
    transmission: string;
    fuelType: string;
    imageUrl: string;
    description: string;
    available: boolean;
  };
}

export function EditCarDialog({ carId, initialData }: EditCarDialogProps) {
  const [editedCar, setEditedCar] = useState(initialData);
  console.log(editedCar.fuelType, "editedCar");



  const [isOpen, setIsOpen] = useState(false); // Formulario cerrado por defecto
  const [imagePreview, setImagePreview] = useState<string>(initialData.imageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null); // Para mantener el archivo de imagen seleccionado

  const updateCarData = async (carId: string, carData: typeof initialData) => {
    const { data, error } = await supabase
      .from("cars")
      .update({
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        transmission: carData.transmission,
        fuelType: carData.fuelType,
        description: carData.description,
        available: carData.available
      })
      .eq("id", carId);

    console.log(carData);



    if (error) {
      console.error("Error al actualizar los datos:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  };



  const handleChange = (field: string, value: any) => {
    setEditedCar((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Vista previa de la imagen seleccionada
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Actualizar la imagen si es necesario
      if (imageFile) {
        const result = await updateCarImage(carId, imageFile);
        if (!result.success) {
          console.error("Error al actualizar la imagen:", result.message);
          return;
        }
      }

      // Actualizar los datos del coche
      const result = await updateCarData(carId, editedCar);
      if (!result.success) {
        console.error("Error al actualizar los datos:", result.message);
        return;
      }

      console.log("Vehículo actualizado correctamente.");
      setIsOpen(false);
      window.location.reload()
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  return (
    <>
      <Button  onClick={() => setIsOpen(true)}  >Editar Vehículo</Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Vehículo</DialogTitle>
            <DialogDescription>
              Actualiza la información del vehículo seleccionado.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={editedCar.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  value={editedCar.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="year">Año</Label>
                <Input
                  id="year"
                  type="number"
                  value={editedCar.year}
                  onChange={(e) => handleChange("year", Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Precio por día</Label>
                <Input
                  id="price"
                  type="number"
                  value={editedCar.price || ""}
                  onChange={(e) => handleChange("price", e.target.value === "" ? "" : Number(e.target.value))}
                />

              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="transmission">Transmisión</Label>
                <Select
                  value={editedCar.transmission}
                  onValueChange={(value) => handleChange("transmission", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fuelType">Tipo de Combustible</Label>
                <Select
                  value={editedCar.fuelType}
                  onValueChange={(value) => handleChange("fuelType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gasoline">Gasolina</SelectItem>
                    <SelectItem value="electric">Eléctrico</SelectItem>
                    <SelectItem value="diesel">Diésel</SelectItem>
                    <SelectItem value="hybrid">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Imagen del Vehículo</Label>
              <div className="flex items-center gap-2">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="w-24 h-24 object-cover"
                  />
                )}
                <Input
                  id="image"
                  type="file"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={editedCar.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={editedCar.available}
                onCheckedChange={(value) => handleChange("available", value)}
              />
              <Label htmlFor="available">Disponible para reserva</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
