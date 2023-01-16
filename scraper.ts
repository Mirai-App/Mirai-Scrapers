import { Result, GenericError } from './errors'
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

interface GenericScraper {
    getName(): string,
    getHostUrl(): string,
    
    setDNS(): void,
    getDNS(): string | undefined,

    encode(query: string): String,
}

export interface AnimeScraper extends GenericScraper {
    loadEpisodes(url: string): Promise<Result<[Episode?], GenericError>>,
    search(query: string, dub?: boolean | undefined): Promise<Result<[SearchResponse?], GenericError>>,
}

export class AnimeScraper implements AnimeScraper {
    static cache: Map<string, [Episode?] | SearchResponse>;
    constructor(
        protected name: string,
        protected hostUrl: string,
        protected isDubSeperate: boolean,
        protected dns: string | undefined,
    ) {
        AnimeScraper.cache = new Map<string, [Episode] | SearchResponse>();
    }

    getName(): string {
        return this.name;
    }

    getHostUrl(): string {
        return this.hostUrl;
    }

    setDNS(): void {
        throw new Error("Method not implemented.");
    }

    getDNS(): string {
        return this.dns ?? "";
    }
}