// Import all GIF files from assets directory
const gifModules = import.meta.glob('../../assets/gifs/random*.gif', { eager: true })

// Extract URLs from the imported modules
export const RANDOM_GIFS = Object.values(gifModules).map(mod => (mod as { default: string }).default)

// Special GIFs - use relative paths from the assets directory
export const NETSCAPE_GIF = new URL('../../assets/gifs/netscape.gif', import.meta.url).href
export const WINNER_GIF = new URL('../../assets/gifs/winner.gif', import.meta.url).href