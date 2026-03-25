import path from 'path'
import fs from 'fs'
import os from 'os'

// Config directory
const CONFIG_DIR = path.join(os.homedir(), '.codeskills')
const DB_PATH = path.join(CONFIG_DIR, 'skills.json')
const SKILLS_DIR = path.join(CONFIG_DIR, 'skills')

// Ensure config directory exists
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true })
  }
  if (!fs.existsSync(SKILLS_DIR)) {
    fs.mkdirSync(SKILLS_DIR, { recursive: true })
  }
}

// Data structure
interface DataStore {
  skills: Skill[]
  groups: Group[]
  groupSkills: { groupId: string; skillId: string; addedAt: string }[]
  activeGroups: { groupId: string; activatedAt: string }[]
  settings: { key: string; value: string }[]
}

let data: DataStore = {
  skills: [],
  groups: [],
  groupSkills: [],
  activeGroups: [],
  settings: []
}

function loadDb() {
  ensureConfigDir()
  if (fs.existsSync(DB_PATH)) {
    try {
      const content = fs.readFileSync(DB_PATH, 'utf-8')
      data = JSON.parse(content)
    } catch (e) {
      console.error('Failed to load database, creating new one')
      data = { skills: [], groups: [], groupSkills: [], activeGroups: [], settings: [] }
    }
  }
  saveDb()
}

function saveDb() {
  ensureConfigDir()
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

// Initialize on import
loadDb()

// Skill operations
export interface Skill {
  id: string
  name: string
  description: string | null
  tags: string | null
  source: string | null
  source_url: string | null
  installed_at: string
  updated_at: string
}

export function installSkill(skill: Omit<Skill, 'installed_at' | 'updated_at'>) {
  const now = new Date().toISOString()
  const existing = data.skills.findIndex(s => s.id === skill.id)
  if (existing >= 0) {
    data.skills[existing] = { ...data.skills[existing], ...skill, updated_at: now }
  } else {
    data.skills.push({ ...skill, installed_at: now, updated_at: now })
  }
  saveDb()
}

export function getSkill(id: string): Skill | undefined {
  return data.skills.find(s => s.id === id)
}

export function getAllSkills(): Skill[] {
  return [...data.skills].sort((a, b) => a.name.localeCompare(b.name))
}

export function removeSkill(id: string) {
  data.skills = data.skills.filter(s => s.id !== id)
  data.groupSkills = data.groupSkills.filter(gs => gs.skillId !== id)
  saveDb()
}

// Group operations
export interface Group {
  id: string
  name: string
  description: string | null
  is_default: boolean
  created_at: string
}

export function createGroup(id: string, name: string, description?: string, isDefault = false): Group {
  const group: Group = {
    id,
    name,
    description: description || null,
    is_default: isDefault,
    created_at: new Date().toISOString()
  }
  data.groups.push(group)
  saveDb()
  return group
}

export function getGroup(id: string): Group | undefined {
  return data.groups.find(g => g.id === id)
}

export function getGroupByName(name: string): Group | undefined {
  return data.groups.find(g => g.name.toLowerCase() === name.toLowerCase())
}

export function getAllGroups(): Group[] {
  return [...data.groups].sort((a, b) => a.name.localeCompare(b.name))
}

export function updateGroup(id: string, name: string, description?: string) {
  const group = data.groups.find(g => g.id === id)
  if (group) {
    group.name = name
    group.description = description || null
    saveDb()
  }
}

export function deleteGroup(id: string) {
  data.groups = data.groups.filter(g => g.id !== id)
  data.groupSkills = data.groupSkills.filter(gs => gs.groupId !== id)
  data.activeGroups = data.activeGroups.filter(ag => ag.groupId !== id)
  saveDb()
}

// Group-Skills operations
export function addSkillToGroup(groupId: string, skillId: string) {
  if (!data.groupSkills.some(gs => gs.groupId === groupId && gs.skillId === skillId)) {
    data.groupSkills.push({ groupId, skillId, addedAt: new Date().toISOString() })
    saveDb()
  }
}

export function removeSkillFromGroup(groupId: string, skillId: string) {
  data.groupSkills = data.groupSkills.filter(
    gs => !(gs.groupId === groupId && gs.skillId === skillId)
  )
  saveDb()
}

export function getGroupSkills(groupId: string): Skill[] {
  const skillIds = data.groupSkills.filter(gs => gs.groupId === groupId).map(gs => gs.skillId)
  return data.skills.filter(s => skillIds.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name))
}

export function getSkillGroups(skillId: string): Group[] {
  const groupIds = data.groupSkills.filter(gs => gs.skillId === skillId).map(gs => gs.groupId)
  return data.groups.filter(g => groupIds.includes(g.id)).sort((a, b) => a.name.localeCompare(b.name))
}

// Active groups
export function activateGroup(groupId: string) {
  const existing = data.activeGroups.find(ag => ag.groupId === groupId)
  if (!existing) {
    data.activeGroups.push({ groupId, activatedAt: new Date().toISOString() })
    saveDb()
  }
}

export function deactivateGroup(groupId: string) {
  data.activeGroups = data.activeGroups.filter(ag => ag.groupId !== groupId)
  saveDb()
}

export function deactivateAllGroups() {
  data.activeGroups = []
  saveDb()
}

export function getActiveGroups(): Group[] {
  const activeIds = data.activeGroups.map(ag => ag.groupId)
  return data.groups.filter(g => activeIds.includes(g.id)).sort((a, b) => a.name.localeCompare(b.name))
}

export function isGroupActive(groupId: string): boolean {
  return data.activeGroups.some(ag => ag.groupId === groupId)
}

// Get activated skills (all skills from active groups)
export function getActiveSkills(): Skill[] {
  const activeIds = data.activeGroups.map(ag => ag.groupId)
  const skillIds = data.groupSkills.filter(gs => activeIds.includes(gs.groupId)).map(gs => gs.skillId)
  return data.skills.filter(s => skillIds.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name))
}

// Get all skills not in any group
export function getUngroupedSkills(): Skill[] {
  const groupedIds = new Set(data.groupSkills.map(gs => gs.skillId))
  return data.skills.filter(s => !groupedIds.has(s.id)).sort((a, b) => a.name.localeCompare(b.name))
}

export { CONFIG_DIR, SKILLS_DIR, DB_PATH }
