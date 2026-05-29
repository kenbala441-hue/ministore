export default function NeonLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-black text-white w-full">

      {/* Fond néon animé en arrière-plan fixe */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-black to-blue-950 animate-pulse opacity-30 z-0 pointer-events-none"></div>

      {/* Contenu fluide qui prend toute la place et défile normalement */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>

    </div>
  );
}
