import { JazzKit } from "@/components/JazzKit";
import {
  FeelSection,
  Hero,
  PracticeSection,
  SiteFooter,
  SiteHeader,
} from "@/components/SiteSections";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <JazzKit />
        <FeelSection />
        <PracticeSection />
      </main>
      <SiteFooter />
    </>
  );
}
