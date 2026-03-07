const TOKEN_KEY = "tradex_token";
const EMAIL_KEY = "tradex_email";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export function setEmail(email) {
  localStorage.setItem(EMAIL_KEY, email);
}

export function getEmail() {
  return localStorage.getItem(EMAIL_KEY);
}
