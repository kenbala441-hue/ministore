export default function NeonButton({ children, onClick, variant = "purple" }) {

  const colors = {
    purple: "from-purple-500 to-pink-500 shadow-purple-500/50",
    blue: "from-blue-500 to-cyan-500 shadow-blue-500/50",
    green: "from-green-500 to-emerald-500 shadow-green-500/50"
  };

  return (
    <button
      onClick={onClick}
      className={`
        bg-gradient-to-r ${colors[variant]}
        p-3 rounded-xl
        font-semibold
        transition-all duration-300
        hover:scale-105
        shadow-lg
      `}
    >
      {children}
    </button>
  );
}