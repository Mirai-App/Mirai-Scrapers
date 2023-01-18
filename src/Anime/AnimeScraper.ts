import GenericScraper, { ScrapeResult } from "../BaseScraper";
import { GenericError } from "../Errors";

export interface SearchResponse extends GenericSearchResponse {
  isDub?: boolean;
}

export class Episode extends ScrapeResult {
  constructor(
    // First 3 parameters are inherited from ScrapeResult
    title: string,
    link: string,
    description: string | undefined,
    private episodeNumber: number,
    private dub?: boolean,
  ) {
    super(title, link, description);
  }

  getEpisodeNumber(): number {
    return this.episodeNumber;
  }

  protected setEpisodeNumber(episodeNumber: number) {
    this.episodeNumber = episodeNumber;
  }

  isDub(): boolean {
    return this.dub ?? false;
  }

  protected setDub(dub: boolean) {
    this.dub = dub;
  }
}

export abstract class AnimeScraper
  extends GenericScraper
  implements AnimeScraper
{
  static cache: Map<string, [Episode?] | SearchResponse>;
  private currentDNS: DNS;

  constructor(
    name: string,
    hostUrl: string,
    protected isDubSeperate: boolean,
    opts: Record<string, any> = {},
  ) {
    super(name, hostUrl);
    AnimeScraper.cache = new Map<string, [Episode] | SearchResponse>();
    this.currentDNS = GenericScraper.getDNS();
  }

  abstract loadEpisodes(url: string): Promise<Result<[Episode?], GenericError>>;
  abstract search(
    query: string,
    dub?: boolean | undefined,
  ): Promise<Result<[SearchResponse?], GenericError>>;
}
