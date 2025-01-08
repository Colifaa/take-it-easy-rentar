import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import "../../ui/global.css";
import { CreateInvoice, DeleteInvoice, UpdateInvoice } from "@/app/ui/invoices/buttons";
import InvoiceStatus from "@/app/ui/invoices/status";

export default function page() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Invoices", href: "/invoices" },
    { label: "Details", href: "/invoices/details", active: true },
  ];

  return (
    <div>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <InvoiceStatus status="pending" />
    </div>
  );
}
