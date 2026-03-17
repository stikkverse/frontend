export const validateEmail = (email: string): string => {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Must include at least one uppercase letter";
  if (!/[0-9]/.test(password)) return "Must include at least one number";
  return "";
};

export const validateConfirmPassword = (password: string, confirm: string): string => {
  if (!confirm) return "Please confirm your password";
  if (password !== confirm) return "Passwords do not match";
  return "";
};

export const validateCompanyName = (name: string): string => {
  if (!name) return "Company name is required";
  if (name.length < 2) return "Company name is too short";
  return "";
};