import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCard } from "@/components/home/FeatureCard";
import { Laptop, MessageSquare, Clock } from "lucide-react";
import placeholderImg from "@/assets/img/placeholder.jpeg";

import { Navigate } from "react-router";

export function HomePage() {
  const token = localStorage.getItem("jwt_token");

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
          description="Mag-submit ng request kahit nasa bahay. Hindi mo na kailangang pumunta sa barangay hall para lang mag-fill up ng form. Ginawa naming madali at accessible ito para sa lahat."
          imageSrc={placeholderImg}
          imagePosition="left"
        />
        
        <FeatureCard
          icon={<MessageSquare className="w-6 h-6" />}
          title="SMS updates"
          description="Makatanggap ng status updates sa text. I-track ang iyong request sa bawat hakbang at malaman agad kung kailangan mo nang pumunta sa hall."
          imageSrc={placeholderImg}
          imagePosition="right"
        />
        
        <FeatureCard
          icon={<Clock className="w-6 h-6" />}
          title="No more long queues"
          description="Pumunta lang sa barangay hall pag ready na ang dokumento. I-schedule ang oras na gusto mo para mas mabilis at walang abala sa iyong araw."
          imageSrc={placeholderImg}
          imagePosition="left"
        />
      </div>
    </div>
  );
}
