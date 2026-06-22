// Theme tokens for the lessons module — mirrors AppDemo's palette so the lesson
// screens feel native to the app. `dark` is passed down as a prop (no shared
// context) to keep integration with the existing app low-risk.

import type { Difficulty } from './types'

export const N = '#0A1F44'   // navy
export const O = '#fd761a'   // orange

// Game-feedback semantic colors
export const GREEN = '#16a34a'
export const AMBER = '#d97706'
export const RED   = '#dc2626'

export interface T {
  BG: string; W: string; MT: string; ST: string; GT: string; CA: string
  ACTX: string; ACBG: string; SH: string; SHD: string; LINE: string
}

export function makeT(dark: boolean): T {
  return {
    BG:   dark ? '#1c1e24' : '#f7f9fb',
    W:    dark ? '#272932' : '#ffffff',
    MT:   dark ? '#eef0f5' : '#191c1e',
    ST:   dark ? '#c2c7d6' : '#44464e',
    GT:   dark ? '#9aa0b4' : '#75777f',
    CA:   dark ? '#464b5d' : '#eceef0',
    ACTX: dark ? '#b4c6f4' : N,
    ACBG: dark ? 'rgba(180,198,244,0.15)' : '#d9e2ff',
    SH:   dark ? '0 4px 16px rgba(0,0,0,0.4)'  : '0 4px 16px rgba(0,0,0,0.06)',
    SHD:  dark ? '0 12px 28px rgba(0,0,0,0.55)' : '0 12px 24px rgba(10,31,68,0.18)',
    LINE: dark ? '#3a3d47' : '#e6e8ea',
  }
}

export function diffColor(d: Difficulty | string) {
  return d === 'beginner'     ? { bg: 'rgba(22,163,74,0.12)', fg: GREEN, label: 'Beginner' }
       : d === 'intermediate' ? { bg: 'rgba(217,119,6,0.12)', fg: AMBER, label: 'Intermediate' }
       :                        { bg: 'rgba(220,38,38,0.12)', fg: RED,   label: 'Advanced' }
}
