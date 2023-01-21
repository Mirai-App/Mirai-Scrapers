## Mirai Scrapers

A collection of scrapers for Mirai, a free and open-source anime streaming platform.
This project is a work in progress, and is not affiliated with [this project](https://github.com/mamoe/mirai) in any way.

### Scrapers

These are the scrapers that are currently available / planned to be available.

- [x] [GogoAnime](https://gogoanime.sk)
- [ ] [Kamyroll](https://kamyroll.com)
- [ ] [Zoro](https://zoro.to)

**NOTE** Just because a scraper is listed here, it does not mean that
it is not being considered for development. If you would like to
contribute, please make a pull request / issue.

## Usage

### Installation

```bash
# Assuming you have Node.js and npm installed
$ git clone https://github.com/Mirai-App/mirai-scrapers
$ cd mirai-scrapers
$ npm install
```

### Testing

```bash
# Run ALL tests
$ npx jest

# Run a specific test
$ npx jest tests/<SCRAPER NAME>
```

### Running

```bash
# Run on-the-fly without transpiling to JS
$ npx ts-node src/<SCRAPER NAME>.ts
```

## Project Structure

```
.
|-- src/
|   |-- BaseScraper.ts
|   |-- Errors.ts
|   |-- Anime
|       |-- AnimeScraper.ts
|       | <ANIME_SCRAPER_NAME>
|           |-- <ANIME_SCRAPER_NAME>.ts
|           |-- <ANIME_SCRAPER_NAME>.test.ts
|-- types/common
|   |-- errors
|       |-- index.d.ts
|       |-- type.d.ts
|   |-- scraper
|       |-- index.d.ts
|       |-- type.d.ts
|       |-- interface.d.ts
|       |-- anime_interface.d.ts
|   |-- <MODULE_NAME>
|       |-- index.d.ts
|   |-- index.d.ts
|-- README.md
|-- package.json
|-- tsconfig.json
|-- jest.config.js
|-- .gitignore
|-- .prettierrc
|-- .eslintrc
|-- .eslintignore
|-- LICENSE
```

### Contributing

If you would like to contribute, please make a pull request / issue.

### License

This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).

## Todo

- [ ] Implement AniList login
  - Help for the auth can be found [here](https://anilist.gitbook.io/anilist-apiv2-docs/overview/oauth/implicit-grant)
  - and GraphQL types [here](https://anilist.github.io/ApiV2-GraphQL-Docs/)
