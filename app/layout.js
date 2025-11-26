export const metadata = {
  title: "TokoInstan",
  description: "Generate toko dari Google Sheet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "Inter, sans-serif",
          background: "#f5f5f5",
        }}
      >
        {children}
      </body>
    </html>
  );
}
