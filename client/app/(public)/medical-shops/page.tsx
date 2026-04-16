import { MedicalShopsDiscovery } from "@/components/medical-shops/medical-shops-discovery";
import { medicalShopService } from "@/services";

export const dynamic = "force-dynamic";

interface MedicalShopsPageProps {
  searchParams?: Promise<{
    city?: string;
    state?: string;
    area?: string;
    page?: string;
  }>;
}

const toPositivePage = (value?: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 1;
  }
  return Math.floor(parsed);
};

export default async function MedicalShopsPage({ searchParams }: MedicalShopsPageProps) {
  const params = (await searchParams) ?? {};
  const currentPage = toPositivePage(params.page);

  const result = await medicalShopService.list({
    city: params.city?.trim() || undefined,
    state: params.state?.trim() || undefined,
    area: params.area?.trim() || undefined,
    page: currentPage,
    limit: 9,
  });

  return (
    <MedicalShopsDiscovery
      initialShops={result.data}
      pagination={result.pagination}
      filters={{
        city: params.city,
        state: params.state,
        area: params.area,
      }}
    />
  );
}
