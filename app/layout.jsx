export const metadata = {
  title: "TokoInstan",
  description: "Platform toko otomatis multi-subdomain",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
