import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
}

export function FeatureCard({
  icon,
  title,
  description,
  imageSrc,
  imageAlt = "",
  imagePosition = "left",
}: FeatureCardProps) {
  return (
    <div className={cn(
      "flex flex-col gap-8 md:gap-16 items-center",
      imagePosition === "left" ? "md:flex-row" : "md:flex-row-reverse"
    )}>
      <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-sm h-64 md:h-80 bg-gray-100 flex-shrink-0 relative">
        <img 
          src={imageSrc} 
          alt={imageAlt} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="w-full md:w-1/2 space-y-4">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-primary mb-6">
          {icon}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed max-w-md">
          {description}
        </p>
      </div>
    </div>
  );
}
