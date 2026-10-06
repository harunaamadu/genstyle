import { InfoPage, infoMetadata } from "@/components/content/info-page";

export const metadata = infoMetadata("terms");

export default function TermsPage() {
  return <InfoPage slug="terms" />;
}