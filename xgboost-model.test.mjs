import assert from 'node:assert/strict';
import {demoRows,leafWeight,splitGain,trainDemo} from './dist/xgboost-model.js';

const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-10,`${actual} differs from ${expected}`);

// Four observations with residuals [-2,-2,+2,+2], g=-residual, h=1.
// A clean split produces leaf corrections -2 and +2 and lowers half-SSE by 8.
close(leafWeight(4,2,0),-2);
close(leafWeight(-4,2,0),2);
close(splitGain(4,2,-4,2,0,0),8);
close(splitGain(4,2,-4,2,2,1),3);
assert.ok(Math.abs(leafWeight(4,2,5))<Math.abs(leafWeight(4,2,0)));
close(leafWeight(0,0,0),0);

const initial=trainDemo({steps:0});
assert.equal(initial.trees.length,0);assert.equal(initial.history.length,1);
assert.deepEqual(initial.predictions,demoRows.map(()=>initial.base));

const first=trainDemo({lambda:1,gamma:0,rate:.3,steps:1}),tree=first.trees[0];
assert.equal(tree.split,true);close(tree.threshold,.5);
assert.equal(tree.leftCount,4);assert.equal(tree.rightCount,4);
close(tree.H,8);close(tree.HL,4);close(tree.HR,4);close(tree.G,0);
close(tree.GL,4.75);close(tree.GR,-4.75);close(tree.gain,4.5125);
// Every point follows a real leaf and receives the shrunken update.
first.predictions.forEach((p,i)=>close(p,first.base+.3*(demoRows[i].x<=tree.threshold?tree.leftWeight:tree.rightWeight)));

const withoutPenalty=trainDemo({lambda:0,rate:1,steps:1});
const withPenalty=trainDemo({lambda:5,rate:1,steps:1});
assert.ok(Math.abs(withPenalty.trees[0].leftWeight)<Math.abs(withoutPenalty.trees[0].leftWeight));

const rejected=trainDemo({lambda:1,gamma:5,rate:.3,steps:1});
assert.equal(rejected.trees[0].split,false);assert.equal(rejected.trees[0].threshold,null);
assert.ok(rejected.trees[0].gain<0);assert.equal(rejected.trees[0].candidateThreshold,.5);
rejected.predictions.forEach(p=>close(p,rejected.base));

const many=trainDemo({lambda:1,gamma:0,rate:.3,steps:20});
assert.equal(many.trees.length,20);assert.equal(many.history.length,21);
assert.ok(many.mse<initial.mse*.05);
for(let i=1;i<many.history.length;i++)assert.ok(many.history[i].mse<=many.history[i-1].mse+1e-12);
assert.deepEqual(many,trainDemo({lambda:1,gamma:0,rate:.3,steps:20}));
assert.deepEqual(trainDemo({rate:0,steps:5}).predictions,initial.predictions);
assert.throws(()=>trainDemo({lambda:-1}),RangeError);
assert.throws(()=>trainDemo({gamma:NaN}),RangeError);
assert.throws(()=>trainDemo({steps:1.5}),RangeError);
assert.throws(()=>trainDemo({rate:1.1}),RangeError);

console.log('PASS: second-order leaf weights, reference gain, L2 shrinkage, split rejection, prediction updates, MSE convergence and deterministic training.');
