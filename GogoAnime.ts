import { AnimeScraper, Episode, SearchResponse }from "./scraper"
import Cheerio from "cheerio";
import { Result, Ok, Err, GenericError, ConnectionError, NotFoundError } from "./errors";

export default class GogoScraper extends AnimeScraper {
    
    constructor() {
        super(
            "GogoAnime",
            "https://gogoanime.sk",
            true,
            "1.1.1.1"
        );
    }

    getName(): string {
        return this.name;
    }

    getHostUrl(): string {
        return this.hostUrl;
    }

    async loadEpisodes(url: string): Promise<Result<[Episode?], GenericError>> {
        const episodes: [Episode?] = [];

        if (AnimeScraper.cache.has(url)) {
            const cached = AnimeScraper.cache.get(url);
            if (cached && cached instanceof Array) {
                return Ok(cached);
            }
        }

        if (this.getDNS() !== "") {
            return Err({
                message: "DNS is not supported for this scraper",
                code: 2,
                help: "Please report this error to the developer",
                description: "DNS is not supported for this scraper",
            } as GenericError);
        }

        const response = await fetch(url).then(res => res.text());
        const $ = Cheerio.load(response);

        const lastEpisode = $("ul#episode_page > li:last-child > a")?.attr("ep_end")?.toString()
        const totalEpisodes = lastEpisode ? parseInt(lastEpisode) : 0;

        const animeID = $("input#movie_id")?.attr("value")?.toString();
        let episodeList;
        try {
            episodeList = await fetch(`${this.hostUrl}/load-list-episode?ep_start=0&ep_end=${totalEpisodes}&id=${animeID}`)
            .then(res => res.text())
        } catch (e: any) {
            if (e instanceof TypeError) {
                const error = new ConnectionError("Failed to connect to GogoAnime");
                return Err(error);
            }
            return Err({
                message: "Unknown Error",
                code: 0,
                help: "Please report this error to the developer",
                description: e.message,
            } as GenericError);
        }
        
        const episodeHTML = Cheerio.load(episodeList);
        const episodeLinks = episodeHTML("li > a");

        episodeLinks.each((_, el) => {
            const title = episodeHTML(el).find("div.name").text().trim();
            const link = episodeHTML(el)?.attr("href")?.trim();
            
            if (!title || !link) return;

            const episode = new Episode(
                title,
                this.hostUrl + link,
                undefined,
                parseInt(title.split(" ")[1], 10),
            )

            episodes.push(episode);
        });

        episodes.reverse();
        GogoScraper.cache.set(url, episodes);
        return Ok(episodes);
    }

    public async search(query: string, dub?: boolean | undefined): Promise<Result<[SearchResponse?], GenericError>> {
        const responses: [SearchResponse?]= [];
        const encoded = this.encode(query + (dub ? " dub" : ""));
        const url = `${this.hostUrl}/search.html?keyword=${encoded}`;

        if (AnimeScraper.cache.has(url)) {
            const cached = AnimeScraper.cache.get(url);
            // Check if cached is a SearchResponse
            if (cached && !(cached instanceof Array)) {
                console.log("Returning cached response");
                return Ok([cached]);
            }
        }

        if (this.getDNS() !== "") {
            const networkError = new ConnectionError("DNS is not supported for this scraper");
            return Err(networkError);
        }


        let response: Response;
        try {
            console.log("Attempting to fetch: " + url)
            const _response = await fetch(url);
            response = Ok(_response).Ok.value;
        } catch (e: any) {
            if (e instanceof TypeError) {
                const error = new ConnectionError("Failed to connect to GogoAnime");
                return Err(error);
            }
            return Err({
                message: "Unknown error",
                code: 0,
                help: "Please report this error to the developer",
                description: e.message,
            } as GenericError);
        }
        const html = await response.text();
        const $ = Cheerio.load(html);

        const results = $(".last_episodes > ul > li > div.img > a");
        results.each((i, el) => {
            const title = $(el).attr("title");
            const link = $(el).attr("href");
            const posterUrl = $(el).find("img").attr("src");

            if (!title || !link || !posterUrl) return Err(NotFoundError);

            responses.push({
                title,
                link: this.hostUrl + link,
                posterUrl,
            });
        });

        return Ok(responses);
    }

    encode(query: string): String {
        return encodeURIComponent(query);
    }
}
