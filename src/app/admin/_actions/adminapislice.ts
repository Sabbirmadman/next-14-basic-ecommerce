import db from "@/db/db";

async function getSalesData() {
    const data = await db.order.aggregate({
      _sum: {
        pricePaidInCents: true,
      },
      _count: true,
    });

    await wait(2000);
  
    return {
      amount: (data._sum.pricePaidInCents || 0) / 100,
      numberOfSales: data._count,
    };
  }
  

function wait (ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
      db.product.count({ where: { isAvailableForPurchase: false } }),
    ]);
  
    return {
      activeProducts,
      inactiveProducts,
    };
  }
  

  

  export {getSalesData,getUserData,getProductsData}