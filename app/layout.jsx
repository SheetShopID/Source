import "./globals.css";

export const metadata = {
  title: "Tokoinstan",
  description: "Multi shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
