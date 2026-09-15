export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

export function saveGoogleUser(user: GoogleUser) {
  localStorage.setItem("balasin_google_user", JSON.stringify(user));
}

export function getGoogleUser(): GoogleUser | null {
  try {
    const data = localStorage.getItem("balasin_google_user");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function loginWithGoogle(email: string): GoogleUser {
  const username = email.split("@")[0];
  const initials = username
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  const user: GoogleUser = {
    name: username.replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    email: email,
    picture: `https://ui-avatars.com/api/?name=${initials}&background=10b981&color=fff&size=200`,
  };
  saveGoogleUser(user);
  return user;
}

export function handleLogout() {
  localStorage.clear();
  window.location.href = "/";
}
