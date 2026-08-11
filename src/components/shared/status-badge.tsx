import { Badge } from "@/components/ui/badge";
import type { DocumentStatus, RiskLevel, ClientStatus, ProcessingStatus } from "@/types";
import { PROCESSING_STATUS_LABELS } from "@/lib/constants";

const DOC_STATUS_MAP: Record<DocumentStatus, { label: string; variant: "green" | "amber" | "red" | "ink" | "gold" }> = {
  completed: { label: "Completed", variant: "green" },
  processing: { label: "Processing", variant: "gold" },
  uploading: { label: "Uploading", variant: "ink" },
  missing: { label: "Missing", variant: "ink" },
  failed: { label: "Failed", variant: "red" },
};

const RISK_MAP: Record<RiskLevel, { label: string; variant: "green" | "amber" | "red" }> = {
  low: { label: "Low risk", variant: "green" },
  medium: { label: "Medium risk", variant: "amber" },
  high: { label: "High risk", variant: "red" },
};

const CLIENT_STATUS_MAP: Record<ClientStatus, { label: string; variant: "green" | "amber" | "ink" }> = {
  complete: { label: "Complete", variant: "green" },
  action_needed: { label: "Action needed", variant: "amber" },
  onboarding: { label: "Onboarding", variant: "ink" },
};

/**
 * Colors follow the same convention used elsewhere in the app: gold
 * marks "the AI is actively working on this" (processing/classified/
 * extracted/validated are all mid-pipeline AI stages), green means the
 * document is ready to use, red means the pipeline failed, and ink is
 * the neutral "hasn't started yet" state.
 */
const PROCESSING_STATUS_VARIANT: Record<ProcessingStatus, "green" | "amber" | "red" | "ink" | "gold"> = {
  uploaded: "ink",
  processing: "gold",
  classified: "gold",
  extracted: "gold",
  validated: "gold",
  ready: "green",
  failed: "red",
};

export function ProcessingStatusBadge({ status }: { status: ProcessingStatus }) {
  return <Badge variant={PROCESSING_STATUS_VARIANT[status]}>{PROCESSING_STATUS_LABELS[status]}</Badge>;
}

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const { label, variant } = DOC_STATUS_MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const { label, variant } = RISK_MAP[level];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const { label, variant } = CLIENT_STATUS_MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}
