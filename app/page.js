'use client'
import { useState, useEffect, useCallback } from 'react'

const DIVS = [
  { id: 'Command', label: 'COMMAND', pip: '#C9A84C' },
  { id: 'General Duties', label: 'GENERAL DUTIES', pip: '#3D8FFF' },
  { id: 'Highway Patrol', label: 'HIGHWAY PATROL', pip: '#E8A020' },
  { id: 'Criminal Investigations', label: 'CRIMINAL INVESTIGATIONS BRANCH', pip: '#7C4DFF' },
  { id: 'Tactical Operations', label: 'TACTICAL OPERATIONS UNIT', pip: '#E53535' },
  { id: 'Honorary', label: 'HONORARY OFFICERS', pip: '#00BFA5' },
  { id: 'AFP / Server Management', label: 'AFP / SERVER MANAGEMENT', pip: '#8A9BB8' },
]

const RANKS = [
  'Commissioner','Deputy Commissioner','Assistant Commissioner',
  'Superintendent','Inspector','Senior Sergeant','Sergeant',
  'Leading Senior Constable','Senior Constable','Constable','Probationary Constable'
]

const EMPTY_FORM = {
  c: '', rank: 'Constable', name: '', discord: '',
  div: 'General Duties', role: '', status: 'Vacant', s: 0, date: '', notes: ''
}

function StatusBadge({ status }) {
  const styles = {
    Active:    { bg: 'rgba(29,185,84,0.12)',   color: '#1DB954', border: 'rgba(29,185,84,0.25)',    pulse: true },
    Vacant:    { bg: 'rgba(138,155,184,0.1)',  color: '#8A9BB8', border: 'rgba(138,155,184,0.2)',   pulse: false },
    Suspended: { bg: 'rgba(229,53,53,0.12)',   color: '#E53535', border: 'rgba(229,53,53,0.25)',    pulse: true },
    LOA:       { bg: 'rgba(232,160,32,0.12)',  color: '#E8A020', border: 'rgba(232,160,32,0.25)',   pulse: false },
  }
  const st = styles[status] || styles.Vacant
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 9px', borderRadius: 20, fontSize: 10, fontWeight: 600,
      letterSpacing: 0.5, textTransform: 'uppercase',
      background: st.bg, color: st.color, border: `1px solid ${st.border}`
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%', background: st.color, flexShrink: 0,
        animation: st.pulse ? (status === 'Suspended' ? 'pulse 1s infinite' : 'pulse 2s infinite') : 'none'
      }} />
      {status}
    </span>
  )
}

function StrikeDots({ count }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 9, height: 9, borderRadius: '50%',
          background: i < count ? '#E53535' : 'rgba(255,255,255,0.07)',
          border: `1px solid ${i < count ? '#B02020' : 'rgba(255,255,255,0.12)'}`,
          boxShadow: i < count ? '0 0 4px rgba(229,53,53,0.5)' : 'none'
        }} />
      ))}
    </div>
  )
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: 'block', color: '#4A5A78', fontSize: 10, letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase', fontWeight: 600, fontFamily: 'Rajdhani, sans-serif' }}>{label}</label>
      <input {...props} style={{
        width: '100%', background: '#1A2235', border: '1px solid rgba(30,111,217,0.18)',
        borderRadius: 6, padding: '7px 10px', color: '#E8EDF5', fontSize: 12,
        fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
        ...props.style
      }} onFocus={e => e.target.style.borderColor = '#1E6FD9'}
         onBlur={e => e.target.style.borderColor = 'rgba(30,111,217,0.18)'}
      />
    </div>
  )
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: 'block', color: '#4A5A78', fontSize: 10, letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase', fontWeight: 600, fontFamily: 'Rajdhani, sans-serif' }}>{label}</label>
      <select {...props} style={{
        width: '100%', background: '#1A2235', border: '1px solid rgba(30,111,217,0.18)',
        borderRadius: 6, padding: '7px 10px', color: '#E8EDF5', fontSize: 12,
        fontFamily: 'Inter, sans-serif', outline: 'none', cursor: 'pointer', boxSizing: 'border-box'
      }}>{children}</select>
    </div>
  )
}

export default function Roster() {
  const [officers, setOfficers] = useState([])
  const [nid, setNid] = useState(50)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginPw, setLoginPw] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [collapsed, setCollapsed] = useState({})
  const [fSearch, setFSearch] = useState('')
  const [fStatus, setFStatus] = useState('')
  const [fDiv, setFDiv] = useState('')

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  // Load roster from API
  useEffect(() => {
    fetch('/api/roster')
      .then(r => r.json())
      .then(data => { setOfficers(data.officers); setNid(data.nid); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const persist = useCallback(async (newOfficers, newNid) => {
    setSaving(true)
    try {
      await fetch('/api/roster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officers: newOfficers, nid: newNid })
      })
      showToast('Roster saved')
    } catch {
      showToast('Save failed', 'error')
    }
    setSaving(false)
  }, [])

  const handleLogin = async () => {
    setLoginLoading(true)
    setLoginErr('')
    try {
      const r = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPw })
      })
      if (r.ok) {
        setIsAdmin(true)
        setShowLogin(false)
        setLoginPw('')
        showToast('Admin access granted')
      } else {
        setLoginErr('Incorrect password')
      }
    } catch {
      setLoginErr('Connection error')
    }
    setLoginLoading(false)
  }

  const openModal = (officer = null) => {
    if (!isAdmin) { setShowLogin(true); return }
    if (officer) {
      setEditId(officer.id)
      setForm({ c: officer.c, rank: officer.rank, name: officer.name, discord: officer.discord, div: officer.div, role: officer.role, status: officer.status, s: officer.s, date: officer.date, notes: officer.notes })
    } else {
      setEditId(null)
      setForm(EMPTY_FORM)
    }
    setModal(true)
  }

  const saveOfficer = async () => {
    const o = { ...form, id: editId || nid, s: Math.min(3, Math.max(0, parseInt(form.s) || 0)) }
    let newOfficers, newNid = nid
    if (editId) {
      newOfficers = officers.map(x => x.id === editId ? o : x)
    } else {
      newNid = nid + 1
      setNid(newNid)
      newOfficers = [...officers, o]
    }
    setOfficers(newOfficers)
    setModal(false)
    await persist(newOfficers, newNid)
  }

  const deleteOfficer = async () => {
    if (!confirm('Remove this officer from the roster?')) return
    const newOfficers = officers.filter(x => x.id !== editId)
    setOfficers(newOfficers)
    setModal(false)
    await persist(newOfficers, nid)
  }

  const filtered = officers.filter(o => {
    if (fStatus && o.status !== fStatus) return false
    if (fDiv && o.div !== fDiv) return false
    if (fSearch) {
      const q = fSearch.toLowerCase()
      if (!((o.name||'').toLowerCase().includes(q) || (o.c||'').includes(q) || (o.rank||'').toLowerCase().includes(q) || (o.discord||'').toLowerCase().includes(q))) return false
    }
    return true
  })

  const byDiv = {}
  DIVS.forEach(d => byDiv[d.id] = [])
  filtered.forEach(o => { if (byDiv[o.div] !== undefined) byDiv[o.div].push(o); else byDiv['General Duties'].push(o) })

  const active = officers.filter(o => o.status === 'Active').length
  const vacant = officers.filter(o => o.status === 'Vacant').length
  const loa = officers.filter(o => o.status === 'LOA').length
  const sus = officers.filter(o => o.status === 'Suspended').length
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })

  const inputStyle = {
    background: '#1A2235', border: '1px solid rgba(30,111,217,0.18)', borderRadius: 6,
    padding: '7px 10px', color: '#E8EDF5', fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none'
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Rajdhani:wght@500;600;700&display=swap');
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanline { 0%{top:-4px} 100%{top:100%} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes rowIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        @keyframes modalPop { from{opacity:0;transform:scale(0.95) translateY(-10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #080C14; }
        select option { background: #111827; color: #E8EDF5; }
        tr.data-row:hover td { background: rgba(30,111,217,0.1) !important; }
        input:focus { border-color: #1E6FD9 !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0D1220; }
        ::-webkit-scrollbar-thumb { background: #1A2235; border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#080C14', padding: '20px 16px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(30,111,217,0.32)', animation: 'fadeIn 0.4s ease' }}>

          {/* HEADER */}
          <div style={{ background: '#0D1220', borderBottom: '1px solid rgba(30,111,217,0.32)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(30,111,217,0.4),transparent)', animation: 'scanline 3s linear infinite', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px' }}>
              <img src="https://i.ibb.co/4nKtx7NH/6708cb14-2548-4f3b-81d0-59018063e445-Photoroom.png"
                alt="APD Badge" crossOrigin="anonymous"
                style={{ width: 68, height: 68, objectFit: 'contain', borderRadius: '50%', border: '2px solid #7A5C1A', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: 'Rajdhani, sans-serif', color: '#E8EDF5', fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', lineHeight: 1 }}>Aftermath Police Force</h1>
                <p style={{ color: '#C9A84C', fontSize: 10, letterSpacing: 2.5, marginTop: 4, textTransform: 'uppercase', fontWeight: 500 }}>City of Aftermath — Official Personnel Roster</p>
                <small style={{ color: '#4A5A78', fontSize: 10, letterSpacing: 1, display: 'block', marginTop: 2 }}>Last updated: {dateStr}</small>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {isAdmin ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(29,185,84,0.1)', border: '1px solid rgba(29,185,84,0.3)', borderRadius: 6, padding: '6px 12px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1DB954', animation: 'pulse 2s infinite' }} />
                    <span style={{ color: '#1DB954', fontSize: 11, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 1 }}>ADMIN</span>
                    <button onClick={() => setIsAdmin(false)} style={{ background: 'none', border: 'none', color: '#4A5A78', cursor: 'pointer', fontSize: 12, marginLeft: 4, fontFamily: 'Rajdhani, sans-serif' }}>✕</button>
                  </div>
                ) : (
                  <button onClick={() => setShowLogin(true)} style={{ background: 'rgba(30,111,217,0.15)', border: '1px solid rgba(30,111,217,0.32)', borderRadius: 6, padding: '6px 14px', color: '#8A9BB8', fontSize: 11, fontFamily: 'Rajdhani, sans-serif', cursor: 'pointer', letterSpacing: 1, fontWeight: 700 }}>
                    🔒 ADMIN LOGIN
                  </button>
                )}
              </div>
            </div>
            {/* Stats bar */}
            <div style={{ display: 'flex', borderTop: '1px solid rgba(30,111,217,0.18)' }}>
              {[['Active', active, '#1DB954'], ['Vacant', vacant, '#8A9BB8'], ['LOA', loa, '#E8A020'], ['Suspended', sus, '#E53535'], ['Total', officers.length, '#3D8FFF']].map(([label, val, color]) => (
                <div key={label} style={{ flex: 1, padding: '10px 14px', textAlign: 'center', borderRight: '1px solid rgba(30,111,217,0.18)' }}>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 3, color: '#4A5A78' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTROLS */}
          <div style={{ background: '#111827', padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', borderBottom: '1px solid rgba(30,111,217,0.18)' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 140 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#4A5A78', fontSize: 14 }}>🔍</span>
              <input value={fSearch} onChange={e => setFSearch(e.target.value)} placeholder="Search name, call sign, rank, Discord..."
                style={{ ...inputStyle, width: '100%', paddingLeft: 30 }} />
            </div>
            <select value={fStatus} onChange={e => setFStatus(e.target.value)} style={inputStyle}>
              <option value="">All Statuses</option>
              {['Active','Vacant','LOA','Suspended'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={fDiv} onChange={e => setFDiv(e.target.value)} style={inputStyle}>
              <option value="">All Divisions</option>
              {DIVS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
            {isAdmin && (
              <button onClick={() => openModal()} style={{ background: '#1E6FD9', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 11, fontFamily: 'Rajdhani, sans-serif', cursor: 'pointer', letterSpacing: 1, fontWeight: 700, textTransform: 'uppercase' }}>
                + Add Officer
              </button>
            )}
            {saving && <span style={{ color: '#4A5A78', fontSize: 10, letterSpacing: 1 }}>Saving...</span>}
          </div>

          {/* ROSTER BODY */}
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#4A5A78', fontFamily: 'Rajdhani, sans-serif', letterSpacing: 2 }}>LOADING ROSTER...</div>
          ) : (
            DIVS.map(div => {
              const rows = byDiv[div.id] || []
              if (!rows.length && fSearch) return null
              const ac = rows.filter(r => r.status === 'Active').length
              const isCollapsed = collapsed[div.id]
              return (
                <div key={div.id} style={{ borderBottom: '1px solid rgba(30,111,217,0.18)' }}>
                  <div onClick={() => setCollapsed(c => ({ ...c, [div.id]: !c[div.id] }))}
                    style={{ background: '#111827', borderLeft: `3px solid ${isCollapsed ? '#4A5A78' : div.pip}`, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1A2235'}
                    onMouseLeave={e => e.currentTarget.style.background = '#111827'}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: div.pip, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', color: '#E8EDF5', fontSize: 12, letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase', flex: 1 }}>{div.label}</span>
                    <span style={{ color: '#4A5A78', fontSize: 10 }}>{ac} ACTIVE / {rows.length} SLOTS</span>
                    <span style={{ color: '#4A5A78', fontSize: 12, transition: 'transform 0.25s', display: 'inline-block', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
                  </div>
                  {!isCollapsed && (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr>
                            {['Call Sign','Rank','Name','Role','Status','Discord','Strikes','Promoted',''].map((h,i) => (
                              <th key={i} style={{ background: '#0D1220', color: '#4A5A78', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(30,111,217,0.32)', fontWeight: 600, fontFamily: 'Rajdhani, sans-serif', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {!rows.length ? (
                            <tr><td colSpan={9} style={{ padding: 18, textAlign: 'center', color: '#4A5A78', fontStyle: 'italic', fontSize: 12 }}>No officers assigned to this division</td></tr>
                          ) : rows.map((o, i) => (
                            <tr key={o.id} className="data-row" onClick={() => isAdmin && openModal(o)}
                              style={{ borderBottom: '1px solid rgba(30,111,217,0.07)', cursor: isAdmin ? 'pointer' : 'default', animation: `rowIn 0.25s ease ${i * 0.03}s both`, background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                              <td style={{ padding: '9px 12px', fontFamily: 'Rajdhani, sans-serif', color: '#C9A84C', fontWeight: 700, fontSize: 14 }}>{o.c}</td>
                              <td style={{ padding: '9px 12px', fontWeight: 600, color: '#E8EDF5' }}>{o.rank}</td>
                              <td style={{ padding: '9px 12px', color: '#A8C0E0' }}>{o.name || <span style={{ color: '#2A3A55', fontStyle: 'italic' }}>Vacant</span>}</td>
                              <td style={{ padding: '9px 12px', color: '#8A9BB8', fontSize: 11 }}>
                                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: div.pip, marginRight: 6, verticalAlign: 'middle' }} />
                                {o.role}
                              </td>
                              <td style={{ padding: '9px 12px' }}><StatusBadge status={o.status} /></td>
                              <td style={{ padding: '9px 12px', color: '#4A5A78', fontSize: 11 }}>{o.discord || '—'}</td>
                              <td style={{ padding: '9px 12px' }}><StrikeDots count={o.s} /></td>
                              <td style={{ padding: '9px 12px', color: '#4A5A78', fontSize: 11 }}>{o.date || '—'}</td>
                              <td style={{ padding: '9px 12px', width: 38 }}>
                                {isAdmin && (
                                  <button onClick={e => { e.stopPropagation(); openModal(o) }}
                                    style={{ background: 'none', border: 'none', color: '#4A5A78', cursor: 'pointer', fontSize: 14, padding: '3px 6px', borderRadius: 4 }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#3D8FFF'; e.currentTarget.style.background = 'rgba(30,111,217,0.15)' }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#4A5A78'; e.currentTarget.style.background = 'none' }}>✎</button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })
          )}

          {/* FOOTER */}
          <div style={{ background: '#0D1220', padding: '8px 20px', display: 'flex', gap: 16, fontSize: 10, color: '#4A5A78', letterSpacing: 1, alignItems: 'center', borderTop: '1px solid rgba(30,111,217,0.18)', flexWrap: 'wrap' }}>
            <span>👥 {officers.length} total</span>
            <span>✓ {active} active</span>
            <span>○ {vacant} vacant</span>
            {isAdmin && <span style={{ color: '#1DB954' }}>● Auto-saving to Vercel KV</span>}
            <span style={{ marginLeft: 'auto', color: '#7A5C1A', fontFamily: 'Rajdhani, sans-serif', fontSize: 11, letterSpacing: 1.5, fontWeight: 600 }}>CULPAM POENA PREMIT COMES</span>
          </div>
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,8,20,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowLogin(false) }}>
          <div style={{ background: '#111827', border: '1px solid rgba(30,111,217,0.32)', borderRadius: 10, width: 340, overflow: 'hidden', animation: 'modalPop 0.22s ease' }}>
            <div style={{ background: '#0D1220', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(30,111,217,0.18)' }}>
              <span style={{ color: '#C9A84C', fontSize: 16 }}>🛡</span>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', color: '#E8EDF5', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, flex: 1 }}>Admin Authentication</h2>
              <button onClick={() => setShowLogin(false)} style={{ background: 'none', border: 'none', color: '#4A5A78', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: 18 }}>
              <p style={{ color: '#8A9BB8', fontSize: 12, marginBottom: 14 }}>Enter the admin password to enable editing.</p>
              <Input label="Password" type="password" value={loginPw}
                onChange={e => setLoginPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••" />
              {loginErr && <p style={{ color: '#E53535', fontSize: 11, marginTop: -6, marginBottom: 8 }}>{loginErr}</p>}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 18px', borderTop: '1px solid rgba(30,111,217,0.18)', background: '#0D1220' }}>
              <button onClick={() => setShowLogin(false)} style={{ background: 'transparent', color: '#8A9BB8', border: '1px solid rgba(30,111,217,0.18)', borderRadius: 6, padding: '7px 14px', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase' }}>Cancel</button>
              <button onClick={handleLogin} disabled={loginLoading} style={{ background: '#1E6FD9', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                {loginLoading ? 'Checking...' : 'Authenticate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD MODAL */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,8,20,0.85)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 40 }}
          onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div style={{ background: '#111827', border: '1px solid rgba(30,111,217,0.32)', borderRadius: 10, width: 480, maxWidth: '95vw', overflow: 'hidden', animation: 'modalPop 0.22s ease', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ background: '#0D1220', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(30,111,217,0.18)', position: 'sticky', top: 0, zIndex: 1 }}>
              <span style={{ color: '#C9A84C', fontSize: 16 }}>🛡</span>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', color: '#E8EDF5', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, flex: 1 }}>{editId ? 'Edit Officer' : 'Add Officer'}</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: '#4A5A78', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input label="Call Sign" value={form.c} onChange={e => setForm(f => ({ ...f, c: e.target.value }))} placeholder="e.g. 210" />
                <Select label="Rank" value={form.rank} onChange={e => setForm(f => ({ ...f, rank: e.target.value }))}>
                  {RANKS.map(r => <option key={r}>{r}</option>)}
                </Select>
                <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" />
                <Input label="Discord ID" value={form.discord} onChange={e => setForm(f => ({ ...f, discord: e.target.value }))} placeholder="user#0000" />
                <Select label="Division" value={form.div} onChange={e => setForm(f => ({ ...f, div: e.target.value }))}>
                  {DIVS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </Select>
                <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {['Vacant','Active','LOA','Suspended'].map(s => <option key={s}>{s}</option>)}
                </Select>
                <Input label="Strikes (0–3)" type="number" min="0" max="3" value={form.s} onChange={e => setForm(f => ({ ...f, s: e.target.value }))} />
                <Input label="Date Promoted" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <Input label="Role / Specialty" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. General Duties 2IC" />
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', color: '#4A5A78', fontSize: 10, letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase', fontWeight: 600, fontFamily: 'Rajdhani, sans-serif' }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional notes..."
                  style={{ width: '100%', background: '#1A2235', border: '1px solid rgba(30,111,217,0.18)', borderRadius: 6, padding: '7px 10px', color: '#E8EDF5', fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none', resize: 'vertical', minHeight: 54, boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center', padding: '12px 18px', borderTop: '1px solid rgba(30,111,217,0.18)', background: '#0D1220', position: 'sticky', bottom: 0 }}>
              {editId && <button onClick={deleteOfficer} style={{ background: 'transparent', color: '#E53535', border: '1px solid rgba(229,53,53,0.3)', borderRadius: 6, padding: '7px 12px', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', marginRight: 'auto' }}>Remove</button>}
              <button onClick={() => setModal(false)} style={{ background: 'transparent', color: '#8A9BB8', border: '1px solid rgba(30,111,217,0.18)', borderRadius: 6, padding: '7px 14px', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase' }}>Cancel</button>
              <button onClick={saveOfficer} style={{ background: '#1E6FD9', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontFamily: 'Rajdhani, sans-serif', fontSize: 12, cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 18, right: 18, zIndex: 200,
          background: '#111827', border: `1px solid ${toast.type === 'error' ? '#E53535' : '#1DB954'}`,
          borderRadius: 8, padding: '8px 16px',
          color: toast.type === 'error' ? '#E53535' : '#1DB954',
          fontSize: 11, fontFamily: 'Rajdhani, sans-serif', letterSpacing: 1, fontWeight: 700, textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 6, animation: 'toastIn 0.25s ease'
        }}>
          {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
        </div>
      )}
    </>
  )
}
