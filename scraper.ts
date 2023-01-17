import { GenericError, Ok } from "./errors";

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

export class GenericScraper implements GenericScraper {
  static availableDNS: Map<string, DNS> = new Map<string, DNS>([
    [
      "Cloudflare",
      {
        name: "Cloudflare",
        primary: {
          ipv4: "1.1.1.1",
          ipv6: "2606:4700:4700::1111",
        },
      },
    ],
    [
      "Google",
      {
        name: "Google",
        primary: {
          ipv4: "8.8.8.8",
          ipv6: "2001:4860:4860::8888",
        },
      },
    ],
  ]);
  static opts: Record<string, any> = {};

  constructor(private name: string, private hostUrl: string) {}

  getName(): string {
    return this.name;
  }

  getHostUrl(): string {
    return this.hostUrl;
  }

  static getDNS(): DNS {
    return (
      GenericScraper.availableDNS.get(this.opts["dns"]) ?? {
        name: "Cloudflare",
        primary: {
          ipv4: "1.1.1.1",
          ipv6: "2606:4700:4700::1111",
        },
      }
    );
  }

  getDNSProvider(): string {
    return GenericScraper.getDNS().name;
  }

  static fetch(query: string): Result<Promise<Response>, GenericError> {
    return Ok(fetch(query));
  }

  static encode(query: string): string {
    return encodeURIComponent(query);
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
