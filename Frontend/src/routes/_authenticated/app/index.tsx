import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api, apiJson, ApiError } from "@/lib/api";
import type { ResumeFile, AnalysisResult } from "@/lib/categories";
import { saveAnalysis } from "@/lib/analysisStore";
import { toast } from "sonner";
import { Upload, FileText, Loader2, Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/")({
  component: WizardPage,
});

type Selected = { id: number; filename: string };

const ACCEPT = ".pdf,.docx";

function isAllowed(name: string) {
  const n = name.toLowerCase();
  return n.endsWith(".pdf") || n.endsWith(".docx");
}

function WizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [tab, setTab] = useState<"upload" | "library">("upload");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<ResumeFile[] | null>(null);
  const [filesLoading, setFilesLoading] = useState(false);
  const [librarySelectedId, setLibrarySelectedId] = useState<string>("");
  const [selected, setSelected] = useState<Selected | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Step 2
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Step 3
  const [analyzing, setAnalyzing] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const statuses = [
    "Reading your resume…",
    "Comparing against the job description…",
    "Scoring categories…",
    "Drafting the summary…",
  ];

  useEffect(() => {
    if (!analyzing) return;
    const t = setInterval(() => setStatusIdx((i) => (i + 1) % statuses.length), 3500);
    return () => clearInterval(t);
  }, [analyzing, statuses.length]);

  async function loadFiles() {
    setFilesLoading(true);
    try {
      const data = await apiJson<ResumeFile[]>("/document/myfiles");
      setFiles(data);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load files");
    } finally {
      setFilesLoading(false);
    }
  }

  useEffect(() => {
    if (tab === "library" && files === null) loadFiles();
  }, [tab, files]);

  function handleFile(f: File | undefined) {
    if (!f) return;
    if (!isAllowed(f.name)) {
      toast.error("Only PDF and DOCX files are supported");
      return;
    }
    setPendingFile(f);
  }

  async function continueFromStep1() {
    if (tab === "upload") {
      if (!pendingFile) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", pendingFile);
        const data = await apiJson<ResumeFile>("/document/upload", {
          method: "POST",
          formData: fd,
        });
        setSelected({ id: data.id, filename: data.filename });
        setFiles(null); // invalidate library cache
        setStep(2);
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    } else {
      const id = Number(librarySelectedId);
      const f = files?.find((x) => x.id === id);
      if (!f) return;
      setSelected({ id: f.id, filename: f.filename });
      setStep(2);
    }
  }

  async function runAnalysis() {
    if (!selected) return;
    setStep(3);
    setAnalyzing(true);
    try {
      const result = await apiJson<AnalysisResult>(`/document/analyze/${selected.id}`, {
        method: "POST",
        body: { jobTitle, jobDescription },
      });
      const id = saveAnalysis({
        result,
        resumeFilename: selected.filename,
        jobTitle,
      });
      navigate({ to: "/app/results/$id", params: { id } });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Analysis failed");
      setAnalyzing(false);
    }
  }

  const canContinue1 =
    tab === "upload" ? !!pendingFile && !uploading : !!librarySelectedId && !!files?.length;
  const canAnalyze = jobTitle.trim().length > 0 && jobDescription.trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Stepper step={step} />

      <Card className="mt-8 p-6 sm:p-8">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Choose a resume</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a new file or pick one you've already analyzed.
            </p>

            <Tabs value={tab} onValueChange={(v) => setTab(v as "upload" | "library")} className="mt-6">
              <TabsList>
                <TabsTrigger value="upload">Upload new</TabsTrigger>
                <TabsTrigger value="library">From library</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-xl border-2 border-dashed transition-colors p-10 text-center ${
                    dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT}
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
                  />
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-3 font-medium">Drop your resume here</p>
                  <p className="text-sm text-muted-foreground">
                    PDF or DOCX, click to browse
                  </p>
                </div>
                {pendingFile && (
                  <div className="mt-4 flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{pendingFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(pendingFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Check className="h-4 w-4 text-[oklch(var(--score-good))]" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="library" className="mt-4">
                {filesLoading && (
                  <div className="py-10 text-center text-muted-foreground text-sm">
                    Loading…
                  </div>
                )}
                {!filesLoading && files && files.length === 0 && (
                  <div className="py-10 text-center text-muted-foreground text-sm">
                    No resumes uploaded yet.
                  </div>
                )}
                {!filesLoading && files && files.length > 0 && (
                  <RadioGroup
                    value={librarySelectedId}
                    onValueChange={setLibrarySelectedId}
                    className="space-y-2 max-h-80 overflow-auto pr-1"
                  >
                    {files.map((f) => (
                      <label
                        key={f.id}
                        htmlFor={`f-${f.id}`}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          librarySelectedId === String(f.id)
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <RadioGroupItem value={String(f.id)} id={`f-${f.id}`} />
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{f.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(f.uploadedAt).toLocaleString()}
                          </p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end">
              <Button onClick={continueFromStep1} disabled={!canContinue1}>
                {uploading ? "Uploading…" : "Continue"}
                {!uploading && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && selected && (
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Job details</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Tell us about the role you're hiring for.
            </p>
            <div className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              <span className="truncate max-w-xs">{selected.filename}</span>
            </div>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job title</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g. Senior Backend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="jobDescription">Job description</Label>
                  <span className="text-xs text-muted-foreground">
                    {jobDescription.length} chars
                  </span>
                </div>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description, responsibilities, and requirements…"
                  rows={10}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button onClick={runAnalysis} disabled={!canAnalyze}>
                <Sparkles className="h-4 w-4 mr-1.5" />
                Analyze
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-10 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elegant)] flex items-center justify-center">
              <Loader2 className="h-7 w-7 text-primary-foreground animate-spin" />
            </div>
            <h2 className="mt-6 text-xl font-semibold tracking-tight">
              Analyzing your candidate
            </h2>
            <p className="mt-2 text-sm text-muted-foreground transition-opacity">
              {statuses[statusIdx]}
            </p>
            <div className="mt-6 mx-auto max-w-sm">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-[image:var(--gradient-primary)] animate-[indeterminate_1.6s_ease-in-out_infinite]" />
              </div>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              This usually takes 15–30 seconds.
            </p>
          </div>
        )}
      </Card>

      <style>{`
        @keyframes indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items = [
    { n: 1, label: "Resume" },
    { n: 2, label: "Job details" },
    { n: 3, label: "Analyze" },
  ];
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {items.map((it, i) => {
        const active = step === it.n;
        const done = step > it.n;
        return (
          <div key={it.n} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : it.n}
              </div>
              <span
                className={`text-sm hidden sm:inline ${
                  active ? "font-medium" : "text-muted-foreground"
                }`}
              >
                {it.label}
              </span>
            </div>
            {i < items.length - 1 && <div className="h-px w-8 sm:w-12 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

