import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Green Dream Admin",
  description:
    "Admin dashboard for users and products powered by DummyJSON APIs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
