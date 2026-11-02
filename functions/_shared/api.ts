import bcrypt from 'bcryptjs';
import adminSeed from '../../data/admin.json';
import contentSeed from '../../data/content.json';
import type { ContactSubmission, WebsiteContent } from '../../src/types';

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface R2ObjectBody {
  body: ReadableStream<Uint8Array>;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
}

export interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(
    key: string,
    value: ReadableStream<Uint8Array> | ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }
  ): Promise<unknown>;
}

export interface CloudflareEnv {
  DB: D1Database;
  UPLOADS?: R2Bucket;
  JWT_SECRET: string;
}

export interface PagesContext {
  request: Request;
  env: CloudflareEnv;
  params: { path?: string | string[] };
}

export interface AdminClaims {
  username: string;
  role: 'admin';
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
  }
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const body = await request.text();
  if (body.length > 1_000_000) {
    throw new ApiError(413, 'Request body is too large.');
  }

  try {
    const parsed: unknown = JSON.parse(body);
    if (!isRecord(parsed)) {
      throw new ApiError(400, 'Invalid request payload.');
    }
    return parsed;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, 'Invalid JSON payload.');
  }
}

export async function getContent(db: D1Database): Promise<WebsiteContent> {
  const row = await db.prepare(
    'SELECT value FROM site_state WHERE key = ?'
  ).bind('content').first<{ value: string }>();

  if (row) {
    return JSON.parse(row.value) as WebsiteContent;
  }

  const value = JSON.stringify(contentSeed);
  await db.prepare(
    'INSERT OR IGNORE INTO site_state (key, value, updated_at) VALUES (?, ?, ?)'
  ).bind('content', value, new Date().toISOString()).run();

  return JSON.parse(value) as WebsiteContent;
}

export async function saveContent(db: D1Database, content: WebsiteContent): Promise<void> {
  await db.prepare(`
    INSERT INTO site_state (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).bind('content', JSON.stringify(content), new Date().toISOString()).run();
}

export async function getAdmin(db: D1Database): Promise<{ username: string; passwordHash: string }> {
  const row = await db.prepare(
    'SELECT username, password_hash AS passwordHash FROM admin_users LIMIT 1'
  ).first<{ username: string; passwordHash: string }>();

  if (row) {
    return row;
  }

  await db.prepare(`
    INSERT OR IGNORE INTO admin_users (username, password_hash, updated_at)
    VALUES (?, ?, ?)
  `).bind(adminSeed.username, adminSeed.passwordHash, new Date().toISOString()).run();

  const seededAdmin = await db.prepare(
    'SELECT username, password_hash AS passwordHash FROM admin_users LIMIT 1'
  ).first<{ username: string; passwordHash: string }>();

  if (!seededAdmin) {
    throw new Error('Failed to initialize the admin account.');
  }
  return seededAdmin;
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

function encodeBase64Url(value: Uint8Array): string {
  let binary = '';
  for (const byte of value) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function toArrayBuffer(value: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(value.length);
  new Uint8Array(buffer).set(value);
  return buffer;
}

async function jwtKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    usage
  );
}

export async function signAdminToken(
  env: CloudflareEnv,
  username: string
): Promise<string> {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const payload = encodeBase64Url(new TextEncoder().encode(JSON.stringify({
    username,
    role: 'admin',
    iat: now,
    exp: now + 24 * 60 * 60
  })));
  const content = `${header}.${payload}`;
  const signature = await crypto.subtle.sign(
    'HMAC',
    await jwtKey(env.JWT_SECRET, ['sign']),
    new TextEncoder().encode(content)
  );

  return `${content}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export async function verifyAdminToken(
  env: CloudflareEnv,
  request: Request
): Promise<AdminClaims> {
  const authorization = request.headers.get('Authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) {
    throw new ApiError(401, 'Access denied: Authentication token required.');
  }
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  try {
    const [headerPart, payloadPart, signaturePart, extra] = token.split('.');
    if (!headerPart || !payloadPart || !signaturePart || extra) {
      throw new Error('Malformed token.');
    }

    const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(headerPart))) as { alg?: string };
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(payloadPart))) as {
      username?: unknown;
      role?: unknown;
      exp?: unknown;
    };
    const validSignature = await crypto.subtle.verify(
      'HMAC',
      await jwtKey(env.JWT_SECRET, ['verify']),
      toArrayBuffer(decodeBase64Url(signaturePart)),
      new TextEncoder().encode(`${headerPart}.${payloadPart}`)
    );

    if (
      header.alg !== 'HS256' ||
      !validSignature ||
      typeof payload.username !== 'string' ||
      payload.role !== 'admin' ||
      typeof payload.exp !== 'number' ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      throw new Error('Invalid token.');
    }

    return { username: payload.username, role: 'admin' };
  } catch {
    throw new ApiError(403, 'Session expired or invalid token. Please log in again.');
  }
}

export function sanitizeContent(value: Record<string, unknown>): WebsiteContent {
  const content = structuredClone(value) as unknown as WebsiteContent;
  content.brandName = 'Devlophic';
  if (content.contact && typeof content.contact === 'object') {
    const contact = content.contact as WebsiteContent['contact'] & Record<string, unknown>;
    delete contact.location;
    delete contact.address;
    delete contact.city;
    delete contact.country;
  }
  return content;
}

export function toSubmission(row: Record<string, unknown>): ContactSubmission {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone ?? ''),
    serviceCategory: String(row.service_category),
    timeline: String(row.timeline ?? ''),
    message: String(row.message),
    createdAt: String(row.created_at),
    status: row.status as ContactSubmission['status']
  };
}
