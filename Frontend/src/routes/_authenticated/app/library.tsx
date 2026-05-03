import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api, apiJson, ApiError } from "@/lib/api";
import type { ResumeFile } from "@/lib/categories";
import { toast } from "sonner";
import { Download, FileText, Inbox } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const [files, setFiles] = useState<ResumeFile[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await apiJson<ResumeFile[]>("/document/myfiles");
        if (alive) setFiles(data);
      } catch (err) {
        if (alive) toast.error(err instanceof ApiError ? err.message : "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function download(f: ResumeFile) {
    setDownloadingId(f.id);
    try {
      const res = await api(`/document/download/${f.id}`, { raw: true });
      if (!res.ok) throw new ApiError("Download failed", res.status);
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") ?? "";
      const m = /filename\*?="?([^";]+)"?/i.exec(cd);
      const filename = m?.[1] ? decodeURIComponent(m[1]) : f.filename;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Download failed");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resume library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All resumes you've uploaded.
          </p>
        </div>
        <Link to="/app">
          <Button variant="outline" size="sm">
            New analysis
          </Button>
        </Link>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading && (
          <div className="py-16 text-center text-muted-foreground text-sm">Loading…</div>
        )}
        {!loading && files && files.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Inbox className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-4 font-medium">No resumes yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload one to get started.
            </p>
            <Link to="/app">
              <Button className="mt-4">Upload a resume</Button>
            </Link>
          </div>
        )}
        {!loading && files && files.length > 0 && (
          <div className="divide-y">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors"
              >
                <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {new Date(f.uploadedAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={downloadingId === f.id}
                  onClick={() => download(f)}
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  {downloadingId === f.id ? "…" : "Download"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
