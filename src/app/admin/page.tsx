import { getProductsData, getSalesData, getUserData } from "@/app/admin/_actions/adminapislice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/formatters";


async function AdminDeshboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductsData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={
          "Total number of sales : " + formatNumber(salesData.numberOfSales)
        }
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`Total number of orders : ${formatCurrency(
          userData.averageValuePerUser
        )}`}
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title="Products"
        subtitle={`Active products : ${formatNumber(
          productData.activeProducts
        )}`}
        body={`Inactive products : ${formatNumber(
          productData.inactiveProducts
        )}`}
      />
    </div>
  );
}

export default AdminDeshboard;

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}
