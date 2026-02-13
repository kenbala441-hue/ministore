export default function AdminGuard({ isAdmin, children, setView }) {
  if (!isAdmin) {
    setView("home"); // ou "login"
    return null;
  }

  return children;
}