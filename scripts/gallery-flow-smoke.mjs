const base = process.env.BASE_URL || 'http://127.0.0.1:3013';
const writeMode = process.env.GALLERY_FLOW_WRITE === '1';

async function readJson(url, init) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => null);
  return { res, data };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const galleryRes = await readJson(`${base}/api/gallery`);
  console.log('GALLERY_API', galleryRes.res.status, Boolean(galleryRes.data?.sliderHero));
  assert(galleryRes.res.ok, `GET /api/gallery failed with ${galleryRes.res.status}`);
  assert(Array.isArray(galleryRes.data?.sliderHero?.slides), 'sliderHero.slides missing');

  const contentRes = await readJson(`${base}/api/content?page=galeri`);
  console.log('CONTENT_API', contentRes.res.status, Array.isArray(contentRes.data?.sections));
  assert(contentRes.res.ok, `GET /api/content?page=galeri failed with ${contentRes.res.status}`);
  assert(Array.isArray(contentRes.data?.sections), 'galeri sections missing');

  const projectsRes = await readJson(`${base}/api/projects`);
  const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
  console.log('PROJECTS_API', projectsRes.res.status, projects.length);
  assert(projectsRes.res.ok, `GET /api/projects failed with ${projectsRes.res.status}`);

  if (projects[0]?._id) {
    const detailRes = await readJson(`${base}/api/projects/${projects[0]._id}`);
    console.log('PROJECT_DETAIL', detailRes.res.status, Boolean(detailRes.data?._id));
    assert(detailRes.res.ok, `GET /api/projects/:id failed with ${detailRes.res.status}`);
  }

  if (writeMode) {
    const snapshot = JSON.parse(JSON.stringify(contentRes.data));
    const saveRes = await readJson(`${base}/api/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot),
    });
    console.log('CONTENT_SAVE', saveRes.res.status);
    assert(saveRes.res.ok, `PUT /api/content failed with ${saveRes.res.status}`);

    if (projects[0]?._id) {
      const first = projects[0];
      const patchPayload = {
        title: first.title,
        label: first.label,
        department: first.department,
        coverImage: first.coverImage,
        client: first.client,
        year: first.year,
        area: first.area,
        description: first.description,
        vision: first.vision,
        techDetails: first.techDetails,
        story: first.story,
        gallery: (first.gallery || []).map((item) =>
          typeof item === 'string'
            ? { url: item, imageAlt: '', caption: '' }
            : item,
        ),
      };

      const patchRes = await readJson(`${base}/api/projects/${first._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchPayload),
      });
      console.log('PROJECT_PATCH', patchRes.res.status);
      assert(patchRes.res.ok, `PATCH /api/projects/:id failed with ${patchRes.res.status}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
