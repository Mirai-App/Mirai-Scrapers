import GogoScraper from "../GogoAnime";
import { match, Err, Ok, NotFoundError } from "../errors";
import { Episode } from "../scraper";

/// <reference path="./common/scraper/anime_interface.d.ts" />

// Use jest to test the GogoScraper class
describe("GogoScraper", () => {
  // Create a new instance of the GogoScraper class
  const scraper = new GogoScraper();

  // Test the getName() method
  test("getName()", () => {
    // Expect the name to be equal to GogoAnime
    expect(scraper.getName()).toBe("GogoAnime");
  });

  // Test the getHostUrl() method
  test("getHostUrl()", () => {
    // Expect the host url to be equal to https://gogoanime.sk
    expect(scraper.getHostUrl()).toBe("https://gogoanime.sk");
  });

  // Test the getDNSProvider() method
  test("getDNSProvider()", () => {
    // Expect the DNS provider to be equal to Cloudflare
    expect(scraper.getDNSProvider()).toBe("Cloudflare");
  });

  // Test the loadEpisodes() method
  test("loadEpisodes()", async () => {
    // Expect the result to be an array
    // First, we need to unwrap the result
    const result = await scraper.loadEpisodes(
      "https://gogoanime.sk/category/one-piece",
    );
    // result -> Result<[Episode?], GenericError>
    expect(
      match(result, {
        Ok: (episodes) => episodes,
        Err: (error) => error,
      }),
    ).toBeInstanceOf(Array);

    // Expect the first episode to be an Episode object
    const firstEpisode = result?.Ok?.value[0];
    expect(firstEpisode).toBeInstanceOf(Episode);
    expect(firstEpisode?.isDub()).toEqual(false);
  });

  // TODO: Make the dub test actually work
  test("loadEpisodes() dub", async () => {
    // Expect the result to be an array
    // First, we need to unwrap the result
    const result = await scraper.search("One Piece", true);
    if (result.isErr()) {
      return result.Err;
    }

    if (result?.Ok?.value.length === 0 || result?.Ok?.value[0] == undefined) {
      return Err(new NotFoundError("Anime not found"));
    }
    const episodes = await scraper.loadEpisodes(result.Ok.value[0].link);
    if (episodes.isErr()) {
      return episodes.Err;
    }

    expect(episodes?.Ok?.value[0]?.isDub()).toEqual(true);
  });

  // Test the search() method
  test("search()", async () => {
    // Expect the result to be an array
    const result = await scraper.search("One Piece");
    expect(
      match(result, {
        Ok: (results) => results,
        Err: (error) => error,
      }),
    ).toBeInstanceOf(Array);

    // Expect the first result to be an object
    const firstResult = result?.Ok?.value[0];
    expect(firstResult).toBeInstanceOf(Object);
  });

  // Test the cache
  test("cache", async () => {
    // We have to clear the cache before we can test it
    // as the cache is static
    GogoScraper.cache.clear();
    expect(GogoScraper.cache.size).toBe(0);

    // Expect the cache to have a size of 1
    const firstTime = new Date().getTime();
    await scraper.loadEpisodes("https://gogoanime.sk/category/one-piece");
    expect(GogoScraper.cache.size).toBe(1);
    const firstTimeEnd = new Date().getTime();

    // The next time we call the loadEpisodes() method, the cache should be used
    const secondTime = new Date().getTime();
    await scraper.loadEpisodes("https://gogoanime.sk/category/one-piece");
    const secondTimeEnd = new Date().getTime();

    // Expect the first time to be much longer than the second time
    const threshold = 2; // The second time should be a factor of 2 faster
    expect(secondTimeEnd - secondTime).toBeLessThan(
      (firstTimeEnd - firstTime) / threshold,
    );
    GogoScraper.cache.clear();
  });
});
