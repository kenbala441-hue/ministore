export default function NeonLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center p-6 overflow-hidden">

      {/* Fond néon animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900 animate-pulse opacity-40"></div>

      {/* Contenu */}
      <div className="relative z-10 w-full max-w-lg">
        {children}
      </div>

    </div>
  );
}