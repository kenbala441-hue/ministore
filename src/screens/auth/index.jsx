import React from "react";

// ==========================================
// FIREBASE
// ==========================================

import {
  auth,
  db,
  googleProvider,
} from "../../firebase/index.js";

// ==========================================
// WRAPPERS & COMPONENTS
// ==========================================

import PageWrapper from "./components/PageWrapper";
import AuthForm from "./components/AuthForm";

// ==========================================
// PAGES
// ==========================================

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

// ==========================================
// RE-EXPORT FIREBASE
// ==========================================

export {
  auth,
  db,
  googleProvider,
};

// ==========================================
// RE-EXPORT COMPONENTS
// ==========================================

export {
  AuthForm,
  PageWrapper,
};

// ==========================================
// RE-EXPORT PAGES
// ==========================================

export {
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyEmailPage,
};

// ==========================================
// DEFAULT AUTH SCREEN
// ==========================================

export default function Auth({
  setView,
}) {

  return (

    <PageWrapper>

      <LoginPage
        setView={setView}
      />

    </PageWrapper>

  );

}