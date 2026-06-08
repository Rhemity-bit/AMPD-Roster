import { kv } from '@vercel/kv'

const ROSTER_KEY = 'apd_roster'

const DEFAULT_OFFICERS = [
  {id:1,c:'100',rank:'Commissioner',name:'',discord:'',div:'Command',role:'Commissioned Rank',status:'Vacant',s:0,date:'',notes:''},
  {id:2,c:'101',rank:'Deputy Commissioner',name:'',discord:'',div:'Command',role:'Commissioned Rank',status:'Vacant',s:0,date:'',notes:''},
  {id:3,c:'102',rank:'Assistant Commissioner',name:'',discord:'',div:'Command',role:'Commissioned Rank',status:'Vacant',s:0,date:'',notes:''},
  {id:4,c:'200',rank:'Superintendent',name:'',discord:'',div:'Highway Patrol',role:'HP Commander',status:'Vacant',s:0,date:'',notes:''},
  {id:5,c:'201',rank:'Superintendent',name:'',discord:'',div:'General Duties',role:'GD Commander',status:'Vacant',s:0,date:'',notes:''},
  {id:6,c:'202',rank:'Inspector',name:'',discord:'',div:'General Duties',role:'Inspector',status:'Vacant',s:0,date:'',notes:''},
  {id:7,c:'204',rank:'Inspector',name:'',discord:'',div:'General Duties',role:'Inspector',status:'Vacant',s:0,date:'',notes:''},
  {id:8,c:'210',rank:'Senior Sergeant',name:'',discord:'',div:'General Duties',role:'General Duties 2IC',status:'Vacant',s:0,date:'',notes:''},
  {id:9,c:'211',rank:'Senior Sergeant',name:'',discord:'',div:'Highway Patrol',role:'Highway Patrol 2IC',status:'Vacant',s:0,date:'',notes:''},
  {id:10,c:'212',rank:'Senior Sergeant',name:'',discord:'',div:'Criminal Investigations',role:'CIB 2IC',status:'Vacant',s:0,date:'',notes:''},
  {id:11,c:'213',rank:'Senior Sergeant',name:'',discord:'',div:'Tactical Operations',role:'TOU 2IC',status:'Vacant',s:0,date:'',notes:''},
  {id:12,c:'214',rank:'Sergeant',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:13,c:'215',rank:'Sergeant',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:14,c:'216',rank:'Sergeant',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:15,c:'217',rank:'Sergeant',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:16,c:'218',rank:'Sergeant',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:17,c:'300',rank:'Leading Senior Constable',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:18,c:'301',rank:'Leading Senior Constable',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:19,c:'302',rank:'Leading Senior Constable',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:20,c:'303',rank:'Leading Senior Constable',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:21,c:'304',rank:'Leading Senior Constable',name:'',discord:'',div:'Highway Patrol',role:'Highway Patrol',status:'Vacant',s:0,date:'',notes:''},
  {id:22,c:'500',rank:'Senior Constable',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:23,c:'501',rank:'Senior Constable',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:24,c:'502',rank:'Senior Constable',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:25,c:'700',rank:'Probationary Constable',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:26,c:'701',rank:'Probationary Constable',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
  {id:27,c:'702',rank:'Probationary Constable',name:'',discord:'',div:'General Duties',role:'General Duties',status:'Vacant',s:0,date:'',notes:''},
]

export async function GET() {
  try {
    const data = await kv.get(ROSTER_KEY)
    return Response.json(data || { officers: DEFAULT_OFFICERS, nid: 50 })
  } catch (e) {
    return Response.json({ officers: DEFAULT_OFFICERS, nid: 50 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { officers, nid } = body
    await kv.set(ROSTER_KEY, { officers, nid })
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
