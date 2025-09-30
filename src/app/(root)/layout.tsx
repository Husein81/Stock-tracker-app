import { Header } from "@/components";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="container py-10">{children}</div>
    </main>
  );
};
export default Layout;
