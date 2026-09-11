import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSectionLayout, progressToOffset, sectionProgress, sampleTimeline } from '../src/lib/scrollMath';
import { storyProgress } from '../src/lib/storyTimeline';
import { PROJECT_WINDOWS, INGREDIENTS_READING_UNITS, SCROLL } from '../src/lib/constants';

test('mobile shortens travel while every existing Work focal peak remains reachable and ordered',()=>{
 const desktop=createSectionLayout(844),mobile=createSectionLayout(844,true);
 const total=(sections:typeof mobile)=>sections.at(-1)!.startPx+sections.at(-1)!.heightPx-844;
 assert.ok(total(mobile)<total(desktop)*.75);
 const work=mobile.find(s=>s.id==='projects')!;
 let previous=work.startPx;
 for(const {peak} of PROJECT_WINDOWS){
  const offset=progressToOffset(peak,844,work);
  assert.ok(offset>previous);assert.ok(offset<work.startPx+work.heightPx-844);
  assert.ok(Math.abs(sectionProgress(offset,844,work)-peak)<1e-8);previous=offset;
 }
 assert.equal(sampleTimeline(total(mobile),844,mobile).overall,1);
});
test('shared story is continuous at the retained chapter boundary and ends at the Work handoff',()=>{
 for(const mobile of [false,true]){
  const sections=createSectionLayout(844,mobile),work=sections[2];
  const boundary=sections[1].startPx;
  assert.equal(storyProgress(0,work.startPx,844),0);
  const before=storyProgress(boundary-.1,work.startPx,844),after=storyProgress(boundary+.1,work.startPx,844);
  assert.ok(after>=before&&after-before<.001);
  assert.equal(storyProgress(work.startPx,work.startPx,844),1);
 }
});

test('ingredients stay fully composed for an extra viewport without shortening later scenes',()=>{
 for(const mobile of [false,true]){
  const viewport=844,work=createSectionLayout(viewport,mobile)[2];
  const hold=viewport*INGREDIENTS_READING_UNITS*SCROLL.SECTION_PADDING;
  const travel=work.startPx-viewport-hold,start=travel*.52;
  for(const distance of [0,hold*.25,hold*.5,hold*.75,hold]){
   assert.ok(Math.abs(storyProgress(start+distance,work.startPx,viewport)-.52)<1e-8);
  }
  const advance=100;
  assert.ok(Math.abs(storyProgress(start+hold+advance,work.startPx,viewport)-(.52+advance/travel))<1e-8);
  assert.ok(Math.abs(storyProgress(start-advance,work.startPx,viewport)-(.52-advance/travel))<1e-8);
 }
});
