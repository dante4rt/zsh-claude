import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, 1 * fps], [20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0c0c0e",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 42,
          color: "#ffffff",
          fontWeight: 600,
        }}
      >
        github.com/dante4rt/zsh-claude
      </div>
      <div
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 26,
          color: "#9898a0",
          marginTop: 24,
        }}
      >
        Works with Claude Haiku + OpenRouter
      </div>
    </AbsoluteFill>
  );
};
