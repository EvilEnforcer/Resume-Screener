import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
    else if (user.username !== "admin") navigate({ to: "/app" });
  }, [user, loading, navigate]);

  if (loading || !user || user.username !== "admin") return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto h-12 w-12 rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elegant)] mb-2" />
          <CardTitle>Admin dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Coming soon.</p>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
          >
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
