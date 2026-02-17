import { getDisciplineChecklist } from "@/lib/actions/checklist";
import { DisciplineSettingsForm } from "./discipline-settings-form";

export async function DisciplineSettings() {
  const checklist = await getDisciplineChecklist();
  const initialItems = checklist?.items || [];

  return <DisciplineSettingsForm initialItems={initialItems} />;
}
