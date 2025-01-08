import CustomersTable from '@/app/ui/customers/table';
import { FormattedCustomersTable } from '@/app/lib/definitions';
import "../../ui/global.css"
import SideNav from '@/app/ui/dashboard/sidenav';

export default function Page() {
  
  const customers: FormattedCustomersTable[] = [
    {
      id: "1", // Convertido a string
      name: "John Doe",
      email: "john.doe@example.com",
      image_url: "/profile1.jpg",
      total_pending: "150",
      total_paid: "500",
      total_invoices: 3,
    },
    {
      id: "2", // Convertido a string
      name: "Jane Smith",
      email: "jane.smith@example.com",
      image_url: "/profile2.jpg",
      total_pending: "200",
      total_paid: "800",
      total_invoices: 5,
    },
  ];

  return (
    <div>
      <CustomersTable customers={customers} />
    </div>
  );
}
