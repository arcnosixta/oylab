/**
 * A transparent teaching example of second-order, regularized tree boosting.
 * This is not the XGBoost package. It uses depth-one trees, one numeric feature,
 * all rows on every round, and loss l(y,p) = 0.5 * (p-y)^2.
 * Consequently g = p-y and h = 1; reported MSE omits the factor 0.5.
 * Formula reference: https://xgboost.readthedocs.io/en/stable/tutorials/model.html
 */
export const demoRows = Object.freeze([
 {x:0.08,y:1.2}, {x:0.20,y:1.6}, {x:0.32,y:1.5}, {x:0.44,y:2.0},
 {x:0.56,y:3.6}, {x:0.68,y:4.0}, {x:0.80,y:3.7}, {x:0.92,y:4.5},
].map(Object.freeze));

function nonnegative(value, name) {
 if(!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be a finite nonnegative number`);
}

export function leafWeight(G,H,lambda=1) {
 if(!Number.isFinite(G)) throw new RangeError('G must be finite');
 nonnegative(H,'H');nonnegative(lambda,'lambda');
 if(H+lambda===0) return 0;
 return -G/(H+lambda);
}

export function splitGain(GL,HL,GR,HR,lambda=1,gamma=0) {
 if(!Number.isFinite(GL)||!Number.isFinite(GR)) throw new RangeError('Gradient sums must be finite');
 nonnegative(HL,'HL');nonnegative(HR,'HR');nonnegative(lambda,'lambda');nonnegative(gamma,'gamma');
 const score=(G,H)=>H+lambda===0?0:G*G/(H+lambda);
 return .5*(score(GL,HL)+score(GR,HR)-score(GL+GR,HL+HR))-gamma;
}

const average=values=>values.reduce((sum,value)=>sum+value,0)/values.length;
const meanSquaredError=predictions=>average(predictions.map((p,i)=>(p-demoRows[i].y)**2));

export function trainDemo({lambda=1,gamma=0,rate=.3,steps=1}={}) {
 nonnegative(lambda,'lambda');nonnegative(gamma,'gamma');
 if(!Number.isFinite(rate)||rate<0||rate>1) throw new RangeError('rate must be between 0 and 1');
 if(!Number.isInteger(steps)||steps<0||steps>200) throw new RangeError('steps must be an integer between 0 and 200');
 const base=average(demoRows.map(row=>row.y));
 let predictions=demoRows.map(()=>base);
 const history=[{mse:meanSquaredError(predictions)}],trees=[];
 for(let step=0;step<steps;step++) {
  const gradients=predictions.map((p,i)=>p-demoRows[i].y),G=gradients.reduce((a,b)=>a+b,0),H=demoRows.length;
  let best=null,GL=0;
  for(let leftCount=1;leftCount<demoRows.length;leftCount++) {
   GL+=gradients[leftCount-1];
   const HL=leftCount,GR=G-GL,HR=H-HL;
   const candidate={candidateThreshold:(demoRows[leftCount-1].x+demoRows[leftCount].x)/2,
    leftCount,rightCount:H-leftCount,G,H,GL,HL,GR,HR,
    gain:splitGain(GL,HL,GR,HR,lambda,gamma)};
   if(best===null||candidate.gain>best.gain)best=candidate;
  }
  const split=best.gain>1e-12;
  const rootWeight=leafWeight(G,H,lambda);
  const tree={...best,split,threshold:split?best.candidateThreshold:null,
   leftWeight:split?leafWeight(best.GL,best.HL,lambda):rootWeight,
   rightWeight:split?leafWeight(best.GR,best.HR,lambda):rootWeight};
  trees.push(tree);
  predictions=predictions.map((p,i)=>p+rate*(split&&demoRows[i].x>tree.threshold?tree.rightWeight:tree.leftWeight));
  history.push({mse:meanSquaredError(predictions)});
 }
 return {base,predictions,history,trees,mse:history.at(-1).mse};
}
