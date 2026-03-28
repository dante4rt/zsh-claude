import React from "react";
import { Composition } from "remotion";
import { DemoVideo } from "./DemoVideo";

export const Root: React.FC = () => {
  return (
    <Composition
      id="DemoVideo"
      component={DemoVideo}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
