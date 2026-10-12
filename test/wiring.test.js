import { describe, expect, it } from 'vitest';

import { stations } from '../src/data/content.js';
import { LAYOUT, STATION_OBJECTS, resolveStationObject } from '../src/scene/world.js';

describe('every station is wired into the scene', () => {
  it.each(stations.map((s) => [s.id, s]))('%s declares a buildable object', (_id, station) => {
    expect(station.object, `station "${station.id}" declares no object`).toBeTruthy();
    expect(
      Object.keys(STATION_OBJECTS),
      `station "${station.id}" declares object "${station.object}"`
    ).toContain(station.object);
  });

  it.each(stations.map((s) => [s.id, s]))('%s has a place on the bench', (_id, station) => {
    expect(LAYOUT, `station "${station.id}" has no LAYOUT entry`).toHaveProperty(station.id);
    expect(typeof LAYOUT[station.id].x).toBe('number');
  });

  it('resolves every station without throwing', () => {
    for (const station of stations) {
      expect(() => resolveStationObject(station)).not.toThrow();
    }
  });

  it('leaves no unused objects in the registry', () => {
    const declared = new Set(stations.map((s) => s.object));
    const unused = Object.keys(STATION_OBJECTS).filter((k) => !declared.has(k));
    expect(unused, 'registry entries no station uses').toEqual([]);
  });

  it('gives every registry entry a build function', () => {
    for (const [name, entry] of Object.entries(STATION_OBJECTS)) {
      expect(typeof entry.build, `${name}.build`).toBe('function');
      if (entry.animate !== undefined) {
        expect(typeof entry.animate, `${name}.animate`).toBe('function');
      }
    }
  });
});

describe('the animated screens have a station to be near', () => {
  // world.js gates each canvas screen on the index of the station carrying it. If
  // that lookup found nothing the screen would be dropped and freeze at the frame
  // it was constructed with, silently, so pin the objects it looks for.
  it.each([['monitor'], ['laptop']])('exactly one station declares %s', (object) => {
    const matching = stations.filter((s) => s.object === object);
    expect(matching, `stations declaring "${object}"`).toHaveLength(1);
  });
});

describe('a miswired station fails loudly', () => {
  it('throws naming both the station and the unresolved object', () => {
    expect(() => resolveStationObject({ id: 'ccf', object: 'teapot' })).toThrowError(
      /Station "ccf" declares object "teapot"/
    );
  });

  it('lists the objects that would have worked', () => {
    expect(() => resolveStationObject({ id: 'x', object: 'nope' })).toThrowError(/chip/);
  });

  it('throws when a station declares no object at all', () => {
    expect(() => resolveStationObject({ id: 'x' })).toThrowError(/Station "x"/);
  });
});
