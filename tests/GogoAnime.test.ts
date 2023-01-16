import GogoScraper from "../GogoAnime";

(async () => {
    const scraper = new GogoScraper();
    const results = await scraper.search("dragon ball super");
    if (results.isErr()) {
        
        // Check env variable to see if we should print the full error message
        // NOTE: We can set the debug variable temporarily by running the script like this:
        // DEBUG=true node ./tests/GogoAnime.test.ts

        if (process.env.DEBUG) {
            console.error(results.Err?.FullMessage());
        } else {
            console.error(results.Err?.UserFacingMessage());
        }
        return;
    }

    const episodes = await scraper.loadEpisodes("https://gogoanime.sk/category/dragon-ball-super");
    if (episodes.isErr()) {
        // Check env variable to see if we should print the full error message
        // NOTE: We can set the debug variable temporarily by running the script like this:
        // DEBUG=true node ./tests/GogoAnime.test.ts

        if (process.env.DEBUG) {
            console.error(results.Err?.FullMessage());
        } else {
            console.error(results.Err?.UserFacingMessage());
        }
        return;
    }

    console.log(episodes);
})();
