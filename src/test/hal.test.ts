import {
  getFirstPageLink,
  getLastPageLink,
  getNextPageLink,
  getPreviousPageLink
} from '../utils/hal-utils';

describe('HAL pagination', () => {
  const baseUrl = '/api/v1/whatever';
  const additionalQueryParams = '&foo=bar';
  const pageSize = 100;
  const url = `${baseUrl}?page=1&pageSize=${pageSize}${additionalQueryParams}`;
  const alternativeUrl = `${baseUrl}?${additionalQueryParams}&page=1&pageSize=${pageSize}`;

  it('should return the previous page link', () => {
    const page = 2;
    const previousPageLink = getPreviousPageLink(page, pageSize, url);
    const alternativePreviousPageLink = getPreviousPageLink(page, pageSize, alternativeUrl);

    expect(previousPageLink).toBe(`${baseUrl}?page=1&pageSize=${pageSize}${additionalQueryParams}`);
    expect(alternativePreviousPageLink).toBe(
      `${baseUrl}?${additionalQueryParams}&page=1&pageSize=${pageSize}`
    );
  });

  it('should not return the previous page link if on first page', () => {
    const page = 1;
    const previousPageLink = getPreviousPageLink(page, pageSize, url);
    expect(previousPageLink).toBeNull();
  });

  it('should return the next page link', () => {
    const page = 1;
    const totalCount = 200;

    const nextPageLink = getNextPageLink(page, pageSize, totalCount, url);
    const alternativeNextPageLink = getNextPageLink(page, pageSize, totalCount, alternativeUrl);

    expect(nextPageLink).toBe(`${baseUrl}?page=2&pageSize=${pageSize}${additionalQueryParams}`);
    expect(alternativeNextPageLink).toBe(
      `${baseUrl}?${additionalQueryParams}&page=2&pageSize=${pageSize}`
    );
  });

  it('should not return the next page link if on last page', () => {
    const page = 2;
    const totalCount = 200;
    const nextPageLink = getNextPageLink(page, pageSize, totalCount, url);
    expect(nextPageLink).toBeNull();
  });

  it('should return the first page link', () => {
    const firstPageLink = getFirstPageLink(pageSize, url);
    const alternativeFirstPageLink = getFirstPageLink(pageSize, alternativeUrl);

    expect(firstPageLink).toBe(`${baseUrl}?page=1&pageSize=${pageSize}${additionalQueryParams}`);
    expect(alternativeFirstPageLink).toBe(
      `${baseUrl}?${additionalQueryParams}&page=1&pageSize=${pageSize}`
    );
  });

  it('should return the last page link', () => {
    const totalCount = 200;

    const lastPageLink = getLastPageLink(pageSize, totalCount, url);
    const alternativeLastPageLink = getLastPageLink(pageSize, totalCount, alternativeUrl);

    expect(lastPageLink).toBe(`${baseUrl}?page=2&pageSize=${pageSize}${additionalQueryParams}`);
    expect(alternativeLastPageLink).toBe(
      `${baseUrl}?${additionalQueryParams}&page=2&pageSize=${pageSize}`
    );
  });
});
