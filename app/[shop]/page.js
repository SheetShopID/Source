import { db } from "../../firebase";
import { ref, get } from "firebase/database";

export default async function Shop({ params }) {
  const snap = await get(ref(db, "shops/" + params.shop));
  const data = snap.val();
  if (!data) return <div>Toko tidak ditemukan</div>;
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.desc}</p>
      <p>WA: {data.wa}</p>
    </div>
  );
}