import { stage } from './scrollMath';
import { INGREDIENTS_READING_UNITS, SCROLL } from './constants';
/** Shared by DOM labels and the single hero/identity spatial scene. */
export function storyProgress(offset:number, workStart:number, viewport:number){
  const readingDistance=viewport*INGREDIENTS_READING_UNITS*SCROLL.SECTION_PADDING;
  const travel=Math.max(1,workStart-viewport-readingDistance);
  const ingredients=travel*.52;
  // Native scroll continues while the complete ingredients composition stays readable.
  // Removing the added distance after the hold preserves all later scene speeds.
  const consumedHold=Math.min(readingDistance,Math.max(0,offset-ingredients));
  return stage(offset-consumedHold,0,travel);
}
