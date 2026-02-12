// Legacy exports (for backward compatibility)
export { ScrollAnimation, generateFramePaths } from './ScrollAnimation';
export { ParallaxSection, ETHNO_PATTERNS } from './ParallaxSection';
export { FadeInView, StaggerContainer, ScaleFade } from './FadeInView';

// Optimized animations (use these for better performance)
export {
  FadeInOnScroll,
  StaggerContainer as OptimizedStagger,
  StaggerItem,
  ParallaxBackground,
  LiveBackground,
  TextReveal,
  CountUp,
} from './OptimizedAnimations';

// Ethno decorations (CSS-only, maximum performance)
export {
  FloatingOrbs,
  EtnoPatternOverlay,
  ScrollProgressBar,
  SectionDivider,
  GlowingAccent,
} from './EtnoDecorations';

// Zone transitions
export { ZoneColorTransition, useZoneColors } from './ZoneColorTransition';
export { ZoneTransitionProvider, useZoneTransition } from './ZoneTransitionOverlay';
export { PageTransition } from './PageTransition';

// S-Thread animations (Skeramos signature element)
export { SThreadAnimation, SThreadDivider, SParticles } from './SThreadAnimation';

// Parallax Hero with dynamic images
export {
  ParallaxHero,
  ParallaxBackground as ParallaxBg,
  KenBurnsHero,
} from './ParallaxHero';

// Scroll-driven frame animation (for video-like backgrounds)
export { ScrollFrameAnimation } from './ScrollFrameAnimation';

// Side pottery animation (fixed spinning pottery on scroll)
export { SidePotteryAnimation } from './SidePotteryAnimation';
