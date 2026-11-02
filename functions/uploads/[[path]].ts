import { jsonResponse, type PagesContext } from '../_shared/api';

export const onRequestGet = async ({ env, params }: PagesContext): Promise<Response> => {
  if (!env.UPLOADS) {
    return jsonResponse({ error: 'Image storage is not configured.' }, 503);
  }

  const segments = params.path;
  const key = Array.isArray(segments) ? segments.join('/') : segments;
  if (!key || key.includes('..')) {
    return jsonResponse({ error: 'Upload not found.' }, 404);
  }

  try {
    const object = await env.UPLOADS.get(key);
    if (!object) {
      return jsonResponse({ error: 'Upload not found.' }, 404);
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('ETag', object.httpEtag);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Failed to read uploaded file from R2:', error);
    return jsonResponse({ error: 'Failed to retrieve uploaded file.' }, 500);
  }
};
