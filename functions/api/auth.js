// Cloudflare Pages Function: Email Login Endpoint
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = crypto.randomUUID();
    const userId = crypto.randomUUID();

    if (env.DB) {
      await env.DB.prepare(
        `INSERT INTO users (id, email) VALUES (?1, ?2)
         ON CONFLICT(email) DO UPDATE SET email=email`
      ).bind(userId, email).run();

      const userRow = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
      const resolvedUserId = userRow ? userRow.id : userId;

      await env.DB.prepare(
        `INSERT INTO auth_sessions (token, user_email, expires_at)
         VALUES (?, ?, datetime('now', '+30 days'))`
      ).bind(token, email).run();

      return new Response(JSON.stringify({
        success: true,
        email,
        token,
        userId: resolvedUserId,
        message: 'Signed in with email'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fallback if local/mock environment without D1 bound
    return new Response(JSON.stringify({
      success: true,
      email,
      token,
      userId,
      mode: 'mock'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
