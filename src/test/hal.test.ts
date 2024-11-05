import {
  getFirstPageLink,
  getLastPageLink,
  getNextPageLink,
  getPreviousPageLink
} from '../utils/hal-utils';

describe('HAL pagination', () => {
  const url = '/api/v1/whatever/';

  it('should return the previous page link', () => {
    const page = 2;
    const pageSize = 100;

    const previousPageLink = getPreviousPageLink(page, pageSize, url);
    expect(previousPageLink).toBe(`${url}?page=1&pageSize=100`);
  });

  it('should not return the previous page link if on first page', () => {
    const page = 1;
    const pageSize = 100;

    const previousPageLink = getPreviousPageLink(page, pageSize, url);
    expect(previousPageLink).toBeNull();
  });

  it('should return the next page link', () => {
    const page = 1;
    const pageSize = 100;
    const totalCount = 200;

    const nextPageLink = getNextPageLink(page, pageSize, totalCount, url);
    expect(nextPageLink).toBe(`${url}?page=2&pageSize=${pageSize}`);
  });

  it('should not return the next page link if on last page', () => {
    const page = 2;
    const pageSize = 100;
    const totalCount = 200;

    const nextPageLink = getNextPageLink(page, pageSize, totalCount, url);
    expect(nextPageLink).toBeNull();
  });

  it('should return the first page link', () => {
    const pageSize = 100;

    const firstPageLink = getFirstPageLink(pageSize, url);
    expect(firstPageLink).toBe(`${url}?page=1&pageSize=${pageSize}`);
  });

  it('should return the last page link', () => {
    const pageSize = 100;
    const totalCount = 200;

    const lastPageLink = getLastPageLink(pageSize, totalCount, url);
    expect(lastPageLink).toBe(`${url}?page=2&pageSize=${pageSize}`);
  });
});
