import assert from 'node:assert/strict';
import test from 'node:test';
import { ScrollEngine } from '../src/lib/scrollEngine';

function mountEngine(osReduced = false) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  let motionListener: ((event: {matches: boolean}) => void) | undefined;
  const root = {
    scrollTop: 0, style: {overflowY:'auto',scrollBehavior:''},
    querySelector: () => null, addEventListener() {}, removeEventListener() {},
  };
  Object.defineProperty(globalThis, 'window', {configurable:true,value:{
    innerWidth:1280,innerHeight:800,addEventListener() {},removeEventListener() {},
    matchMedia: (query:string) => ({
      matches: query.includes('reduced-motion') && osReduced,
      addEventListener: (_:string,listener:typeof motionListener) => { if(query.includes('reduced-motion'))motionListener=listener; },
      removeEventListener() {},
    }),
  }});
  const engine=new ScrollEngine();
  engine.attach(root as unknown as HTMLElement);
  return {engine,root,changeOS:(matches:boolean)=>motionListener?.({matches}),dispose(){
    engine.detach();
    if(previous)Object.defineProperty(globalThis,'window',previous);
    else Reflect.deleteProperty(globalThis,'window');
  }};
}

test('simple view immediately settles motion and preserves the OS preference when disabled',()=>{
  const fixture=mountEngine();
  try {
    const {engine,root,changeOS}=fixture;
    root.scrollTop=2000;engine.update(1/60);
    assert.ok(engine.smooth>0 && engine.smooth<root.scrollTop);
    engine.setMotionOverride(true);
    assert.equal(engine.smooth,2000);
    assert.equal(engine.velocity,0);
    changeOS(true);engine.setMotionOverride(false);
    assert.equal(engine.reducedMotion,true);
    changeOS(false);assert.equal(engine.reducedMotion,false);
    root.scrollTop=3000;engine.update(1/60);
    assert.ok(engine.smooth<3000);
  } finally {fixture.dispose();}
});

test('opening a modal during scroll holds its displayed position through preference changes',()=>{
  const fixture=mountEngine();
  try {
    const {engine,root}=fixture;
    root.scrollTop=2500;engine.update(1/60);
    const displayed=engine.smooth;
    engine.lock();
    assert.equal(root.style.overflowY,'hidden');
    engine.scrollToSection('contact',true);
    root.scrollTop=9000;
    engine.setMotionOverride(true);engine.update(1/60);
    assert.equal(engine.smooth,displayed);
    assert.equal(root.scrollTop,displayed);
    engine.unlock();
    assert.equal(root.style.overflowY,'auto');
    assert.equal(engine.isLocked,false);
    assert.equal(engine.smooth,displayed);
  } finally {fixture.dispose();}
});
