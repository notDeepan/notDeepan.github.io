/** Public files need the same base path as Next's generated bundles on Pages. */
export const assetPath = (path:string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
