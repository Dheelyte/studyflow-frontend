import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Backdrop } from "../SetYourGoal/Backdrop";
import {
  ZapIcon,
  StarIcon,
  TrophyIconSimple,
  TrendingUpIcon,
  FlameIcon,
} from "../icons";
import { StatTile, TILE_WIDTH, TILE_HEIGHT } from "./StatTile";
import {
  HeatmapGrid,
  HeatmapPanel,
  HeatmapLegend,
  WEEKS,
  DAYS,
  CELL_SIZE,
  CELL_GAP,
  GRID_WIDTH,
  GRID_HEIGHT,
  TODAY_WEEK,
  TODAY_DAY,
  getCellPosition,
} from "./HeatmapGrid";
import { XpBadge } from "./XpBadge";
import { Camera, useCameraPath } from "../Camera";

const TILE_GAP = 18;
const ROW_WIDTH = 4 * TILE_WIDTH + 3 * TILE_GAP;
const DAY_LABEL_WIDTH = 28;
const PANEL_INNER_PADDING = 28;
const PANEL_WIDTH = ROW_WIDTH;
const PANEL_HEIGHT = 248;
const STATS_Y = 152;
const PANEL_Y = STATS_Y + TILE_HEIGHT + 28;

const HEADER_HEIGHT = 36;
const GRID_OFFSET_TOP = PANEL_INNER_PADDING + HEADER_HEIGHT + 18;

const clamped = (frame, start, end) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const formatNumber = (n) => Math.round(n).toLocaleString();

export const GamifiedMotivation = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const streakReveal = spring({
    frame: frame - 0,
    fps,
    config: { damping: 14, mass: 0.7 },
    durationInFrames: 28,
  });
  const tileReveals = [
    streakReveal,
    spring({ frame: frame - 100, fps, config: { damping: 14, mass: 0.7 }, durationInFrames: 28 }),
    spring({ frame: frame - 110, fps, config: { damping: 14, mass: 0.7 }, durationInFrames: 28 }),
    spring({ frame: frame - 120, fps, config: { damping: 14, mass: 0.7 }, durationInFrames: 28 }),
  ];

  const streakBump = frame >= 290 ? 1 : 0;
  const streakCountUp = clamped(frame, 35, 80);
  const streakValue = streakBump ? 13 : Math.round(streakCountUp * 12);

  const xpBumpProgress = clamped(frame, 298, 335);
  const xpCountUp = clamped(frame, 110, 160);
  const xpBase = Math.round(xpCountUp * 2450);
  const xpValue = xpBase + Math.round(xpBumpProgress * 50);

  const levelReveal = tileReveals[2];
  const rankReveal = tileReveals[3];

  const streakTilePulse = interpolate(
    frame,
    [285, 297, 315],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const xpTilePulse = interpolate(
    frame,
    [295, 308, 328],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const panelSpring = spring({
    frame: frame - 150,
    fps,
    config: { damping: 16, mass: 0.8 },
    durationInFrames: 30,
  });
  const panelOpacity = panelSpring;

  const heatmapFillStart = 180;
  const heatmapFillDuration = 85;

  const todayPulse = interpolate(
    frame,
    [270, 288, 308, 328, 348],
    [0, 1, 0.2, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const streakHighlight = interpolate(frame, [265, 290, 360], [0, 1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeProgress = clamped(frame, 292, 340);
  const badgeOpacity = interpolate(
    frame,
    [292, 308, 332, 345],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const finalFade = interpolate(frame, [378, 390], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const statsLeft = (width - ROW_WIDTH) / 2;
  const panelLeft = (width - PANEL_WIDTH) / 2;
  const gridLeft = panelLeft + PANEL_INNER_PADDING + DAY_LABEL_WIDTH;
  const gridTop = PANEL_Y + GRID_OFFSET_TOP;

  const todayCell = getCellPosition(TODAY_WEEK, TODAY_DAY);
  const todayAbsX = gridLeft + todayCell.x;
  const todayAbsY = gridTop + todayCell.y;

  const tileConfigs = [
    {
      icon: <ZapIcon size={24} color="#eab308" fill="#eab308" />,
      iconColor: "#eab308",
      iconBg: "rgba(234, 179, 8, 0.14)",
      value: (
        <span style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
          {streakValue}
          <FlameIcon size={20} color="#f97316" fill="#fde68a" />
        </span>
      ),
      label: "Day Streak",
      reveal: tileReveals[0],
      pulse: streakTilePulse,
    },
    {
      icon: <StarIcon size={24} color="#3b82f6" fill="#3b82f6" />,
      iconColor: "#3b82f6",
      iconBg: "rgba(59, 130, 246, 0.14)",
      value: formatNumber(xpValue),
      label: "Total XP",
      reveal: tileReveals[1],
      pulse: xpTilePulse,
    },
    {
      icon: <TrophyIconSimple size={24} color="#a855f7" />,
      iconColor: "#a855f7",
      iconBg: "rgba(168, 85, 247, 0.14)",
      value: "Lvl 5",
      label: "Scholar",
      reveal: levelReveal,
      pulse: 0,
    },
    {
      icon: <TrendingUpIcon size={24} color="#10b981" />,
      iconColor: "#10b981",
      iconBg: "rgba(16, 185, 129, 0.14)",
      value: "Top 5%",
      label: "Learner",
      reveal: rankReveal,
      pulse: 0,
    },
  ];

  const statsCenterX = statsLeft + ROW_WIDTH / 2;
  const streakTileCenterX = statsLeft + TILE_WIDTH / 2;
  const xpTileCenterX = statsLeft + TILE_WIDTH + TILE_GAP + TILE_WIDTH / 2;
  const statsCenterY = STATS_Y + TILE_HEIGHT / 2;
  const panelCenterX = panelLeft + PANEL_WIDTH / 2;
  const panelCenterY = PANEL_Y + PANEL_HEIGHT / 2;

  const cam = useCameraPath(
    frame,
    [
      { frame: 0, x: streakTileCenterX, y: statsCenterY, scale: 3.8 },
      { frame: 90, x: streakTileCenterX, y: statsCenterY, scale: 3.8 },
      { frame: 140, x: 640, y: 360, scale: 1.0 },
      { frame: 390, x: 640, y: 360, scale: 1.0 },
    ],
    { x: 640, y: 360, scale: 1 }
  );

  return (
    <AbsoluteFill style={{ opacity: finalFade }}>
      <Backdrop filterId="gamifiedBlur" />

      <Camera focusX={cam.x} focusY={cam.y} scale={cam.scale}>
      <div
        style={{
          position: "absolute",
          left: statsLeft,
          top: STATS_Y,
          display: "flex",
          gap: TILE_GAP,
        }}
      >
        {tileConfigs.map((cfg, i) => (
          <StatTile key={i} {...cfg} />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: panelLeft,
          top: PANEL_Y,
          width: PANEL_WIDTH,
        }}
      >
        <HeatmapPanel opacity={panelOpacity}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
                Activity Log
              </span>
              <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                Last year · Top 5% consistency
              </span>
            </div>
            <HeatmapLegend opacity={panelOpacity} />
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div
              style={{
                width: DAY_LABEL_WIDTH - 8,
                display: "grid",
                gridTemplateRows: `repeat(${DAYS}, ${CELL_SIZE + CELL_GAP}px)`,
                fontSize: 10,
                color: "#9ca3af",
                fontWeight: 500,
                lineHeight: `${CELL_SIZE}px`,
                marginTop: 0,
              }}
            >
              <span />
              <span>Mon</span>
              <span />
              <span>Wed</span>
              <span />
              <span>Fri</span>
              <span />
            </div>

            <div style={{ position: "relative" }}>
              <HeatmapGrid
                frame={frame}
                startFrame={heatmapFillStart}
                duration={heatmapFillDuration}
                todayPulse={todayPulse}
                streakHighlight={streakHighlight}
              />
            </div>
          </div>
        </HeatmapPanel>
      </div>

      {badgeOpacity > 0 && (
        <XpBadge
          x={todayAbsX}
          y={todayAbsY - 18}
          float={badgeProgress}
          opacity={badgeOpacity}
          label="+50 XP"
        />
      )}

      {streakHighlight > 0.3 && frame >= 285 && frame < 320 && (
        <div
          style={{
            position: "absolute",
            left: statsLeft + 26,
            top: STATS_Y + 16,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(234, 179, 8, 0.5), rgba(234, 179, 8, 0))",
            opacity: streakTilePulse,
            pointerEvents: "none",
          }}
        />
      )}
      </Camera>
    </AbsoluteFill>
  );
};
