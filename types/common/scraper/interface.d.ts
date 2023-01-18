declare interface GenericSearchResponse {
  title: string;
  link: string;
  posterUrl: string;
}

interface GenericScraper {
  getName(): string;
  getHostUrl(): string;

  getDNS(): DNS;
  getDNSProvider(): string;
  fetch(query: string): Result<Response, GenericError>;

  encode(query: string): string;
}
