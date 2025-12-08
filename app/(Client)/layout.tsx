import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "100vh" }}>{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}
