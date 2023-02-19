import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import NavBar from './(components)/NavBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <UserProvider>
          <NavBar/>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
