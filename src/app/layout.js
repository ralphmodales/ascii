import localFont from "next/font/local";
import "./globals.css";

const appleFont = localFont({
  src: "./fonts/SF-Pro.woff2",
  variable: "--font-sf-pro",
  weight: "100 900",
  display: 'swap',
});

export const metadata = {
  title: "ASCII Art Converter",
  description: "Made by @ralphmodales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${appleFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
