// Weekly league rules. Pure and shared by the client (display) and the server (authoritative scoring).
import {STRAINS,STRAIN_IDS} from './engine.mjs';

export const WEEK_MS=7*86400000,MONDAY_EPOCH=4*86400000; // 1970-01-05 00:00 UTC was a Monday
export const WEEK_CAP=500,QUALITY_CAP=200,DECAY=.15,DECAY_FLOOR=.25;
// Base points per completed order. Fixed per buyer, not per dollar, so upgrades do not inflate scores.
export const ORDER_POINTS={tony:20,rick:8,bryce:35};
// Divisions are locked from lifetime sales when a player first scores in a week, so newcomers race newcomers.
export const DIVISIONS=[{id:'garage',name:'Garage',max:1500},{id:'warehouse',name:'Warehouse',max:8000},{id:'empire',name:'Empire',max:Infinity}];

export const weekId=(now)=>Math.floor((now-MONDAY_EPOCH)/WEEK_MS);
export const weekStart=(id)=>MONDAY_EPOCH+id*WEEK_MS;
export const weekEnd=(id)=>weekStart(id+1);
export const divisionFor=(sold)=>DIVISIONS.find(d=>sold<d.max).id;

export const blankWeek=(week,sold)=>({week,division:divisionFor(sold),points:0,orders:0,premiumJars:0,quality:0,perBuyer:{}});

// Jars taken from stock by strain, from before/after stock snapshots.
export function jarsTaken(before,after){const t={};for(const id of STRAIN_IDS){const n=(before[id]||0)-(after[id]||0);if(n>0)t[id]=n;}return t;}

// Score one completed buyer order into a week record (mutates and returns the points gained).
// Orders: base points, shrinking 15% for each repeat of the same buyer (floor 25%).
// Quality: 2 x (tier-1) per premium (tier 2+) jar delivered, capped per week. Whole week capped.
export function scoreOrder(w,offerId,taken){
 const base=ORDER_POINTS[offerId];if(!base)return 0;
 const n=w.perBuyer[offerId]||0,orderPts=Math.round(base*Math.max(DECAY_FLOOR,1-DECAY*n));
 let q=0,pj=0;for(const[id,c]of Object.entries(taken)){const t=STRAINS[id]?.tier||1;if(t>=2){q+=2*(t-1)*c;pj+=c;}}
 q=Math.min(q,Math.max(0,QUALITY_CAP-w.quality));
 const gain=Math.max(0,Math.min(orderPts+q,WEEK_CAP-w.points));
 w.perBuyer[offerId]=n+1;w.orders++;w.premiumJars+=pj;w.quality+=q;w.points+=gain;return gain;
}

// Which save is "better"? Lifetime sales, then harvests. Used to avoid silently overwriting progress.
// Weekly prizes in the test token, per division and rank. The authoritative copy lives in SQL (hs_week_winners); a live test checks they match.
export const PRIZES=[500,250,100],PRIZE_MULT={garage:1,warehouse:2,empire:4};
export const prizeFor=(division,rank)=>PRIZES[rank-1]?PRIZES[rank-1]*(PRIZE_MULT[division]||1):0;
export const saveRank=(s)=>(s?.sold||0)*1000+(s?.harvests||0);
