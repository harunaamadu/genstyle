import { InfoPage, infoMetadata } from "@/components/content/info-page";

export const metadata = infoMetadata("privacy");

export default function PrivacyPage() {
  return <InfoPage slug="privacy" />;
}