import { stage } from './scrollMath';
/** Shared by DOM labels and the single hero/identity spatial scene. */
export function storyProgress(offset:number, workStart:number, viewport:number){
  return stage(offset,0,Math.max(1,workStart-viewport));
}
