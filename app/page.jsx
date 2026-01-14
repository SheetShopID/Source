import ShopPage from "@/components/ShopPage";

export default async function Page() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-shop`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div>Toko tidak ditemukan</div>;
  }

  const { shop, products } = await res.json();

  return <ShopPage shop={shop} products={products} />;
}
