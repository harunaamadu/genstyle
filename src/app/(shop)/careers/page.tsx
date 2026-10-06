import { InfoPage, infoMetadata } from "@/components/content/info-page";

export const metadata = infoMetadata("careers");

export default function CareersPage() {
  return <InfoPage slug="careers" />;
}