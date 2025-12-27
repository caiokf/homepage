import type { CSSProperties } from "vue";

export interface StaggerAnimationOptions {
  /**
   * Delay increment between each item in milliseconds
   * @default 100
   */
  delayIncrement?: number;

  /**
   * CSS variable name for the animation delay
   * @default '--stagger-delay'
   */
  cssVariable?: string;
}

export interface StaggerAnimationReturn {
  /**
   * Get inline styles for an item at the given index
   */
  getStaggerStyle: (index: number) => CSSProperties;

  /**
   * Get the delay for an item at the given index in milliseconds
   */
  getDelay: (index: number) => number;
}

/**
 * Composable for staggered entrance animations
 *
 * @example
 * ```vue
 * <script setup>
 * const { getStaggerStyle } = useStaggerAnimation({ delayIncrement: 100 })
 * </script>
 *
 * <template>
 *   <div
 *     v-for="(item, index) in items"
 *     :style="getStaggerStyle(index)"
 *     class="animate-item"
 *   >
 *     {{ item }}
 *   </div>
 * </template>
 *
 * <style>
 * .animate-item {
 *   animation: slideIn 300ms ease-out backwards;
 *   animation-delay: var(--stagger-delay, 0ms);
 * }
 * </style>
 * ```
 */
export function useStaggerAnimation(
  options: StaggerAnimationOptions = {}
): StaggerAnimationReturn {
  const { delayIncrement = 100, cssVariable = "--stagger-delay" } = options;

  const getDelay = (index: number): number => {
    return index * delayIncrement;
  };

  const getStaggerStyle = (index: number): CSSProperties => {
    return {
      [cssVariable]: `${getDelay(index)}ms`,
    } as CSSProperties;
  };

  return {
    getStaggerStyle,
    getDelay,
  };
}
