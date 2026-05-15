export function validateMobile(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Mobile number is required";
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 7)  return "Mobile number must have at least 7 digits";
  if (digits.length > 15) return "Mobile number must not exceed 15 digits";
  if (!/^\+?[\d\s\-(). ]{7,20}$/.test(trimmed)) return "Enter a valid mobile number";
  return "";
}

export function validateEmail(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required";
  if (!/^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/.test(trimmed)) return "Enter a valid email address";
  return "";
}

export function validatePassword(value: string): string {
  if (!value)                        return "Password is required";
  if (/\s/.test(value))             return "Password must not contain spaces";
  if (value.length < 8)             return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(value))         return "Must include at least 1 uppercase letter";
  if (!/[a-z]/.test(value))         return "Must include at least 1 lowercase letter";
  if (!/[0-9]/.test(value))         return "Must include at least 1 number";
  if (!/[^A-Za-z0-9]/.test(value))  return "Must include at least 1 special character";
  return "";
}
