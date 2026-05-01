const baseUrl = process.env.TEAM_FLOW_BASE_URL || 'http://127.0.0.1:3000';
const writeEnabled = process.env.TEAM_FLOW_WRITE === '1';

async function readJson(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

async function request(path, init) {
  const response = await fetch(`${baseUrl}${path}`, init);
  const data = await readJson(response);

  if (!response.ok) {
    const message = typeof data === 'object' && data?.error ? data.error : `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

async function main() {
  const members = await request('/api/admin/team', { cache: 'no-store' });

  if (!Array.isArray(members)) {
    throw new Error('Team list did not return an array');
  }

  console.log(`LIST_OK count=${members.length}`);

  if (!writeEnabled) {
    console.log('WRITE_SKIPPED set TEAM_FLOW_WRITE=1 to exercise create/update/delete');
    return;
  }

  const stamp = Date.now();
  const createPayload = {
    name: `Codex Smoke ${stamp}`,
    role: 'QA Test Member',
    category: 'mimarlik',
    image: '',
    bio: 'Temporary smoke-test member created by scripts/team-flow-smoke.mjs',
    order: 998,
    socials: {
      linkedin: '',
      instagram: '',
    },
  };

  const created = await request('/api/admin/team', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createPayload),
  });

  if (!created?._id) {
    throw new Error('Create did not return a persisted member');
  }

  console.log(`CREATE_OK id=${created._id}`);

  const updated = await request(`/api/admin/team/${created._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...createPayload,
      bio: `${createPayload.bio} :: updated`,
    }),
  });

  if (!updated?._id) {
    throw new Error('Update did not return a persisted member');
  }

  console.log(`UPDATE_OK id=${updated._id}`);

  try {
    await request(`/api/admin/team/${created._id}`, { method: 'DELETE' });
    console.log(`DELETE_OK id=${created._id}`);
  } catch (error) {
    console.error(`DELETE_FAILED id=${created._id}`);
    throw error;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
