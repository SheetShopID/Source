// app/layout.jsx
export const metadata = {
  title: "My App",
  description: "Next.js App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children} {/* semua page akan dirender di sini */}
      </body>
    </html>
  );
}
