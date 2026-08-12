import type { FollowUpData, FollowUpPlan, FollowUpQuestion, FollowUpTask, FollowUpVisit } from '@/types/followUp'
export const FOLLOW_UP_KEY='lentera.follow-up.v1'
const empty:FollowUpData={plans:[],tasks:[],visits:[],questions:[]}
const read=():FollowUpData=>{try{return {...empty,...JSON.parse(localStorage.getItem(FOLLOW_UP_KEY)||'{}')} }catch{return empty}}
const write=(data:FollowUpData)=>{localStorage.setItem(FOLLOW_UP_KEY,JSON.stringify(data));window.dispatchEvent(new CustomEvent('lentera-follow-up-change',{detail:data}))}
export const followUpRepository={
 read, subscribe(listener:(data:FollowUpData)=>void){const fn=(event:Event)=>listener((event as CustomEvent<FollowUpData>).detail??read());window.addEventListener('lentera-follow-up-change',fn);return()=>window.removeEventListener('lentera-follow-up-change',fn)},
 savePlan(plan:FollowUpPlan){const d=read();d.plans=d.plans.some(x=>x.id===plan.id)?d.plans.map(x=>x.id===plan.id?plan:x):[plan,...d.plans];write(d)},
 deletePlan(id:string){const d=read();d.plans=d.plans.filter(x=>x.id!==id);d.tasks=d.tasks.filter(x=>x.planId!==id);d.visits=d.visits.filter(x=>x.planId!==id);d.questions=d.questions.filter(x=>x.planId!==id);write(d)},
 saveTask(task:FollowUpTask){const d=read();d.tasks=d.tasks.some(x=>x.id===task.id)?d.tasks.map(x=>x.id===task.id?task:x):[task,...d.tasks];write(d)},
 deleteTask(id:string){const d=read();d.tasks=d.tasks.filter(x=>x.id!==id);write(d)},
 saveVisit(visit:FollowUpVisit){const d=read();d.visits=d.visits.some(x=>x.id===visit.id)?d.visits.map(x=>x.id===visit.id?visit:x):[visit,...d.visits];write(d)},
 saveQuestion(question:FollowUpQuestion){const d=read();d.questions=d.questions.some(x=>x.id===question.id)?d.questions.map(x=>x.id===question.id?question:x):[question,...d.questions];write(d)},
 deleteQuestion(id:string){const d=read();d.questions=d.questions.filter(x=>x.id!==id);write(d)}
}
