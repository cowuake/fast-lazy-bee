import { getGenericSearch, getGenericSort } from '../../utils/collection-utils';

describe('collectionUtils', () => {
  it('should correctly build the search object', () => {
    const filter = { search: 'title:foo,year:bar' };
    const search = getGenericSearch(filter);
    expect(search).toEqual({ title: /foo/i, year: /bar/i });
  });
  it('should correctly build the sort object', () => {
    const filter = { sort: 'year:asc,title:desc' };
    const sort = getGenericSort(filter, {});
    expect(sort).toEqual({ year: 1, title: -1 });
  });
});
