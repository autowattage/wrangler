import crypto from "crypto";

const MAX_AGE_S = 60 * 60 * 24 * 7;

const secret = () => process.env.SESSION_SECRET || process.env.SHOPSECRET;
const sign = (data) => crypto.createHmac("sha256", secret()).update(data).digest("base64url");

export function createSessionToken(email) {
  const payload = Buffer.from(JSON.stringify({
    email,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_S
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!session.email || !session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export function getSession(req) {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === "session") {
      try {
        return verifySessionToken(decodeURIComponent(part.slice(idx + 1).trim()));
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function setSessionCookie(req, res, email) {
  const host = (req.headers.host || "").toLowerCase();
  const secure = !host.startsWith("localhost") && !host.startsWith("127.0.0.1");
  res.setHeader("Set-Cookie",
    `session=${encodeURIComponent(createSessionToken(email))}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE_S}${secure ? "; Secure" : ""}`);
}
