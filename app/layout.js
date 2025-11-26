export const metadata = {
  title: "Toko Instan",
  description: "Landing page toko instan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
