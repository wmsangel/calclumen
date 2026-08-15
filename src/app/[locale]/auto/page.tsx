import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCategory } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CategoryPage } from "@/components/category-page";

const CAT = getCategory("auto");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    path: CAT.slug,
    title: `${CAT.title} Calculators`,
    description: CAT.blurb,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CategoryPage locale={locale} categoryId="auto" />;
}
