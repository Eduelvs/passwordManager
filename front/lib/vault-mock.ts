export type VaultEntry = {
  id: string;
  platform: string;
  login: string;
  password: string;
};

const STORAGE_KEY = "pm-vault-mock-v1";

export const DEFAULT_VAULT: VaultEntry[] = [
  {
    id: "1",
    platform: "GitHub",
    login: "eduardo@email.com",
    password: "gh_xK9mN2pQ",
  },
  {
    id: "2",
    platform: "Notion",
    login: "workspace.edu",
    password: "notion#2024",
  },
  {
    id: "3",
    platform: "Nubank",
    login: "11999999999",
    password: "nu_mock_8f3a",
  },
];

function parse(raw: string | null): VaultEntry[] | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return null;
    return v as VaultEntry[];
  } catch {
    return null;
  }
}

export function readVault(): VaultEntry[] {
  if (typeof window === "undefined") return DEFAULT_VAULT;
  const parsed = parse(localStorage.getItem(STORAGE_KEY));
  return parsed && parsed.length > 0 ? parsed : DEFAULT_VAULT;
}

export function writeVault(entries: VaultEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function appendVault(
  entry: Omit<VaultEntry, "id">
): VaultEntry {
  const list = readVault();
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now());
  const next: VaultEntry = { ...entry, id };
  writeVault([...list, next]);
  return next;
}

export function replaceVaultPassword(id: string): VaultEntry[] {
  const list = readVault();
  const newPass = `nova_${Math.random().toString(36).slice(2, 12)}`;
  const updated = list.map((e) =>
    e.id === id ? { ...e, password: newPass } : e
  );
  writeVault(updated);
  return updated;
}
