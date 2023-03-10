import { ConnectionError, Err, GenericError, Ok } from "./Errors";

export default abstract class GenericScraper implements GenericScraper {
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

  // TODO: Define a list of acceptable keys and values
  static opts: Record<string, any> = {};

  constructor(private name: string, private hostUrl: string) {
    GenericScraper.opts["hostUrl"] = hostUrl;
  }

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

  static fetch(query: string): Promise<Result<Response, GenericError>> {
    return new Promise((resolve, reject) => {
      // const dns = GenericScraper.getDNS();
      fetch(query)
        .then((response) => {
          if (response.ok) {
            resolve(Ok(response));
          } else {
            reject(
              Err(
                new ConnectionError(
                  `Failed to connect to ${this.opts["hostUrl"]}.`,
                ),
              ),
            );
          }
        })
        .catch((error) => {
          reject(Err(new ConnectionError(error.message)));
        });
    });
  }

  static encode(query: string): string {
    return encodeURIComponent(query);
  }
}

export abstract class ScrapeResult implements ScrapeResult {
  constructor(
    private title: string,
    private link: string,
    private description?: string,
  ) {}

  getTitle(): string {
    return this.title;
  }

  getLink(): string {
    return this.link;
  }

  getDescription(): string {
    return this.description ?? "";
  }
}
