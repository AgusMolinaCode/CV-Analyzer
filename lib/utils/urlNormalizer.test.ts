import { normalizeUrl, normalizeUrls } from "./urlNormalizer";

describe("normalizeUrl", () => {
  it("should remove localhost prefix from URLs", () => {
    expect(normalizeUrl("http://localhost:3000/itsdiegoramos.com")).toBe(
      "https://itsdiegoramos.com"
    );
    expect(normalizeUrl("https://localhost:3000/github.com/user")).toBe(
      "https://github.com/user"
    );
  });

  it("should add https:// to URLs without protocol", () => {
    expect(normalizeUrl("itsdiegoramos.com")).toBe(
      "https://itsdiegoramos.com"
    );
    expect(normalizeUrl("github.com/username")).toBe(
      "https://github.com/username"
    );
  });

  it("should keep URLs that already have https://", () => {
    expect(normalizeUrl("https://itsdiegoramos.com")).toBe(
      "https://itsdiegoramos.com"
    );
    expect(normalizeUrl("https://linkedin.com/in/user")).toBe(
      "https://linkedin.com/in/user"
    );
  });

  it("should convert http:// to https://", () => {
    expect(normalizeUrl("http://itsdiegoramos.com")).toBe(
      "https://itsdiegoramos.com"
    );
  });

  it("should return undefined for null/undefined input", () => {
    expect(normalizeUrl(undefined)).toBeUndefined();
    expect(normalizeUrl(null)).toBeUndefined();
  });

  it("should handle empty strings", () => {
    expect(normalizeUrl("")).toBeUndefined();
  });
});

describe("normalizeUrls", () => {
  it("should normalize multiple URLs at once", () => {
    const input = {
      portfolio: "http://localhost:3000/itsdiegoramos.com",
      linkedin: "linkedin.com/in/user",
      github: "https://github.com/user",
    };

    const expected = {
      portfolio: "https://itsdiegoramos.com",
      linkedin: "https://linkedin.com/in/user",
      github: "https://github.com/user",
    };

    expect(normalizeUrls(input)).toEqual(expected);
  });

  it("should handle undefined values in object", () => {
    const input = {
      portfolio: "itsdiegoramos.com",
      linkedin: undefined,
      github: null,
    };

    const result = normalizeUrls(input);

    expect(result.portfolio).toBe("https://itsdiegoramos.com");
    expect(result.linkedin).toBeUndefined();
    expect(result.github).toBeUndefined();
  });
});
