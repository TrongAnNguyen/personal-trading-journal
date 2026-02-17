import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListChecks, Shield, LogOut, Loader2 } from "lucide-react";
import { DisciplineSettings } from "@/components/settings/discipline-settings";
import { SecuritySettings } from "@/components/settings/security-settings";
import { SessionSettings } from "@/components/settings/session-settings";
import { Suspense } from "react";

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase">
          USER_PARAMETERS
        </h1>
        <p className="text-muted-foreground text-xs uppercase">
          Adjust account operational parameters and security protocols.
        </p>
      </div>

      <Separator />

      <div className="grid gap-6">
        {/* Discipline Checklist */}
        <Card className="border-white/5 bg-black/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ListChecks className="text-primary h-5 w-5" />
              <CardTitle className="font-mono text-lg uppercase">
                Discipline Checklist
              </CardTitle>
            </div>
            <CardDescription className="text-xs uppercase">
              Rules to follow before executing every trade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="text-primary/50 h-6 w-6 animate-spin" />
                </div>
              }
            >
              <DisciplineSettings />
            </Suspense>
          </CardContent>
        </Card>

        {/* Security / Password */}
        <Card className="border-white/5 bg-black/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="text-primary h-5 w-5" />
              <CardTitle className="font-mono text-lg uppercase">
                Security
              </CardTitle>
            </div>
            <CardDescription className="text-xs uppercase">
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecuritySettings />
          </CardContent>
        </Card>

        {/* Account / Logout */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <div className="text-destructive flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              <CardTitle className="font-mono text-lg uppercase">
                Session
              </CardTitle>
            </div>
            <CardDescription className="text-xs uppercase">
              Sign out of your account from this device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SessionSettings />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
