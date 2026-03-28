import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 1.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, 1.5 * fps], [30, 0], {
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
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 96,
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: -2,
        }}
      >
        zsh-claude
      </div>
      <div
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 32,
          color: "#9898a0",
          marginTop: 20,
        }}
      >
        AI-powered command completion for ZSH
      </div>
    </AbsoluteFill>
  );
};
