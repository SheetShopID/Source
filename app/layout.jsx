import "./globals.css";

export const metadata = {
  title: "Toko Instan",
  description: "Platform toko subdomain",
};
/*tes*/
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
