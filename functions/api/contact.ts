import {
  ApiError,
  readJson,
  type PagesContext
} from '../_shared/api';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
  'Content-Type': 'application/json; charset=utf-8'
};

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  try {
    const body = await readJson(context.request);
    if (
      typeof body.name !== 'string' ||
      typeof body.email !== 'string' ||
      typeof body.message !== 'string' ||
      !body.name.trim() ||
      !body.email.trim() ||
      !body.message.trim()
    ) {
      return new Response(
        JSON.stringify({ error: 'Please provide your name, email, and project details.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const name = body.name.trim();
    const email = body.email.trim().toLowerCase();
    const message = body.message.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (name.length > 200 || email.length > 320 || message.length > 10000) {
      return new Response(
        JSON.stringify({ error: 'One or more fields exceed the allowed length.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const id = `inq-${Date.now()}-${crypto.randomUUID().slice(0, 5)}`;
    const createdAt = new Date().toISOString();

    // If D1 database is configured, store the submission
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
      } catch (dbError) {
        console.warn('Could not persist enquiry to D1 database:', dbError);
        // Continue and return success so client form succeeds
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Inquiry received successfully. The Devlophic team will get back to you shortly.',
        submissionId: id
      }),
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Contact submission error:', error);
    const message = error?.message || 'An unexpected error occurred while processing your message.';
    const status = error instanceof ApiError ? error.status : 500;
    return new Response(
      JSON.stringify({ error: message }),
      { status, headers: corsHeaders }
    );
  }
}
