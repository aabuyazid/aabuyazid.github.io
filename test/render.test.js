import { describe, expect, it } from 'vitest';

import { stations } from '../src/data/content.js';
import { renderStation } from '../src/ui/render.js';

describe('every station renders', () => {
  it('has at least one station to render', () => {
    expect(stations.length).toBeGreaterThan(0);
  });

  it.each(stations.map((s) => [s.id, s]))('%s produces its title', (_id, station) => {
    const html = renderStation(station);
    expect(html.trim()).not.toBe('');
    expect(html).toContain(station.title);
  });

  it.each(stations.map((s) => [s.id, s]))('%s renders as a fallback section too', (_id, station) => {
    // The no-WebGL document renders the same stations at h2.
    const html = renderStation(station, { heading: 'h2' });
    expect(html).toContain('<h2 class="panel__title">');
    expect(html).toContain(station.title);
  });
});

describe('a station renders only what it declares', () => {
  const minimal = { id: 'minimal', title: 'Just A Title', kicker: 'Kicker' };

  it('omits sections the station does not declare', () => {
    const html = renderStation(minimal);

    expect(html).toContain('Just A Title');
    expect(html).not.toContain('class="figure"');
    expect(html).not.toContain('Tech Stack');
    expect(html).not.toContain('class="links"');
    expect(html).not.toContain('class="portrait"');
    expect(html).not.toContain('class="callout"');
    expect(html).not.toContain('class="repo"');
    expect(html).not.toContain('class="hobby"');
  });

  it('renders no empty list or figure wrappers for omitted sections', () => {
    const html = renderStation(minimal);
    expect(html).not.toMatch(/<ul[^>]*>\s*<\/ul>/);
    expect(html).not.toMatch(/<figure[^>]*>\s*<\/figure>/);
  });

  it('renders the sections it does declare in full', () => {
    const html = renderStation({
      ...minimal,
      stack: ['LLVM', 'C++'],
      links: [{ label: 'Repository', href: 'https://example.com/repo', kind: 'repo' }],
    });

    expect(html).toContain('Tech Stack');
    expect(html).toContain('<li>LLVM</li>');
    expect(html).toContain('<li>C++</li>');
    expect(html).toContain('class="links"');
    expect(html).toContain('https://example.com/repo');
  });
});

describe('rendered content is escaped', () => {
  it('escapes markup characters in text', () => {
    const html = renderStation({
      id: 'x',
      title: 'Tom & Jerry <script>alert("x")</script>',
      kicker: 'A & B',
      body: ['5 < 6 and 7 > 2'],
    });

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('Tom &amp; Jerry');
    expect(html).toContain('5 &lt; 6 and 7 &gt; 2');
  });

  it('escapes quotes so they cannot break out of an attribute', () => {
    const html = renderStation({
      id: 'x',
      title: 'T',
      image: { src: 'a.webp" onerror="boom', alt: 'alt" onload="boom' },
    });

    expect(html).not.toContain('onerror="boom');
    expect(html).not.toContain('onload="boom');
    expect(html).toContain('&quot;');
  });

  it('escapes text inside every nested section', () => {
    const html = renderStation({
      id: 'x',
      title: 'T',
      stack: ['<b>bold</b>'],
      links: [{ label: '<em>link</em>', href: 'https://example.com/?a=1&b=2' }],
      repos: [{ owner: '<o>', name: '<n>', description: '<d>' }],
      hobbies: [{ name: '<h>', text: '<t>' }],
      figures: [{ src: 'f.webp', alt: '<a>', caption: '<c>' }],
      reference: '<r>',
    });

    expect(html).not.toMatch(/<(b|em|o|n|d|h|t|a|c|r)>/);
    expect(html).toContain('&lt;b&gt;bold&lt;/b&gt;');
    expect(html).toContain('a=1&amp;b=2');
  });
});
