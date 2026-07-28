"use client";

import React from "react";

export const PostCardSkeleton: React.FC = () => {
  return (
    <div
      className="w-full max-w-2xl mx-auto overflow-hidden border border-white/5 bg-[#0a0a0a]/80 shadow-2xl backdrop-blur-xl animate-pulse"
      style={{ borderRadius: "1.5rem" }}
    >
      <div style={{ padding: "1.25rem 1.25rem 0 1.25rem" }}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-full bg-white/10 flex-shrink-0"
              />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-32 bg-white/10 rounded"></div>
                <div className="h-3 w-24 bg-white/10 rounded"></div>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-white/10"></div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="h-4 w-full bg-white/10 rounded"></div>
            <div className="h-4 w-5/6 bg-white/10 rounded"></div>
            <div className="h-4 w-4/6 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
      <div style={{ padding: "1rem 1.25rem 1.25rem 1.25rem" }}>
        <div
          className="w-full bg-white/10"
          style={{ borderRadius: "1.25rem", height: "300px" }}
        />
      </div>
      <div
        className="flex items-center justify-between border-t border-white/5 bg-white/[0.02]"
        style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "0.875rem", paddingBottom: "0.875rem" }}
      >
        <div className="flex items-center gap-6">
          <div className="h-8 w-16 bg-white/10 rounded-full"></div>
          <div className="h-8 w-16 bg-white/10 rounded-full"></div>
          <div className="h-8 w-16 bg-white/10 rounded-full"></div>
        </div>
        <div className="h-8 w-16 bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
};
