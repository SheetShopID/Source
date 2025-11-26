import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Papa from "papaparse";
import SheetTable from "../components/SheetTable";

export default function Home() {
  const [shop, setShop] = useState(null);
  const [sheetData, setSheetData] = useState([]);

  useEffect(() => {
    const fetchShopData = async () => {
      const subdomain = window.location.hostname.split('.')[0];
      const docRef = doc(db, "shops", subdomain);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setShop(data);

        // Fetch Google Sheet CSV
        const res = await fetch(data.sheetUrl);
        const csvText = await res.text();
        const parsed = Papa.parse(csvText, { header: true });
        setSheetData(parsed.data);
      } else {
        console.error("Subdomain tidak ditemukan di Firebase!");
      }
    };

    fetchShopData();
  }, []);

  if (!shop) return <p>Loading...</p>;

  return (
    <div style={{ background: shop.theme.bg, color: shop.theme.accent, minHeight: '100vh', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>{shop.name}</h1>
        <p>{shop.desc}</p>
        <a href={`https://wa.me/${shop.wa}`} target="_blank" style={{ color: shop.theme.accent }}>
          Chat WA
        </a>
      </header>

      <main>
        <h2>Data Sheet</h2>
        <SheetTable data={sheetData} />
      </main>
    </div>
  );
}
