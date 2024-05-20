import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import React from "react";

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: {
      pricePaidInCents: true,
    },
    _count: true,
  });

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, orderCount] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: {
        pricePaidInCents: true,
      },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderCount._sum.pricePaidInCents || 0) / 100 / userCount / 100,
  };
}

async function getProductsData() {
  const [activeProducts, inactiveProducts] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase : false } }),
  ]);

  return {
    activeProducts,
    inactiveProducts,
  };
}

async function AdminDeshboard() {
  const [salesData, userData , productData] = await Promise.all([
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
