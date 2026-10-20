// Cloudflare Pages Function: Routine & Answers Storage
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email parameter required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    if (env.DB) {
      const user = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
      if (!user) {
        return new Response(JSON.stringify({ found: false }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const schedule = await env.DB.prepare('SELECT * FROM schedules WHERE user_id = ?').bind(user.id).first();
      if (schedule) {
        return new Response(JSON.stringify({
          found: true,
          events: JSON.parse(schedule.events_json || '[]'),
          answers: JSON.parse(schedule.answers_json || '{}'),
          updatedAt: schedule.updated_at
        }), {
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

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { email, events, answers, snapshotUrl } = data;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
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

      const eventsJson = JSON.stringify(events || []);
      const answersJson = JSON.stringify(answers || {});

      await env.DB.prepare(`
        INSERT INTO schedules (user_id, events_json, answers_json, last_snapshot_url, updated_at)
        VALUES (?1, ?2, ?3, ?4, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
          events_json = excluded.events_json,
          answers_json = excluded.answers_json,
          last_snapshot_url = COALESCE(excluded.last_snapshot_url, schedules.last_snapshot_url),
          updated_at = CURRENT_TIMESTAMP
      `).bind(userId, eventsJson, answersJson, snapshotUrl || null).run();

      return new Response(JSON.stringify({ success: true, message: 'Saved to Cloudflare D1' }), {
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
