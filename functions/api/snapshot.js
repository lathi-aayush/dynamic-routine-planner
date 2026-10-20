// Cloudflare Pages Function: Store screenshot image snapshot
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email, imageBase64 } = await request.json();

    if (!email || !imageBase64) {
      return new Response(JSON.stringify({ error: 'Email and imageBase64 are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (env.DB) {
      let user = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
      let userId = user ? user.id : crypto.randomUUID();

      if (!user) {
        await env.DB.prepare('INSERT INTO users (id, email) VALUES (?, ?)').bind(userId, email).run();
      }

      const snapshotId = crypto.randomUUID();
      await env.DB.prepare(
        'INSERT INTO snapshots (id, user_id, image_base64) VALUES (?, ?, ?)'
      ).bind(snapshotId, userId, imageBase64).run();

      await env.DB.prepare(
        'UPDATE schedules SET last_snapshot_url = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'
      ).bind(`/api/snapshot?id=${snapshotId}`, userId).run();

      return new Response(JSON.stringify({
        success: true,
        snapshotId,
        message: 'Snapshot stored in Cloudflare'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, mode: 'local' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Snapshot id required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    if (env.DB) {
      const snap = await env.DB.prepare('SELECT image_base64 FROM snapshots WHERE id = ?').bind(id).first();
      if (snap && snap.image_base64) {
        return new Response(JSON.stringify({ found: true, imageBase64: snap.image_base64 }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    return new Response(JSON.stringify({ found: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
