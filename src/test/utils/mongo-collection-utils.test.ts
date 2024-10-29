import { Type } from '@sinclair/typebox';
import { getMongoFilter, getMongoSort } from '../../utils/mongo-collection-utils';

describe('collectionUtils', () => {
  it('should correctly build the search object', () => {
    const schema = Type.Object({ foo: Type.String(), bar: Type.String() });
    const filter = { search: 'foo:foo,bar:bar' };
    const search = getMongoFilter(schema, filter);
    expect(search).toEqual({ foo: /foo/i, bar: /bar/i });
  });

  it('should handle string array search values', () => {
    const schema = Type.Object({ foo: Type.Array(Type.String()), bar: Type.Array(Type.String()) });
    const filter = { search: 'foo:foo|bar,bar:baz|qux' };
    const search = getMongoFilter(schema, filter);
    expect(search).toEqual({
      foo: {
        $all: [
          { $elemMatch: { $regex: 'foo', $options: 'i' } },
          { $elemMatch: { $regex: 'bar', $options: 'i' } }
        ]
      },
      bar: {
        $all: [
          { $elemMatch: { $regex: 'baz', $options: 'i' } },
          { $elemMatch: { $regex: 'qux', $options: 'i' } }
        ]
      }
    });
  });

  it('should handle numeric array search values', () => {
    const schema = Type.Object({
      foo: Type.Array(Type.Integer()),
      bar: Type.Array(Type.Integer())
    });
    const filter = { search: 'foo:1|2,bar:3|4' };
    const search = getMongoFilter(schema, filter);
    expect(search).toEqual({ foo: { $all: [1, 2] }, bar: { $all: [3, 4] } });
  });

  it('should handle mixed array search values', () => {
    const schema = Type.Object({
      foo: Type.Array(Type.String()),
      bar: Type.Array(Type.Integer())
    });
    const filter = { search: 'foo:foo|bar,bar:1|2' };
    const search = getMongoFilter(schema, filter);
    expect(search).toEqual({
      foo: {
        $all: [
          { $elemMatch: { $regex: 'foo', $options: 'i' } },
          { $elemMatch: { $regex: 'bar', $options: 'i' } }
        ]
      },
      bar: { $all: [1, 2] }
    });
  });

  it('should handle numeric search values', () => {
    const schema = Type.Object({ foo: Type.Integer(), bar: Type.Integer() });
    const filter = { search: 'foo:1,bar:2' };
    const search = getMongoFilter(schema, filter);
    expect(search).toEqual({ foo: 1, bar: 2 });
  });

  it('should throw an error for an invalid property key', () => {
    const schema = Type.Object({ foo: Type.String(), bar: Type.String() });
    const filter = { search: 'invalid:foo' };
    expect(() => getMongoFilter(schema, filter)).toThrow();
  });

  it('should throw an error for an unsupported search type', () => {
    const schema = Type.Object({
      foo: Type.Object({ foo: Type.Void(), bar: Type.Void() })
    });
    const filter = { search: 'foo:foo' };
    expect(() => getMongoFilter(schema, filter)).toThrow();
  });

  it('should correctly build the sort object', () => {
    const filter = { sort: 'year:asc,title:desc' };
    const sort = getMongoSort(filter, {});
    expect(sort).toEqual({ year: 1, title: -1 });
  });
});
