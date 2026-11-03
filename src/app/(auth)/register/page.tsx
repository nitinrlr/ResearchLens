import type { Metadata } from "next";

import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Create account",
};

// A Server Component so it can set the title. The form itself needs the
// browser, so it lives in register-form.tsx.
export default function RegisterPage() {
  return <RegisterForm />;
}
