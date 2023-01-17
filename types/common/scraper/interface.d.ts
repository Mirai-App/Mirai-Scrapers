declare interface SearchResponse {
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

interface AnimeScraper extends GenericScraper {
  loadEpisodes(url: string): Promise<Result<[Episode?], GenericError>>;
  search(
    query: string,
    dub?: boolean | undefined,
  ): Promise<Result<[SearchResponse?], GenericError>>;
}
