"use client";

import { useEffect } from "react";

interface AnalyticsTriggerProps {
  productId: string;
}

export function AnalyticsTrigger({ productId }: AnalyticsTriggerProps) {
  useEffect(() => {
    if (!productId) return;
    
    // Trigger background view count increment on mount
    fetch(`/api/products/${productId}/views`, {
      method: "POST",
    })
      .then((res) => res.json())
      .catch((err) => console.error("Analytics tracking failed:", err));
  }, [productId]);

  return null; // Invisible trigger component
}
