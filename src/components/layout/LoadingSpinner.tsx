"use client";

import React from "react";

export default function LoadingSpinner({ fullScreen = true }: { fullScreen?: boolean }) {
  const video = (
    <video
      src="assets/webm/rabbit_loading.webm"
      autoPlay
      loop
      muted
      playsInline
      className="h-24 w-24 object-contain mx-auto"
    />
  );

  if (!fullScreen) return video;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f5f7f2_0%,#eaf4e4_45%,#dfeedd_100%)] bg-white">
      {video}
    </div>
  );
}
