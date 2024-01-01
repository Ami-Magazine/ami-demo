import "../styles/globals.css";

export const metadata = {
  title: "Daily Torah Study | Ami Magazine",
  description: "Ami is a weekly subscription-based publication focused on the daily study cycles of Chumash, Rambam, Tanya & more, & features fresh content from a variety of Torah sources",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}