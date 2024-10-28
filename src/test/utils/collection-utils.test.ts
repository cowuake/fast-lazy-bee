import { Type } from '@sinclair/typebox';
import { getGenericSearch, getGenericSort } from '../../utils/collection-utils';

describe('collectionUtils', () => {
  it('should correctly build the search object', () => {
    const schema = Type.Object({ foo: Type.String(), bar: Type.String() });
    const filter = { search: 'foo:foo,bar:bar' };
    const search = getGenericSearch(schema, filter);
    expect(search).toEqual({ foo: /foo/i, bar: /bar/i });
  });

  it('should handle numeric search values', () => {
    const schema = Type.Object({ foo: Type.Integer(), bar: Type.Integer() });
    const filter = { search: 'foo:1,bar:2' };
    const search = getGenericSearch(schema, filter);
    expect(search).toEqual({ foo: 1, bar: 2 });
  });

  it('should throw an error for an invalid property key', () => {
    const schema = Type.Object({ foo: Type.String(), bar: Type.String() });
    const filter = { search: 'invalid:foo' };
    expect(() => getGenericSearch(schema, filter)).toThrow();
  });

  it('should throw an error for an unsupported search type', () => {
    const schema = Type.Object({
      foo: Type.Object({ foo: Type.Void(), bar: Type.Void() })
    });
    const filter = { search: 'foo:foo' };
    expect(() => getGenericSearch(schema, filter)).toThrow();
  });

  it('should correctly build the sort object', () => {
    const filter = { sort: 'year:asc,title:desc' };
    const sort = getGenericSort(filter, {});
    expect(sort).toEqual({ year: 1, title: -1 });
  });
});
