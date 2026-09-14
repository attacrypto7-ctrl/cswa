import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/dashboard/shell";
import { getAuditLog } from "@/mock/api";

export const Route = createFileRoute("/admin/audit")({
  head: () => ({
    meta: [
      { title: "Catatan Aktivitas — Balasin Admin" },
      {
        name: "description",
        content:
          "Riwayat tindakan admin: pembuatan lisensi, pencabutan, dan perubahan masa berlaku.",
      },
      { property: "og:title", content: "Catatan Aktivitas — Balasin Admin" },
      { property: "og:description", content: "Riwayat tindakan admin pada lisensi dan tenant." },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const { data: entries = [] } = useQuery({ queryKey: ["audit"], queryFn: getAuditLog });

  return (
    <>
      <PageHeader
        title="Catatan Aktivitas"
        description="Siapa mengubah apa dan kapan — penting untuk platform yang menjual akses."
      />

      <ol className="panel divide-y divide-border">
        {entries.map((e) => (
          <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
            <div>
              <p className="text-sm font-medium">
                {e.aksi} <span className="text-muted-foreground">— {e.target}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{e.aktor}</p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{e.waktu}</span>
          </li>
        ))}
        {entries.length === 0 && (
          <li className="py-10 text-center text-sm text-muted-foreground">
            Belum ada catatan aktivitas admin.
          </li>
        )}
      </ol>
    </>
  );
}
