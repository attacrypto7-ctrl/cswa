export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  avatarUrl: string | null;
}

export function extractAvatarUrl(googleProfile: {
  photos?: Array<{ value: string }>;
  picture?: string;
}): string | null {
  return googleProfile.photos?.[0]?.value || googleProfile.picture || null;
}

export function saveGoogleUser(user: GoogleUser) {
  const normalized: GoogleUser = {
    ...user,
    avatarUrl: user.avatarUrl ?? (user.picture as string | null) ?? null,
    picture: user.picture || user.avatarUrl || "",
  };
  localStorage.setItem("balasin_google_user", JSON.stringify(normalized));
  try {
    window.dispatchEvent(new Event("balasin:auth-changed"));
  } catch {
    void 0;
  }
  try {
    const tenantsRaw = localStorage.getItem("balasin_tenants_cache");
    if (tenantsRaw) {
      const tenants = JSON.parse(tenantsRaw);
      const idx = tenants.findIndex((t: { email: string }) => t.email === normalized.email);
      if (idx >= 0) {
        tenants[idx].avatarUrl = normalized.avatarUrl;
        localStorage.setItem("balasin_tenants_cache", JSON.stringify(tenants));
      }
    }
  } catch {
    void 0;
  }
}

export function getGoogleUser(): GoogleUser | null {
  try {
    const data = localStorage.getItem("balasin_google_user");
    if (!data) return null;
    const parsed = JSON.parse(data) as GoogleUser & { avatarUrl?: string | null };
    return {
      name: parsed.name,
      email: parsed.email,
      picture: parsed.picture || parsed.avatarUrl || "",
      avatarUrl: parsed.avatarUrl ?? parsed.picture ?? null,
    };
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

  const pic = `https://ui-avatars.com/api/?name=${initials}&background=10b981&color=fff&size=200`;
  const user: GoogleUser = {
    name: username.replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    email: email,
    picture: pic,
    avatarUrl: pic,
  };
  saveGoogleUser(user);
  return user;
}

export function handleLogout() {
  try {
    localStorage.removeItem("balasin_token");
  } catch {
    void 0;
  }
  try {
    localStorage.removeItem("balasin_role");
  } catch {
    void 0;
  }
  try {
    localStorage.removeItem("balasin_tenant");
  } catch {
    void 0;
  }
  try {
    localStorage.removeItem("balasin_google_user");
  } catch {
    void 0;
  }
  try {
    localStorage.removeItem("balasin_tenants_cache");
  } catch {
    void 0;
  }
  try {
    sessionStorage.removeItem("balasin_admin_auth");
  } catch {
    void 0;
  }
  try {
    window.dispatchEvent(new Event("balasin:auth-changed"));
  } catch {
    void 0;
  }
}
