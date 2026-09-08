import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import assert from 'node:assert/strict'
assert.equal(process.env.A1_BROWSER_LAB,'yes')
const app=join(process.env.A1_LAB_ROOT,'app-runtime')
const css=join(app,'app/globals.css')
// No external fonts in the lab; all application style rules are preserved.
writeFileSync(css,readFileSync(css,'utf8').split('\n').filter(line=>!line.startsWith("@import url('https://fonts.googleapis.com/")).join('\n'))
const layout=join(app,'app/layout.tsx')
writeFileSync(layout,readFileSync(layout,'utf8').replace("import './globals.css'", "import './globals.css'\nexport const metadata={title:'QA sintético A1–A4 | Laboratorio DTC',robots:{index:false,follow:false}}"))
const route=join(app,'app/despega/recorrido')
mkdirSync(route,{recursive:true})
writeFileSync(join(route,'page.tsx'),`import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import {loadJourneyFlow} from '@/lib/journey/flow-service'
import {JourneyFlowPanel} from '@/components/journey/journey-flow-panel'
export const dynamic='force-dynamic'
export default async function Page(){const s=await createClient();const {data:{user},error}=await s.auth.getUser();if(error||!user)redirect('/login');
// LAB ONLY: admission/current-stage fixture; source loader and components remain the actual implementations.
const journey={user,profile:{onboarding_conozcamonos_1_completed:true,a1_cerebral_intro_seen:true,a1_cerebral_completed:true,conozcamonos_2_completed:true,a1_report_seen:true,a2_intro_seen:true},access:{a1:true,a2:true,a3:true,a4:false},state:{currentModule:'A2',highestA2DayUnlocked:7}};
return <JourneyFlowPanel flow={await loadJourneyFlow(journey)}/>}
`)
