import {
  ApiError,
  getAdmin,
  getContent,
  hashPassword,
  isRecord,
  jsonResponse,
  readJson,
  sanitizeContent,
  saveContent,
  signAdminToken,
  toSubmission,
  verifyAdminToken,
  verifyPassword,
  type D1Database,
  type PagesContext
} from '../_shared/api';

function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return jsonResponse({ error: error.message }, error.status);
  }
  console.error('Pages API request failed:', error);
  return jsonResponse({ error: 'An unexpected server error occurred.' }, 500);
}

async function checkLoginRateLimit(db: D1Database, request: Request): Promise<void> {
  const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
  const ipHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(clientIp));
  const key = Array.from(new Uint8Array(ipHash), (byte) => byte.toString(16).padStart(2, '0')).join('');
  const now = Date.now();
  const resetAt = now + 15 * 60 * 1000;
  const record = await db.prepare(`
    INSERT INTO login_attempts (ip_hash, attempts, expires_at)
    VALUES (?, 1, ?)
    ON CONFLICT(ip_hash) DO UPDATE SET
      attempts = CASE WHEN login_attempts.expires_at <= ? THEN 1 ELSE login_attempts.attempts + 1 END,
      expires_at = CASE WHEN login_attempts.expires_at <= ? THEN excluded.expires_at ELSE login_attempts.expires_at END
    RETURNING attempts, expires_at
  `).bind(key, resetAt, now, now).first<{ attempts: number; expires_at: number }>();

  if (record && record.attempts > 10) {
    const waitMinutes = Math.ceil((record.expires_at - now) / 60000);
    throw new ApiError(429, `Too many login attempts. Please wait ${waitMinutes} minute(s) before trying again.`);
  }
}

async function handleLogin(context: PagesContext): Promise<Response> {
  const body = await readJson(context.request);
  if (typeof body.username !== 'string' || typeof body.password !== 'string' || !body.username || !body.password) {
    throw new ApiError(400, 'Username and password are required.');
  }

  await checkLoginRateLimit(context.env.DB, context.request);
  const admin = await getAdmin(context.env.DB);
  if (admin.username !== body.username || !(await verifyPassword(body.password, admin.passwordHash))) {
    throw new ApiError(401, 'Invalid admin username or password.');
  }

  const clientIp = context.request.headers.get('CF-Connecting-IP') || 'unknown';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(clientIp));
  const ipHash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  await context.env.DB.prepare('DELETE FROM login_attempts WHERE ip_hash = ?').bind(ipHash).run();

  return jsonResponse({
    success: true,
    token: await signAdminToken(context.env, body.username),
    user: { username: body.username, role: 'admin', brand: 'Devlophic' }
  });
}

async function handleContact(context: PagesContext): Promise<Response> {
  const body = await readJson(context.request);
  if (
    typeof body.name !== 'string' ||
    typeof body.email !== 'string' ||
    typeof body.message !== 'string' ||
    !body.name.trim() ||
    !body.email.trim() ||
    !body.message.trim()
  ) {
    throw new ApiError(400, 'Please provide your name, email, and project details.');
  }

  const name = body.name.trim();
  const email = body.email.trim().toLowerCase();
  const message = body.message.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, 'Please provide a valid email address.');
  }
  if (name.length > 200 || email.length > 320 || message.length > 10000) {
    throw new ApiError(400, 'One or more fields exceed the allowed length.');
  }

  const id = `inq-${Date.now()}-${crypto.randomUUID().slice(0, 5)}`;
  const createdAt = new Date().toISOString();
  if (context.env?.DB) {
    try {
      await context.env.DB.prepare(`
        INSERT INTO submissions (id, name, email, phone, service_category, message, created_at, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'unread')
      `).bind(
        id,
        name,
        email,
        typeof body.phone === 'string' ? body.phone.trim() : '',
        typeof body.serviceCategory === 'string' ? body.serviceCategory : 'Website Development',
        message,
        createdAt
      ).run();
    } catch (dbErr) {
      console.warn('Could not persist submission to D1:', dbErr);
    }
  }

  return jsonResponse({
    success: true,
    message: 'Inquiry received successfully. The Devlophic team will get back to you shortly.',
    submissionId: id
  }, 201);
}

async function handleContent(context: PagesContext): Promise<Response> {
  if (context.request.method === 'GET') {
    return jsonResponse(await getContent(context.env.DB));
  }
  if (context.request.method === 'PUT') {
    await verifyAdminToken(context.env, context.request);
    const body = await readJson(context.request);
    const content = sanitizeContent(body);
    await saveContent(context.env.DB, content);
    return jsonResponse({ success: true, message: 'Content updated successfully', content });
  }
  throw new ApiError(405, 'Method not allowed.');
}

async function handleSubmissions(context: PagesContext, id?: string): Promise<Response> {
  await verifyAdminToken(context.env, context.request);
  if (!id && context.request.method === 'GET') {
    const result = await context.env.DB.prepare(`
      SELECT id, name, email, phone, service_category, message, created_at, status
      FROM submissions ORDER BY created_at DESC
    `).all<Record<string, unknown>>();
    return jsonResponse(result.results.map(toSubmission));
  }
  if (id && context.request.method === 'PATCH') {
    const body = await readJson(context.request);
    if (!['unread', 'read', 'contacted'].includes(String(body.status))) {
      throw new ApiError(400, 'Invalid submission status.');
    }
    const result = await context.env.DB.prepare(
      'UPDATE submissions SET status = ? WHERE id = ? RETURNING id, name, email, phone, service_category, message, created_at, status'
    ).bind(body.status, id).first<Record<string, unknown>>();
    if (!result) {
      throw new ApiError(404, 'Submission not found.');
    }
    return jsonResponse({ success: true, submission: toSubmission(result) });
  }
  throw new ApiError(405, 'Method not allowed.');
}

async function handleProjects(context: PagesContext, id?: string): Promise<Response> {
  await verifyAdminToken(context.env, context.request);
  const content = await getContent(context.env.DB);
  content.projects ??= [];

  if (!id && context.request.method === 'POST') {
    const body = await readJson(context.request);
    const project = {
      id: `proj-${Date.now()}`,
      title: typeof body.title === 'string' && body.title ? body.title : 'Untitled Website Project',
      category: typeof body.category === 'string' && body.category ? body.category : 'Business Website',
      shortDescription: typeof body.shortDescription === 'string' ? body.shortDescription : '',
      fullDescription: typeof body.fullDescription === 'string' ? body.fullDescription : '',
      tags: Array.isArray(body.tags) ? body.tags.filter((tag): tag is string => typeof tag === 'string') : [],
      liveUrl: typeof body.liveUrl === 'string' ? body.liveUrl : '',
      githubUrl: typeof body.githubUrl === 'string' ? body.githubUrl : '',
      externalUrl: typeof body.externalUrl === 'string' ? body.externalUrl : '',
      imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl : '/devlophiclogo.jpeg',
      featured: Boolean(body.featured),
      order: content.projects.length + 1
    };
    content.projects.unshift(project);
    await saveContent(context.env.DB, content);
    return jsonResponse({ success: true, project }, 201);
  }

  const index = id ? content.projects.findIndex((project) => project.id === id) : -1;
  if (id && context.request.method === 'PUT') {
    if (index < 0) {
      throw new ApiError(404, 'Project not found.');
    }
    const body = await readJson(context.request);
    if (!isRecord(body)) {
      throw new ApiError(400, 'Invalid project payload.');
    }
    content.projects[index] = { ...content.projects[index], ...body, id };
    await saveContent(context.env.DB, content);
    return jsonResponse({ success: true, project: content.projects[index] });
  }
  if (id && context.request.method === 'DELETE') {
    content.projects = content.projects.filter((project) => project.id !== id);
    await saveContent(context.env.DB, content);
    return jsonResponse({ success: true, message: 'Project removed successfully' });
  }
  throw new ApiError(405, 'Method not allowed.');
}

async function handleUpload(context: PagesContext): Promise<Response> {
  await verifyAdminToken(context.env, context.request);
  if (context.request.method !== 'POST') {
    throw new ApiError(405, 'Method not allowed.');
  }
  if (!context.env.UPLOADS) {
    throw new ApiError(503, 'Image storage is not configured.');
  }

  const formData = await context.request.formData();
  const file = formData.get('image');
  if (!(file instanceof File) || file.size === 0) {
    throw new ApiError(400, 'No image file uploaded.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new ApiError(413, 'Image exceeds the 10 MB limit.');
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const allowedTypes: Record<string, string[]> = {
    jpg: ['image/jpeg'],
    jpeg: ['image/jpeg'],
    png: ['image/png'],
    webp: ['image/webp'],
    svg: ['image/svg+xml'],
    gif: ['image/gif']
  };
  if (!allowedTypes[extension]?.includes(file.type.toLowerCase())) {
    throw new ApiError(400, 'Only JPEG, PNG, WebP, SVG, and GIF images are allowed.');
  }

  const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80) || 'image';
  const filename = `${baseName}_${Date.now()}_${crypto.randomUUID().slice(0, 8)}.${extension}`;
  await context.env.UPLOADS.put(filename, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000, immutable'
    }
  });

  return jsonResponse({
    success: true,
    url: `/uploads/${encodeURIComponent(filename)}`,
    filename
  });
}

async function handleRequest(
  context: PagesContext
): Promise<Response> {
  const segments = context.params.path;
  const parts = Array.isArray(segments) ? segments : segments ? [segments] : [];
  const route = parts.join('/');

  if (route === 'content') {
    return handleContent(context);
  }
  if (route === 'contact' && context.request.method === 'POST') {
    return handleContact(context);
  }
  if (route === 'auth/login' && context.request.method === 'POST') {
    return handleLogin(context);
  }
  if (route === 'auth/me' && context.request.method === 'GET') {
    const user = await verifyAdminToken(context.env, context.request);
    return jsonResponse({ authenticated: true, user });
  }
  if (route === 'auth/change-password' && context.request.method === 'POST') {
    const user = await verifyAdminToken(context.env, context.request);
    const body = await readJson(context.request);
    if (typeof body.currentPassword !== 'string' || typeof body.newPassword !== 'string') {
      throw new ApiError(400, 'Current and new passwords are required.');
    }
    const admin = await getAdmin(context.env.DB);
    if (admin.username !== user.username || !(await verifyPassword(body.currentPassword, admin.passwordHash))) {
      throw new ApiError(400, 'Current password is incorrect');
    }
    if (body.newPassword.length < 8) {
      throw new ApiError(400, 'New password must be at least 8 characters long');
    }
    const hash = await hashPassword(body.newPassword);
    await context.env.DB.prepare(
      'UPDATE admin_users SET password_hash = ?, updated_at = ? WHERE username = ?'
    ).bind(hash, new Date().toISOString(), user.username).run();
    return jsonResponse({ success: true, message: 'Password updated successfully' });
  }
  if (route === 'submissions') {
    return handleSubmissions(context);
  }
  if (parts[0] === 'submissions' && parts.length === 2) {
    return handleSubmissions(context, parts[1]);
  }
  if (route === 'projects') {
    return handleProjects(context);
  }
  if (parts[0] === 'projects' && parts.length === 2) {
    return handleProjects(context, parts[1]);
  }
  if (route === 'upload') {
    return handleUpload(context);
  }
  throw new ApiError(404, 'API endpoint not found.');
}

export const onRequest = async (context: PagesContext): Promise<Response> => {
  try {
    return await handleRequest(context);
  } catch (error) {
    return errorResponse(error);
  }
};
