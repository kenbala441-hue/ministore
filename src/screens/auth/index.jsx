import PageWrapper from "./components/PageWrapper";
import LoginPage from "./pages/LoginPage";

export default function Auth({ setView }) {
  return (
    <PageWrapper>
      <LoginPage setView={setView} />
    </PageWrapper>
  );
}