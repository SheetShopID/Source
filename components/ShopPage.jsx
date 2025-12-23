"use client";
import { useEffect, useState, useMemo } from "react";
import JastipTemplate from "./templates/JastipTemplate";
import FoodTemplate from "./templates/FoodTemplate";
import LaundryTemplate from "./templates/LaundryTemplate";

/******************************
 *  UTILS
 ******************************/
export const Utils = {
  formatRp: (v) =>
    isNaN(v) ? "Rp0" : "Rp" + v.toLocaleString("id-ID"),
};

/******************************
 *  CSV PARSER
 ******************************/
function parseCSV(text) {
  const [head, ...rows] = text.trim().split("\n");
  const headers = head.split(",");

  return rows.map((row) => {
    const cols = row.split(",");
    return headers.reduce((obj, h, i) => {
      obj[h.trim()] = cols[i]?.trim() ?? "";
      return obj;
    }, {});
  });
}

/******************************
 *  SHOP PAGE
 ******************************/
export default function ShopPage({ shop }) {
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/get-shop?shop=${shop}`);
        const data = await res.json();

        setShopData(data);

        if (data.sheetUrl) {
          const csv = await fetch(data.sheetUrl).then((r) => r.text());
          const parsed = parseCSV(csv);

          const mapped = parsed.map((p) => ({
            name: p.Name,
            price: Number(p.Price || 0),
            img: p.Img,
            fee: Number(p.Fee || 0),
            category: p.Category,
            promo: p.Promo,
          }));

          setProducts(mapped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [shop]);

  const Template = useMemo(() => {
    if (!shopData) return null;
    switch (shopData.theme) {
      case "makanan":
        return FoodTemplate;
      case "laundry":
        return LaundryTemplate;
      default:
        return JastipTemplate;
    }
  }, [shopData]);

  if (loading) return <p style={{ padding: 20 }}>⏳ Memuat toko...</p>;
  if (!shopData) return <p>Toko tidak ditemukan</p>;

  return (
    <Template
      shop={shopData}
      products={products}
      utils={Utils}
    />
  );
}
