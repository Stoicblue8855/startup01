/** True when a "show.*" switch in the page_content table is set to yes. */
export function isShown(map: Record<string, string>, key: string): boolean {
  return (map[key] ?? '').trim().toLowerCase().startsWith('y')
}

/** Footer / menu links that can be switched off, and the switch that controls each. */
export const PATH_SWITCH: Record<string, string> = {
  '/about': 'show.page.about',
  '/journal': 'show.page.journal',
  '/sustainability': 'show.page.sustainability',
  '/careers': 'show.page.careers',
}
