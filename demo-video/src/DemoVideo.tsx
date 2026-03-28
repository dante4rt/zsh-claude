import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TitleScene } from "./scenes/TitleScene";
import { TerminalScene } from "./scenes/TerminalScene";
import { CTAScene } from "./scenes/CTAScene";

export const DemoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0c0e" }}>
      <Sequence from={0} durationInFrames={120}>
        <TitleScene />
      </Sequence>
      <Sequence from={120} durationInFrames={360}>
        <TerminalScene />
      </Sequence>
      <Sequence from={480} durationInFrames={120}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
