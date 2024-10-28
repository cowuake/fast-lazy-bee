import { getGenericSearch, getGenericSort } from '../../utils/collection-utils';
import { Type } from '@sinclair/typebox';

describe('collectionUtils', () => {
  it('should correctly build the search object', () => {
    const schema = Type.Object({ title: Type.String(), year: Type.String() });
    const filter = { search: 'title:foo,year:bar' };
    const search = getGenericSearch(schema, filter);
    expect(search).toEqual({ title: /foo/i, year: /bar/i });
  });
  it('should correctly build the sort object', () => {
    const filter = { sort: 'year:asc,title:desc' };
    const sort = getGenericSort(filter, {});
    expect(sort).toEqual({ year: 1, title: -1 });
  });
});
