import GenericScraper from "../BaseScraper";

export class Episode implements Episode {
  constructor(
    private title: string,
    private link: string,
    private description: string | undefined,
    private episodeNumber: number,
    private dub?: boolean,
  ) {}

  getTitle(): string {
    return this.title;
  }

  protected setTitle(title: string) {
    this.title = title;
  }

  getLink(): string {
    return this.link;
  }

  getDescription(): string {
    return this.description ?? "";
  }

  protected setDescription(description: string) {
    this.description = description;
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

export class AnimeScraper extends GenericScraper implements AnimeScraper {
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

  getDNS(): DNS {
    return this.currentDNS;
  }

  getDNSProvider(): string {
    return this.currentDNS.name;
  }
}
