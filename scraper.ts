import { Result, GenericError, Ok } from './errors'
type totalEpisodes = Number

export interface SearchResponse {
    title: string,
    link: string,
    posterUrl: string,

    totalEpisodes?: totalEpisodes,
    isMovie?: boolean, // If it's a movie, totalEpisodes will be 1
}

export interface Episode {
    getTitle(): string,
    getLink(): string,
    getDescription(): string | undefined,
    getEpisodeNumber(): Number,
    isDub(): boolean,
}

export class Episode implements Episode {

    constructor(
        private title: string,
        private link: string,
        private description: string | undefined,
        private episodeNumber: Number,
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

    getEpisodeNumber(): Number {
        return this.episodeNumber;
    }

    protected setEpisodeNumber(episodeNumber: Number) {
        this.episodeNumber = episodeNumber;
    }

    isDub(): boolean {
        return this.dub ?? false;
    }

    protected setDub(dub: boolean) {
        this.dub = dub;
    }
}

type DNS = {
    name: string,
    primary: {
        ipv4: string,
        ipv6: string
    },
    secondary?: {
        ipv4: string,
        ipv6: string
    }
}

export interface GenericScraper {
    getName(): string,
    getHostUrl(): string,
    
    getDNS(): DNS,
    getDNSProvider(): string,
    fetch(query: string): Result<Response, GenericError>,

    encode(query: string): String,
}

export class GenericScraper implements GenericScraper {
    static availableDNS: Map<string, DNS> = new Map<string, DNS>([
        ["Cloudflare", {
            name: "Cloudflare",
            primary: {
                ipv4: "1.1.1.1",
                ipv6: "2606:4700:4700::1111"
            }
        }],
        ["Google", {
            name: "Google",
            primary: {
                ipv4: "8.8.8.8",
                ipv6: "2001:4860:4860::8888"
            }
        }]
    ]);
    static opts: Record<string, any> = {};

    constructor(
        private name: string,
        private hostUrl: string,
        private opts: Record<string, any>,
    ) {}

    getName(): string {
        return this.name;
    }

    getHostUrl(): string {
        return this.hostUrl;
    }

    static getDNS(): DNS {
        return GenericScraper.availableDNS.get(this.opts["dns"]) ?? {
            name: "Cloudflare",
            primary: {
                ipv4: "1.1.1.1",
                ipv6: "2606:4700:4700::1111"
            }
        }
    }

    getDNSProvider(): string {
        return GenericScraper.getDNS().name;
    }

    static fetch(query: string): Result<Promise<Response>, GenericError> {
        return Ok(fetch(query));
    }


    static encode(query: string): String {
        return encodeURIComponent(query);
    }
}

export interface AnimeScraper extends GenericScraper {
    loadEpisodes(url: string): Promise<Result<[Episode?], GenericError>>,
    search(query: string, dub?: boolean | undefined): Promise<Result<[SearchResponse?], GenericError>>,
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
        super(name, hostUrl, opts);
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
