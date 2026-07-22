import React from "react";
import * as LucideIcons from "lucide-react";

interface IconRendererProps {
  name?: string;
  className?: string;
}

export function IconRenderer({ name, className }: IconRendererProps) {
  if (!name) {
    return <LucideIcons.HelpCircle className={className} />;
  }

  // Capitalize first letter to match Lucide exports (e.g. "cpu" -> "Cpu")
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  // Retrieve matching icon or fallback to HelpCircle
  const IconComponent = (LucideIcons as any)[formattedName] || LucideIcons.HelpCircle;

  return <IconComponent className={className} />;
}

// A helper list of common icons for the searchable picker preview
export const COMMON_ICONS = [
  "Smartphone", "Laptop", "Tablet", "Watch", "Headphones", "Gamepad", "Camera", 
  "Tv", "Speaker", "Wifi", "Bluetooth", "Cpu", "Battery", "BatteryCharging", 
  "Zap", "Maximize2", "Monitor", "HardDrive", "Disc", "Activity", "AlertTriangle",
  "EyeOff", "VolumeX", "WifiOff", "CameraOff", "Wrench", "Heart", "Clock", 
  "DollarSign", "Percent", "Shield", "Truck", "CheckCircle", "HelpCircle"
];
