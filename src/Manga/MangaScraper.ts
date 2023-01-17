import GenericScraper, { ScrapeResult } from "../BaseScraper";
import { GenericError } from "../Errors";

export class Chapter extends ScrapeResult {
  constructor(
    // First 3 parameters are inherited from ScrapeResult
    title: string,
    link: string,
    description: string | undefined,
    private chapterNumber: number,
    private volume?: number,
  ) {
    super(title, link, description);
  }

  getChapterNumber(): number {
    return this.chapterNumber;
  }

  protected setChapterNumber(chapterNumber: number) {
    this.chapterNumber = chapterNumber;
  }

  getVolume(): number {
    return this.volume ?? 0;
  }

  protected setVolume(volume: number) {
    this.volume = volume;
  }
}

export abstract class MangaScraper extends GenericScraper {
  static cache: Map<string, [Chapter?] | SearchResponse>;
  private currentDNS: DNS;

  constructor(name: string, hostUrl: string, opts: Record<string, any> = {}) {
    super(name, hostUrl);
    MangaScraper.cache = new Map<string, [Chapter] | SearchResponse>();
    this.currentDNS = GenericScraper.getDNS();
  }

  abstract loadChapters(url: string): Promise<Result<[Chapter?], GenericError>>;
  abstract search(
    query: string,
  ): Promise<Result<[SearchResponse?], GenericError>>;
}
