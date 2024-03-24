import "./globals.css";
import { AuthProvider } from "./provider";

export const metadata = {
  title: "Timesheet Management System",
  description: "Timesheet Management System, dissertation project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
