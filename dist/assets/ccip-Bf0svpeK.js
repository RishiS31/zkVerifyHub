import{B as l,g as m,s as y,d as k,i as b,c as O,a as E,e as L,H as h,b as x}from"./index-CO2Ot1Eu.js";class M extends l{constructor({callbackSelector:r,cause:a,data:o,extraData:i,sender:d,urls:t}){var n;super(a.shortMessage||"An error occurred while fetching for an offchain result.",{cause:a,metaMessages:[...a.metaMessages||[],(n=a.metaMessages)!=null&&n.length?"":[],"Offchain Gateway Call:",t&&["  Gateway URL(s):",...t.map(f=>`    ${m(f)}`)],`  Sender: ${d}`,`  Data: ${o}`,`  Callback selector: ${r}`,`  Extra data: ${i}`].flat(),name:"OffchainLookupError"})}}class R extends l{constructor({result:r,url:a}){super("Offchain gateway response is malformed. Response data must be a hex value.",{metaMessages:[`Gateway URL: ${m(a)}`,`Response: ${y(r)}`],name:"OffchainLookupResponseMalformedError"})}}class S extends l{constructor({sender:r,to:a}){super("Reverted sender address does not match target contract address (`to`).",{metaMessages:[`Contract address: ${a}`,`OffchainLookup sender address: ${r}`],name:"OffchainLookupSenderMismatchError"})}}const A="0x556f1830",$={name:"OffchainLookup",type:"error",inputs:[{name:"sender",type:"address"},{name:"urls",type:"string[]"},{name:"callData",type:"bytes"},{name:"callbackFunction",type:"bytes4"},{name:"extraData",type:"bytes"}]};async function C(c,{blockNumber:r,blockTag:a,data:o,to:i}){const{args:d}=k({data:o,abi:[$]}),[t,n,f,u,s]=d,{ccipRead:e}=c,g=e&&typeof(e==null?void 0:e.request)=="function"?e.request:T;try{if(!b(i,t))throw new S({sender:t,to:i});const p=await g({data:f,sender:t,urls:n}),{data:w}=await O(c,{blockNumber:r,blockTag:a,data:E([u,L([{type:"bytes"},{type:"bytes"}],[p,s])]),to:i});return w}catch(p){throw new M({callbackSelector:u,cause:p,data:o,extraData:s,sender:t,urls:n})}}async function T({data:c,sender:r,urls:a}){var i;let o=new Error("An unknown error occurred.");for(let d=0;d<a.length;d++){const t=a[d],n=t.includes("{data}")?"GET":"POST",f=n==="POST"?{data:c,sender:r}:void 0,u=n==="POST"?{"Content-Type":"application/json"}:{};try{const s=await fetch(t.replace("{sender}",r).replace("{data}",c),{body:JSON.stringify(f),headers:u,method:n});let e;if((i=s.headers.get("Content-Type"))!=null&&i.startsWith("application/json")?e=(await s.json()).data:e=await s.text(),!s.ok){o=new h({body:f,details:e!=null&&e.error?y(e.error):s.statusText,headers:s.headers,status:s.status,url:t});continue}if(!x(e)){o=new R({result:e,url:t});continue}return e}catch(s){o=new h({body:f,details:s.message,url:t})}}throw o}export{T as ccipRequest,C as offchainLookup,$ as offchainLookupAbiItem,A as offchainLookupSignature};
