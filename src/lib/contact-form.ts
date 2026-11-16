export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_MESSAGE_LENGTH = 2000;

// Something@something.something. The browser's type="email" check runs first,
// so this only has to stop requests that skip the form.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactFields = { name: string; email: string; message: string | null };

/** Reads the contact form, or returns the message for what's wrong with it. */
export function readContactForm(formData: FormData): ContactFields | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || name.length > MAX_NAME_LENGTH) {
    return { error: `Enter your name, up to ${MAX_NAME_LENGTH} characters.` };
  }

  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address." };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { error: `Keep your message under ${MAX_MESSAGE_LENGTH} characters.` };
  }

  return { name, email, message: message || null };
}

/**
 * Spam bots fill in every field, including one people never see. A filled-in
 * "website" field means the form wasn't sent by a person.
 */
export function isLikelyBot(formData: FormData) {
  return String(formData.get("website") ?? "") !== "";
}
