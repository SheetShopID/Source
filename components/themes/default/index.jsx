// /components/themes/default/index.jsx
export default function DefaultTheme({ shop }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>{shop.name}</h1>
      <p>WhatsApp: {shop.wa}</p>

      <hr />

      <p style={{ opacity: 0.6 }}>
        Tema default — belum dikustomisasi
      </p>
    </div>
  );
}
