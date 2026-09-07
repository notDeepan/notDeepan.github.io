import { assetPath } from '../lib/assetPath';
export interface Project {
  id:string; title:string; category:string; description:string; technologies:string[];
  cover:string; liveUrl?:string; private?:boolean; status?:string; coverKind?:'artwork'|'screenshot';
}
export const projects:Project[] = [
  {id:'kaoming',title:'KAO MING',category:'INDUSTRIAL · DIGITAL SHOWROOM',description:'A bilingual digital showroom that turns complex machinery into an intuitive, interactive product journey.',technologies:['Next.js','TypeScript','React Three Fiber','next-intl'],cover:assetPath('/assets/projects/kaoming.webp'),liveUrl:'https://notdeepan.github.io/kaoming-website/',private:true,status:'Website preview · source kept private'},
  {id:'sunset',title:'Cijin Sunset Bar',category:'HOSPITALITY · WEB EXPERIENCE',description:'From a beachfront sunset to the afterparty. A bilingual day-to-night experience for Cijin Sunset Bar and Brickyard.',technologies:['Next.js','React Three Fiber','GSAP','next-intl'],cover:assetPath('/assets/projects/sunset.webp'),liveUrl:'https://notdeepan.github.io/cijin-sunset/',status:'Website concept · content awaiting confirmation'},
  {id:'harborside',title:'Harborside Coffee',category:'FOOD & DRINK · STUDIO DEMO',description:'A photography-led café concept with bilingual menus, thoughtful motion and a warm editorial identity.',technologies:['HTML','CSS','JavaScript','GSAP'],cover:assetPath('/assets/projects/harborside.webp'),coverKind:'screenshot',liveUrl:'https://notdeepan.github.io/kaohsiung-demos/cafe/',status:'Studio demo · fictional business'},
  {id:'tide-house',title:'Tide House',category:'HOSPITALITY · STUDIO DEMO',description:'An inviting stay, before you arrive. A bilingual guesthouse concept with availability, booking requests and ferry directions.',technologies:['HTML','CSS','JavaScript'],cover:assetPath('/assets/projects/tide-house.webp'),liveUrl:'https://notdeepan.github.io/kaohsiung-demos/bnb/',status:'Studio demo · fictional business'},
  {id:'takao',title:'Takao Pantry',category:'COMMERCE · STUDIO DEMO',description:'A specialty food and gifting concept with a bilingual storefront, currency switching and a demonstration checkout.',technologies:['HTML','CSS','JavaScript'],cover:assetPath('/assets/projects/takao.webp'),liveUrl:'https://notdeepan.github.io/kaohsiung-demos/shop/',status:'Studio demo · fictional business'},
];

