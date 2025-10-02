"use client";
import { Header } from "@/components";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen">
      <Header user={session.user} />

      <div className="container py-10">{children}</div>
    </main>
  );
};
export default Layout;
