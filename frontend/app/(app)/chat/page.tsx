import Navbar from "@/components/sidebar/Navbar";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Navbar title="Coming Soon" subtitle="This module is under development" />
      <div className="p-6 flex items-center justify-center" style={{ minHeight: "calc(100vh - 64px)" }}>
        <div className="text-center p-8 rounded-2xl" style={{ background: "rgba(18,18,24,0.8)", border: "1px solid rgba(255,255,255,0.07)", maxWidth: 400 }}>
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#f0f0f8" }}>Under Construction</h2>
          <p className="text-sm" style={{ color: "#4a4a6a" }}>This module will be built in an upcoming sprint of the 8-day MVP plan.</p>
        </div>
      </div>
    </div>
  );
}
