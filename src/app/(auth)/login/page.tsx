import type { Metadata } from "next";

import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

// A Server Component so it can set the title. The form itself needs the
// browser, so it lives in login-form.tsx.
export default function LoginPage() {
  return <LoginForm />;
}
