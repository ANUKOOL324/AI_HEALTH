import { PatientFeedShell } from "@/components/patient/patient-feed-shell";
import { issueService } from "@/services";

export const dynamic = "force-dynamic";

interface PatientFeedPageProps {
  searchParams?: Promise<{
    status?: "open" | "in-progress" | "resolved";
    issueType?: "public-help" | "equipment-shortage" | "ambulance-request" | "general";
    page?: string;
  }>;
}

const toPositivePage = (value?: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return Math.floor(parsed);
};

export default async function PatientFeedPage({ searchParams }: PatientFeedPageProps) {
  const params = (await searchParams) ?? {};
  const currentPage = toPositivePage(params.page);

  const result = await issueService.list({
    status: params.status,
    issueType: params.issueType,
    page: currentPage,
    limit: 10,
  });

  return (
    <PatientFeedShell
      initialIssues={result.data}
      pagination={result.pagination}
      filters={{
        status: params.status,
        issueType: params.issueType,
      }}
    />
  );
}
