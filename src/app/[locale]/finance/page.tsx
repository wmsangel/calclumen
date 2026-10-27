import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getCategory } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { CategoryPage } from "@/components/category-page";
import { FinanceHubIntro, FinanceHubBody } from "@/components/hubs/finance-hub";

const CAT = getCategory("finance");

const HUB_DESCRIPTION =
  "Free finance calculators for loans, mortgages, debt payoff, saving and investing, pay and taxes — with a guide to picking the right tool and plain-English explanations of APR, APY, amortization and compounding.";

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
    description: HUB_DESCRIPTION,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <CategoryPage
      locale={locale}
      categoryId="finance"
      intro={<FinanceHubIntro locale={locale} />}
      extra={<FinanceHubBody locale={locale} />}
    />
  );
}
