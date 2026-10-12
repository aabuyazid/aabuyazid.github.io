/**
 * Turns a station object from content.js into panel markup.
 * Everything here is text we control, but it is still escaped on the way in
 * so a stray character in the content can never break the markup.
 */

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const isExternal = (href) => /^(https?:|mailto:)/.test(href);

function linkList(links) {
  if (!links?.length) return '';
  const items = links
    .map((l) => {
      const ext = isExternal(l.href) && !l.href.startsWith('mailto:');
      const attrs = ext
        ? ' target="_blank" rel="noopener noreferrer"'
        : l.kind === 'pdf'
          ? ' target="_blank" rel="noopener"'
          : '';
      return `<li><a href="${esc(l.href)}"${attrs}>${esc(l.label)}</a></li>`;
    })
    .join('');
  return `<ul class="links">${items}</ul>`;
}

function figures(list) {
  if (!list?.length) return '';
  return list
    .map(
      (f) => `
      <figure class="figure">
        <img src="${esc(f.src)}" alt="${esc(f.alt)}" loading="lazy" decoding="async" />
        ${f.caption ? `<figcaption>${esc(f.caption)}</figcaption>` : ''}
      </figure>`
    )
    .join('');
}

function entries(title, list) {
  if (!list?.length) return '';
  const body = list
    .map(
      (e) => `
      <div class="entry">
        <div class="entry__head">
          <p class="entry__title">${esc(e.title)}</p>
          <span class="entry__year">${esc(e.year)}</span>
        </div>
        <p class="entry__inst">${esc(e.institution)}</p>
        ${e.points?.length ? `<ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      </div>`
    )
    .join('');
  return `<h3>${esc(title)}</h3>${body}`;
}

function cvBlock(cv, pdf) {
  if (!cv) return '';
  const skills = cv.skills
    .map(
      (g) => `
      <div class="skillgroup">
        <p class="skillgroup__name">${esc(g.group)}</p>
        <ul class="tags">${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`
    )
    .join('');

  const awards = cv.awards
    .map(
      (a) => `<div class="entry__head"><p class="entry__title">${esc(a.text)}</p>
      <span class="entry__year">${esc(a.year)}</span></div>`
    )
    .join('');

  const certs = cv.certificates.map((c) => `<li>${esc(c)}</li>`).join('');

  return [
    // The CV PDF button only appears once a real file exists in content.js.
    pdf
      ? `<ul class="links"><li><a href="${esc(pdf)}" target="_blank" rel="noopener">Download CV (PDF)</a></li></ul>`
      : '',
    entries('Experience', cv.experience),
    entries('Education', cv.education),
    entries('Leadership & Organizations', cv.leadership),
    `<h3>Skills</h3>${skills}`,
    `<h3>Honors & Awards</h3>${awards}`,
    `<h3>Certificates</h3><ul class="tags">${certs}</ul>`,
  ].join('');
}

function repoBlock(repos) {
  if (!repos?.length) return '';
  return repos
    .map(
      (r) => `
      <a class="repo" href="https://github.com/${esc(r.owner)}/${esc(r.name)}"
         target="_blank" rel="noopener noreferrer">
        <span class="repo__name"><span>${esc(r.owner)}/</span>${esc(r.name)}</span>
        <p class="repo__desc">${esc(r.description)}</p>
      </a>`
    )
    .join('');
}

function hobbyBlock(hobbies) {
  if (!hobbies?.length) return '';
  return hobbies
    .map(
      (h) => `
      <div class="hobby">
        <p class="hobby__name">${esc(h.name)}</p>
        <p>${esc(h.text)}</p>
      </div>`
    )
    .join('');
}

/** Full inner markup for one station's panel. */
export function renderStation(station, { heading = 'h1' } = {}) {
  const parts = [];

  parts.push(`<p class="panel__kicker">${esc(station.kicker ?? '')}</p>`);
  parts.push(`<${heading} class="panel__title">${esc(station.title)}</${heading}>`);

  if (station.tagline) {
    parts.push(`<p class="panel__tagline">${esc(station.tagline)}</p>`);
  }

  if (station.image) {
    parts.push(
      `<img class="portrait" src="${esc(station.image.src)}" alt="${esc(station.image.alt)}"
        width="500" height="500" decoding="async" />`
    );
  }

  for (const p of station.body ?? []) {
    parts.push(`<p>${esc(p)}</p>`);
  }

  if (station.callout) {
    parts.push(`<p class="callout">${esc(station.callout)}</p>`);
  }

  if (station.stack?.length) {
    parts.push(
      `<h3>Tech Stack</h3><ul class="tags">${station.stack
        .map((s) => `<li>${esc(s)}</li>`)
        .join('')}</ul>`
    );
  }

  parts.push(figures(station.figures));
  parts.push(cvBlock(station.cv, station.pdf));
  parts.push(repoBlock(station.repos));
  parts.push(hobbyBlock(station.hobbies));
  parts.push(linkList(station.links));

  if (station.reference) {
    parts.push(`<p class="reference">${esc(station.reference)}</p>`);
  }

  return parts.filter(Boolean).join('\n');
}
