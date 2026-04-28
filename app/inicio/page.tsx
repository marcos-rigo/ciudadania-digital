import { PublicLayout } from "@/components/layouts/public-layout"
import { HeroSection } from "@/components/home/hero-section"
import { ChallengeSection } from "@/components/home/challenge-section"
import { EcosystemSection } from "@/components/home/ecosystem-section"
import { BenefitsSection } from "@/components/home/benefits-section"
import { ScalabilitySection } from "@/components/home/scalability-section"

export const metadata = { title: 'Secretaría de Participación Ciudadana' }

export default function InicioPage() {
  return (
    <PublicLayout>
      <HeroSection />
      <ChallengeSection />
      <EcosystemSection />
      <BenefitsSection />
      <ScalabilitySection />
    </PublicLayout>
  )
}
