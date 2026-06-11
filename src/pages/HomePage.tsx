import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCard } from "@/components/home/FeatureCard";
import { Laptop, MessageSquare, Clock } from "lucide-react";
import placeholderImg from "@/assets/img/placeholder.jpeg";

import { Navigate } from "react-router";
import { useLanguage } from "@/contexts/LanguageContext";

export function HomePage() {
  const token = localStorage.getItem("jwt_token");
  const { t } = useLanguage();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
      <HeroSection />
      
      <div className="space-y-24 md:space-y-32 pb-20">
        <FeatureCard
          icon={<Laptop className="w-6 h-6" />}
          title="Online submission"
          description={t('homeFeature1Desc')}
          imageSrc={placeholderImg}
          imagePosition="left"
        />
        
        <FeatureCard
          icon={<MessageSquare className="w-6 h-6" />}
          title="SMS updates"
          description={t('homeFeature2Desc')}
          imageSrc={placeholderImg}
          imagePosition="right"
        />
        
        <FeatureCard
          icon={<Clock className="w-6 h-6" />}
          title="No more long queues"
          description={t('homeFeature3Desc')}
          imageSrc={placeholderImg}
          imagePosition="left"
        />
      </div>
    </div>
  );
}
