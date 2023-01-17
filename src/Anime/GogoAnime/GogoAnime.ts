// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../types/common/scraper/anime_interface.d.ts">

import { AnimeScraper, Episode } from "../AnimeScraper";
import { load } from "cheerio";
import { Ok, Err, GenericError, NotFoundError } from "../../Errors";

export default class GogoScraper extends AnimeScraper {
  constructor() {
    super("GogoAnime", "https://gogoanime.sk", true, { dns: "Cloudflare" });
  }

  async loadEpisodes(url: string): Promise<Result<[Episode?], GenericError>> {
    const episodes: [Episode?] = [];

    if (AnimeScraper.cache.has(url)) {
      const cached = AnimeScraper.cache.get(url);
      if (cached && cached instanceof Array) {
        return Ok(cached);
      }
    }

    const response = AnimeScraper.fetch(url);
    if (response.isErr()) {
      return Err(response.Err as GenericError);
    }

    const html = await response?.Ok?.value?.then((res: Response) => res.text());
    if (html === undefined) {
      return Err(new NotFoundError("Anime not found"));
    }
    const $ = load(html);

    const lastEpisode = $("ul#episode_page > li:last-child > a")
      ?.attr("ep_end")
      ?.toString();
    const totalEpisodes = lastEpisode ? parseInt(lastEpisode) : 0;

    const animeID = $("input#movie_id")?.attr("value")?.toString();

    if (!animeID) {
      return Err(new NotFoundError("Anime ID not found"));
    }

    const episodeList = AnimeScraper.fetch(
      `${super.getHostUrl()}/load-list-episode?ep_start=0&ep_end=${totalEpisodes}&id=${animeID}`,
    );
    if (episodeList.isErr()) {
      return Err(episodeList.Err as GenericError);
    }

    const episodeListHTML = await episodeList?.Ok?.value?.then(
      (res: Response) => res.text(),
    );

    if (episodeListHTML === undefined) {
      return Err(new NotFoundError("Anime not found"));
    }

    const episodeHTML = load(episodeListHTML);
    const episodeLinks = episodeHTML("li > a");

    episodeLinks.each((_, el) => {
      const title = episodeHTML(el).find("div.name").text().trim();
      const link = episodeHTML(el)?.attr("href")?.trim();

      if (!title || !link) return;

      const episode = new Episode(
        title,
        super.getHostUrl() + link,
        undefined,
        parseInt(title.split(" ")[1].trim(), 10),
      );

      episodes.push(episode);
    });

    episodes.reverse();
    GogoScraper.cache.set(url, episodes);
    return Ok(episodes);
  }

  public async search(
    query: string,
    dub?: boolean | undefined,
  ): Promise<Result<[SearchResponse?], GenericError>> {
    const responses: [SearchResponse?] = [];
    const encoded = AnimeScraper.encode(query + (dub ? " dub" : ""));
    const url = `${super.getHostUrl()}/search.html?keyword=${encoded}`;

    if (AnimeScraper.cache.has(url)) {
      const cached = AnimeScraper.cache.get(url);
      // Check if cached is a SearchResponse
      if (cached && !(cached instanceof Array)) {
        return Ok([cached]);
      }
    }

    const response = AnimeScraper.fetch(url);
    const html = await (await response?.Ok?.value)?.text();

    if (html === undefined) return Err(new NotFoundError("Anime not found"));

    const $ = load(html);

    const results = $(".last_episodes > ul > li > div.img > a");
    results.each((_, el) => {
      const title = $(el).attr("title");
      const link = $(el).attr("href");
      const posterUrl = $(el).find("img").attr("src");

      if (!title || !link || !posterUrl) return Err(NotFoundError);

      responses.push({
        title,
        link: this.getHostUrl() + link,
        posterUrl,
        isDub: dub ? dub : false,
      });
    });

    return Ok(responses);
  }
}
