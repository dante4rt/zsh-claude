import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const PROMPT = "~ >";
const PROMPT_COLOR = "#d4a054";
const GREEN = "#4ade80";
const TEXT_COLOR = "#ffffff";
const MUTED = "#9898a0";

interface Example {
  comment: string;
  command: string;
}

const EXAMPLES: Example[] = [
  { comment: "# kill process on port 3000", command: "lsof -ti:3000 | xargs kill" },
  { comment: "# show disk usage sorted by size", command: "du -sh * | sort -rh" },
  { comment: "# find large files over 100mb", command: "find . -type f -size +100M" },
];

// Each example gets 120 frames (4 seconds)
// Typing: frames 0-50, pause: 50-65, replace: 65-80, show result: 80-120
const FRAMES_PER_EXAMPLE = 120;
const TYPING_END = 50;
const REPLACE_START = 65;
const REPLACE_END = 80;

function getTypedText(text: string, frame: number, startFrame: number, endFrame: number): string {
  const progress = interpolate(frame, [startFrame, endFrame], [0, text.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return text.slice(0, Math.floor(progress));
}

interface TerminalLineProps {
  example: Example;
  localFrame: number;
  fps: number;
}

const TerminalLine: React.FC<TerminalLineProps> = ({ example, localFrame }) => {
  const isReplaced = localFrame >= REPLACE_END;
  const isReplacing = localFrame >= REPLACE_START && localFrame < REPLACE_END;

  const typedComment = getTypedText(example.comment, localFrame, 5, TYPING_END);
  const displayText = isReplaced ? example.command : typedComment;
  const textColor = isReplaced ? GREEN : TEXT_COLOR;

  const replaceOpacity = isReplacing
    ? interpolate(localFrame, [REPLACE_START, REPLACE_END], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : isReplaced
      ? 1
      : 0;

  // Ctrl+X badge visibility
  const showBadge = localFrame >= REPLACE_START - 5 && localFrame < REPLACE_END + 15;
  const badgeOpacity = showBadge
    ? interpolate(
        localFrame,
        [REPLACE_START - 5, REPLACE_START, REPLACE_END + 5, REPLACE_END + 15],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 0;

  return (
    <div style={{ marginBottom: 12, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", fontFamily: "monospace", fontSize: 24 }}>
        <span style={{ color: PROMPT_COLOR, marginRight: 12 }}>{PROMPT}</span>
        {isReplacing ? (
          <>
            <span style={{ color: TEXT_COLOR, opacity: 1 - replaceOpacity, position: "absolute", left: 72 }}>
              {example.comment}
            </span>
            <span style={{ color: GREEN, opacity: replaceOpacity }}>
              {example.command}
            </span>
          </>
        ) : (
          <span style={{ color: textColor }}>{displayText}</span>
        )}
      </div>
      {badgeOpacity > 0 && (
        <span
          style={{
            position: "absolute",
            right: -100,
            top: -4,
            background: "#2a2a3e",
            color: MUTED,
            fontSize: 14,
            padding: "4px 10px",
            borderRadius: 6,
            fontFamily: "monospace",
            opacity: badgeOpacity,
          }}
        >
          Ctrl+X
        </span>
      )}
    </div>
  );
};

export const TerminalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#161618",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn,
      }}
    >
      {/* Terminal window */}
      <div
        style={{
          width: 1200,
          backgroundColor: "#1a1a2e",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 48,
            backgroundColor: "#12121e",
            display: "flex",
            alignItems: "center",
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#ff5f57" }} />
            <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#febc2e" }} />
            <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#28c840" }} />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "system-ui, sans-serif",
              fontSize: 14,
              color: "#6a6a78",
            }}
          >
            Terminal
          </div>
          <div style={{ width: 62 }} />
        </div>
        {/* Terminal content */}
        <div style={{ padding: 40 }}>
          {EXAMPLES.map((example, index) => {
            const exampleStart = index * FRAMES_PER_EXAMPLE;
            const localFrame = frame - exampleStart;
            if (localFrame < 0) return null;
            return (
              <TerminalLine
                key={index}
                example={example}
                localFrame={Math.min(localFrame, FRAMES_PER_EXAMPLE)}
                fps={fps}
              />
            );
          })}
          {/* Blinking cursor */}
          <div style={{ fontFamily: "monospace", fontSize: 24, marginTop: 4 }}>
            <span style={{ color: PROMPT_COLOR }}>{PROMPT}</span>
            <span
              style={{
                color: TEXT_COLOR,
                opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
                marginLeft: 12,
              }}
            >
              _
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
