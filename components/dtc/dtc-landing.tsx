'use client'

import React from 'react'
import { ConstellationBg, COLORS } from './theme'
import DtcNavbar from './navbar'
import DtcHero from './hero'
import PerfilVivo from './perfil-vivo'
import Narrative from './narrative'
import CanonicalJourney from './journey-canonical'
import Comparison from './comparison'
import VeraCv from './vera-cv'
import Audience from './audience'
import CanonicalClosing from './closing-canonical'

export default function DtcLanding() {
  return (
    <div className="dtc-landing-root relative min-h-screen font-sans" style={{ color: COLORS.text }}>
      <style>{`main:has(.dtc-landing-root) ~ footer { display: none !important; }`}</style>
      <ConstellationBg />
      <DtcNavbar />
      <main className="relative z-10">
        <DtcHero />
        <PerfilVivo />
        <Narrative />
        <CanonicalJourney />
        <Comparison />
        <VeraCv />
        <Audience />
        <CanonicalClosing />
      </main>
    </div>
  )
}
