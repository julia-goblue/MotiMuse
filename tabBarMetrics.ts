/**
 * Must stay in sync with `App.tsx` MainTabs `tabBarStyle` (floating pill bar).
 * Used so tab screens can pad content above the overlay.
 */
export const FLOATING_TAB_BAR = {
  positionBottom: 18,
  height: 72,
} as const;

/** Distance from physical bottom to top edge of the tab bar. */
export function floatingTabBarTopFromBottom(): number {
  return FLOATING_TAB_BAR.positionBottom + FLOATING_TAB_BAR.height;
}
