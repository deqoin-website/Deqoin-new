import robots from "@/app/robots";

describe("robots", () => {
  it("blocks admin and api routes", () => {
    const config = robots();

    expect(config.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userAgent: "*",
          allow: "/",
          disallow: expect.arrayContaining(["/admin", "/api", "/maintenance", "/test-upload"]),
        }),
      ]),
    );
    expect(config.sitemap).toContain("/sitemap.xml");
  });
});
