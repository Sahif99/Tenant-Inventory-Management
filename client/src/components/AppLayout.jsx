import Navbar from "./Navbar";

export default function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-4">{children}</main>
    </>
  );
}
