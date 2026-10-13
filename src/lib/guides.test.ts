import { describe, expect, it } from "vitest";
import { getGuide, guideForCalc } from "@/lib/guides";

describe("getGuide and guideForCalc", () => {
  it("looks up a guide by slug", () => {
    expect(getGuide("understanding-your-bmi")).toMatchObject({
      slug: "understanding-your-bmi",
      title: "Understanding Your BMI",
    });
    expect(getGuide("no-such-guide")).toBeUndefined();
    expect(getGuide("")).toBeUndefined();
  });

  it("finds the guide that features a calculator, and nothing for junk", () => {
    expect(guideForCalc("bmi-calculator")?.slug).toBe("understanding-your-bmi");
    expect(guideForCalc("ideal-weight-calculator")?.slug).toBe(
      "understanding-your-bmi",
    );
    expect(guideForCalc("not-a-calculator")).toBeUndefined();
    expect(guideForCalc("")).toBeUndefined();
    expect(() => guideForCalc("@@@")).not.toThrow();
  });
});
