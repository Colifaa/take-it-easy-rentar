"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function EditCarDialog() {
  // Datos iniciales estáticos para mostrar
  const [editedCar, setEditedCar] = useState({
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    price: 50,
    transmission: "automatic",
    fuelType: "gasoline",
    imageUrl: "https://via.placeholder.com/150",
    description: "Un auto confiable y económico.",
    available: true,
  });

  const [isOpen, setIsOpen] = useState(true); // Controlar visibilidad del diálogo

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Vehículo</DialogTitle>
          <DialogDescription>
            Actualiza la información del vehículo seleccionado.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" value={editedCar.brand} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" value={editedCar.model} disabled />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="year">Año</Label>
              <Input id="year" type="number" value={editedCar.year} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Precio por día</Label>
              <Input
                id="price"
                type="number"
                value={editedCar.price}
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="transmission">Transmisión</Label>
              <Select value={editedCar.transmission} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automática</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fuelType">Tipo de Combustible</Label>
              <Select value={editedCar.fuelType} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasolina</SelectItem>
                  <SelectItem value="diesel">Diésel</SelectItem>
                  <SelectItem value="electric">Eléctrico</SelectItem>
                  <SelectItem value="hybrid">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">URL de la Imagen</Label>
            <Input id="imageUrl" type="url" value={editedCar.imageUrl} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" value={editedCar.description} disabled />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="available" checked={editedCar.available} disabled />
            <Label htmlFor="available">Disponible para reserva</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cerrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
