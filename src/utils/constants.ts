export class AppConfigDefaults {
  static readonly env = 'development';
  static readonly port = 3000;
  static readonly mongoUrl = 'mongodb://localhost:27027/sample_mflix';
}

export class PaginationDefaults {
  static readonly defaultPageNumber = 1;
  static readonly minimumPageNumber = 1;
  static readonly defaultPageSize: 100;
  static readonly maximumPageSize: 100;
  static readonly minimumPageSize: 1;
}
