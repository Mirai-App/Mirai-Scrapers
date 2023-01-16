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

export interface GenericScraper {
    getName(): string,
    getHostUrl(): string,
    
    setDNS(): void,
    getDNS(): string | undefined,
    fetch(query: string): Result<Response, GenericError>,

    encode(query: string): String,
}

export class GenericScraper implements GenericScraper {
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
    constructor(
        name: string,
        hostUrl: string,
        protected isDubSeperate: boolean,
        protected dns: string | undefined,
        opts: Record<string, any> = {},
    ) {
        super(name, hostUrl, opts);
        AnimeScraper.cache = new Map<string, [Episode] | SearchResponse>();
    }

    setDNS(): void {
        throw new Error("Method not implemented.");
    }

    getDNS(): string {
        return this.dns ?? "";
    }
}
