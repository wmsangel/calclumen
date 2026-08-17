import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCalc } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CalcShell, type CalcContent } from "@/components/calc-shell";
import { DataStorageConverter } from "@/components/calculators/data-storage-converter";

const SLUG = "data-storage-converter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const calc = getCalc(SLUG)!;
  return pageMetadata({
    locale,
    path: SLUG,
    title: calc.heading,
    description: calc.description,
    keywords: calc.keywords,
  });
}

const content: CalcContent = {
  intro: [
    "This data storage converter changes a digital size from one unit into another across bits, bytes, kilobytes, megabytes, gigabytes, terabytes and petabytes. Type a value, choose the unit you are starting from and the unit you want, and the result updates instantly with a reference table of the most common units.",
    "The converter uses binary units, where each step up is a factor of 1024: 1 KB is 1024 bytes, 1 MB is 1024 KB, and so on. This matches how operating systems typically report file and drive sizes, so the figures line up with what you see on your computer rather than the decimal (1000-based) values often printed on packaging.",
  ],
  steps: [
    "Enter the size value you want to convert.",
    "Pick the unit to convert from.",
    "Pick the unit to convert to.",
    "Read the converted value, plus the reference table of common units below.",
  ],
  faq: [
    {
      q: "Does this use 1024 or 1000 per unit?",
      a: "This converter uses binary units, so every step is 1024: 1 KB = 1024 bytes, 1 MB = 1024 KB, and so on. Drive manufacturers often use decimal units (1000-based), which is why a labelled 1 TB drive shows as slightly less in your operating system.",
    },
    {
      q: "How many megabytes are in a gigabyte?",
      a: "Using binary units, one gigabyte equals 1024 megabytes. Likewise, one terabyte equals 1024 gigabytes and one megabyte equals 1024 kilobytes.",
    },
    {
      q: "What is the difference between a bit and a byte?",
      a: "A byte is eight bits, so one bit is 0.125 bytes. Bits are often used for network and connection speeds, while bytes are used for file and storage sizes.",
    },
  ],
};

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <CalcShell locale={locale} slug={SLUG} content={content}>
      <DataStorageConverter />
    </CalcShell>
  );
}
