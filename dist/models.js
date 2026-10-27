export const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
export const gini=a=>{if(!a.length)return 0;const p=mean(a);return 1-p*p-(1-p)*(1-p)};
export const mse=(a,b)=>mean(a.map((v,i)=>(v-b[i])**2));
export function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
export function fit(rows,depth=3,{regression=false,random=null}={}){
 const ys=rows.map(r=>r.y),value=regression?mean(ys):+(mean(ys)>=.5),impurity=regression?mse(ys,ys.map(()=>mean(ys))):gini(ys);
 const node={value,n:rows.length,impurity,prob:mean(ys)};
 if(depth===0||rows.length<3||impurity<1e-10)return node;
 let best=null,features=rows[0].x.map((_,i)=>i);if(random)features=[Math.floor(random()*features.length)];
 for(const f of features){const values=[...new Set(rows.map(r=>r.x[f]))].sort((a,b)=>a-b);
  for(let i=0;i<values.length-1;i++){const threshold=(values[i]+values[i+1])/2,left=rows.filter(r=>r.x[f]<=threshold),right=rows.filter(r=>r.x[f]>threshold);
   const loss=part=>{const y=part.map(r=>r.y);return regression?mse(y,y.map(()=>mean(y))):gini(y)};
   const score=(left.length*loss(left)+right.length*loss(right))/rows.length;
   if(!best||score<best.score)best={f,threshold,left,right,score};
  }
 }
 if(!best||best.score>=impurity-1e-10)return node;
 return {...node,f:best.f,threshold:best.threshold,left:fit(best.left,depth-1,{regression,random}),right:fit(best.right,depth-1,{regression,random})};
}
export function predict(tree,x){return tree.left?predict(x[tree.f]<=tree.threshold?tree.left:tree.right,x):tree.value}
export function pathOf(tree,x){const path=[];let n=tree;while(n){path.push(n);n=n.left?(x[n.f]<=n.threshold?n.left:n.right):null}return path}
export function forest(rows,count=9,seed=42,depth=4){const random=rng(seed);return Array.from({length:count},()=>{const indices=rows.map(()=>Math.floor(random()*rows.length));return{tree:fit(indices.map(i=>rows[i]),depth,{random}),indices}})}
export function forestPredict(trees,x){return +(mean(trees.map(t=>predict(t.tree,x)))>=.5)}
export function makeData(n=40,seed=25){const r=rng(seed);return Array.from({length:n},()=>{const x=r(),y=r();return{x:[x,y],y:+(y>.46+.21*Math.sin(x*8)),id:0}}).map((v,i)=>({...v,id:i+1}))}
export function regressionData(n=24,seed=55){const r=rng(seed);return Array.from({length:n},(_,i)=>{const x=(i+.2+r()*.6)/n;return{x:[x],y:2+2.8*x+1.3*Math.sin(x*7)+(r()-.5)*1.0}})}
export function boosting(train,validation,steps=10,rate=.2){const base=mean(train.map(r=>r.y)),trees=[],history=[];let pred=train.map(()=>base),valid=validation.map(()=>base);
 history.push({train:mse(train.map(r=>r.y),pred),validation:mse(validation.map(r=>r.y),valid)});
 for(let i=0;i<steps;i++){const residuals=train.map((r,j)=>({...r,y:r.y-pred[j]}));const tree=fit(residuals,2,{regression:true});trees.push(tree);pred=pred.map((p,j)=>p+rate*predict(tree,train[j].x));valid=valid.map((p,j)=>p+rate*predict(tree,validation[j].x));history.push({train:mse(train.map(r=>r.y),pred),validation:mse(validation.map(r=>r.y),valid)})}
 return{base,trees,history,predict:x=>base+rate*trees.reduce((s,t)=>s+predict(t,x),0),pred};
}
