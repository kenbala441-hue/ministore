// Lazy loading
import { lazy } from "react";

// 🔹 Flows
export const AuthorIntroScreen = lazy(() => import("./flows/AuthorIntroScreen"));
export const AuthorTermsScreen = lazy(() => import("./flows/AuthorTermsScreen"));
export const AuthorSubmissionScreen = lazy(() => import("./flows/AuthorSubmissionScreen"));
export const AuthorContractScreen = lazy(() => import("./flows/AuthorContractScreen"));
export const AuthorIdentityScreen = lazy(() => import("./flows/AuthorIdentityScreen"));
export const AuthorApplyScreen = lazy(() => import("./flows/AuthorApplyScreen"));
export const AuthorAccessScreen = lazy(() => import("./flows/AuthorAccessScreen"));

// 🔹 Dashboards
export const AuthorDashboardScreen = lazy(() => import("./dashboards/AuthorDashboardScreen"));
export const StudioDashboard = lazy(() => import("./dashboards/StudioDashboard"));
