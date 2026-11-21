import { describe, expect, it } from "vitest";
import { gate, goDestination } from "./go";

const H = (o: Record<string, string>) => ({ get: (k: string) => o[k.toLowerCase()] ?? null });
const CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const SAFARI17 = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15";
const SAFARI15 = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15";
const IOS_CHROME = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.54 Mobile/15E148 Safari/604.1";
const nav = { "sec-fetch-mode": "navigate", "sec-fetch-dest": "document", "sec-fetch-site": "same-origin" };

describe("gate matrix (network rule 20.11)", () => {
  it("Chrome with full Sec-Fetch set and ?1 → pass", () => {
    expect(gate(H({ "user-agent": CHROME, ...nav, "sec-fetch-user": "?1" })).pass).toBe(true);
  });
  it("Chrome without ?1 → 204 no-user-gesture", () => {
    expect(gate(H({ "user-agent": CHROME, ...nav }))).toEqual({ pass: false, reason: "no-user-gesture" });
  });
  it("Chrome UA with no Sec-Fetch headers at all → ua-mismatch", () => {
    expect(gate(H({ "user-agent": CHROME, referer: "https://calclumen.com/en/x" })).reason).toBe("ua-mismatch");
  });
  it("Safari 17 with ?1 → pass; without → 204", () => {
    expect(gate(H({ "user-agent": SAFARI17, ...nav, "sec-fetch-user": "?1" })).pass).toBe(true);
    expect(gate(H({ "user-agent": SAFARI17, ...nav })).reason).toBe("no-user-gesture");
  });
  it("iOS Chrome (CriOS, WebKit) requires ?1 like Safari 16.4+", () => {
    expect(gate(H({ "user-agent": IOS_CHROME, ...nav })).reason).toBe("no-user-gesture");
    expect(gate(H({ "user-agent": IOS_CHROME, ...nav, "sec-fetch-user": "?1" })).pass).toBe(true);
  });
  it("legacy Safari 15: Referer → pass, no Referer → 204", () => {
    expect(gate(H({ "user-agent": SAFARI15, referer: "https://calclumen.com/en/x" })).reason).toBe("legacy-referer");
    expect(gate(H({ "user-agent": SAFARI15 })).reason).toBe("no-referer");
  });
  it("curl / bots / prefetch / non-navigate → 204", () => {
    expect(gate(H({ "user-agent": "curl/8.4" })).reason).toBe("bot-ua");
    expect(gate(H({ "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" })).reason).toBe("bot-ua");
    expect(gate(H({ "user-agent": CHROME, ...nav, "sec-fetch-user": "?1", "sec-purpose": "prefetch" })).reason).toBe("prefetch");
    expect(gate(H({ "user-agent": CHROME, "sec-fetch-mode": "cors", "sec-fetch-user": "?1" })).reason).toBe("not-navigate");
  });
});

describe("goDestination", () => {
  it("keeper gets aff_sub from a valid label only", () => {
    expect(goDestination("keeper", "self-employment-tax-calculator")).toContain("aff_sub=calclumen-self-employment-tax-calculator");
    expect(goDestination("keeper", "bad label!")).not.toContain("aff_sub");
    expect(goDestination("keeper", null)).toBe("https://keepertax.go2cloud.org/aff_c?offer_id=25&aff_id=2191");
  });
  it("unknown slug → null; amazon slug gets ascsubtag", () => {
    expect(goDestination("nope", "x")).toBeNull();
    const d = goDestination("paint-roller-kit", "paint-calculator");
    expect(d).toContain("amazon.com");
    expect(d).toContain("ascsubtag=calclumen-paint-calculator");
  });
});
