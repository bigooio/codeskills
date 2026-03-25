"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/db.ts
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var import_os = __toESM(require("os"));
var CONFIG_DIR = import_path.default.join(import_os.default.homedir(), ".codeskills");
var DB_PATH = import_path.default.join(CONFIG_DIR, "skills.json");
var SKILLS_DIR = import_path.default.join(CONFIG_DIR, "skills");
function ensureConfigDir() {
  if (!import_fs.default.existsSync(CONFIG_DIR)) {
    import_fs.default.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  if (!import_fs.default.existsSync(SKILLS_DIR)) {
    import_fs.default.mkdirSync(SKILLS_DIR, { recursive: true });
  }
}
var data = {
  skills: [],
  groups: [],
  groupSkills: [],
  activeGroups: [],
  settings: []
};
function loadDb() {
  ensureConfigDir();
  if (import_fs.default.existsSync(DB_PATH)) {
    try {
      const content = import_fs.default.readFileSync(DB_PATH, "utf-8");
      data = JSON.parse(content);
    } catch (e) {
      console.error("Failed to load database, creating new one");
      data = { skills: [], groups: [], groupSkills: [], activeGroups: [], settings: [] };
    }
  }
  saveDb();
}
function saveDb() {
  ensureConfigDir();
  import_fs.default.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
loadDb();
function installSkill(skill) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const existing = data.skills.findIndex((s) => s.id === skill.id);
  if (existing >= 0) {
    data.skills[existing] = { ...data.skills[existing], ...skill, updated_at: now };
  } else {
    data.skills.push({ ...skill, installed_at: now, updated_at: now });
  }
  saveDb();
}
function getSkill(id) {
  return data.skills.find((s) => s.id === id);
}
function getAllSkills() {
  return [...data.skills].sort((a, b) => a.name.localeCompare(b.name));
}
function createGroup(id, name, description, isDefault = false) {
  const group = {
    id,
    name,
    description: description || null,
    is_default: isDefault,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  data.groups.push(group);
  saveDb();
  return group;
}
function getGroup(id) {
  return data.groups.find((g) => g.id === id);
}
function getAllGroups() {
  return [...data.groups].sort((a, b) => a.name.localeCompare(b.name));
}
function updateGroup(id, name, description) {
  const group = data.groups.find((g) => g.id === id);
  if (group) {
    group.name = name;
    group.description = description || null;
    saveDb();
  }
}
function deleteGroup(id) {
  data.groups = data.groups.filter((g) => g.id !== id);
  data.groupSkills = data.groupSkills.filter((gs) => gs.groupId !== id);
  data.activeGroups = data.activeGroups.filter((ag) => ag.groupId !== id);
  saveDb();
}
function addSkillToGroup(groupId, skillId) {
  if (!data.groupSkills.some((gs) => gs.groupId === groupId && gs.skillId === skillId)) {
    data.groupSkills.push({ groupId, skillId, addedAt: (/* @__PURE__ */ new Date()).toISOString() });
    saveDb();
  }
}
function removeSkillFromGroup(groupId, skillId) {
  data.groupSkills = data.groupSkills.filter(
    (gs) => !(gs.groupId === groupId && gs.skillId === skillId)
  );
  saveDb();
}
function getGroupSkills(groupId) {
  const skillIds = data.groupSkills.filter((gs) => gs.groupId === groupId).map((gs) => gs.skillId);
  return data.skills.filter((s) => skillIds.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name));
}
function activateGroup(groupId) {
  const existing = data.activeGroups.find((ag) => ag.groupId === groupId);
  if (!existing) {
    data.activeGroups.push({ groupId, activatedAt: (/* @__PURE__ */ new Date()).toISOString() });
    saveDb();
  }
}
function deactivateGroup(groupId) {
  data.activeGroups = data.activeGroups.filter((ag) => ag.groupId !== groupId);
  saveDb();
}
function deactivateAllGroups() {
  data.activeGroups = [];
  saveDb();
}
function getActiveGroups() {
  const activeIds = data.activeGroups.map((ag) => ag.groupId);
  return data.groups.filter((g) => activeIds.includes(g.id)).sort((a, b) => a.name.localeCompare(b.name));
}
function getActiveSkills() {
  const activeIds = data.activeGroups.map((ag) => ag.groupId);
  const skillIds = data.groupSkills.filter((gs) => activeIds.includes(gs.groupId)).map((gs) => gs.skillId);
  return data.skills.filter((s) => skillIds.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name));
}
function getUngroupedSkills() {
  const groupedIds = new Set(data.groupSkills.map((gs) => gs.skillId));
  return data.skills.filter((s) => !groupedIds.has(s.id)).sort((a, b) => a.name.localeCompare(b.name));
}

// src/utils.ts
var colors = {
  green: "\x1B[32m",
  blue: "\x1B[34m",
  yellow: "\x1B[33m",
  red: "\x1B[31m",
  cyan: "\x1B[36m",
  reset: "\x1B[0m",
  gray: "\x1B[90m",
  white: "\x1B[37m"
};
function log(color, prefix, message) {
  return `${color}${prefix}${colors.reset} ${message}`;
}
function info(msg) {
  return log(colors.blue, "\u2139", msg);
}
function success(msg) {
  return log(colors.green, "\u2713", msg);
}
function warn(msg) {
  return log(colors.yellow, "\u26A0", msg);
}
function error2(msg) {
  return log(colors.red, "\u2717", msg);
}

// src/commands/group.ts
function groupCommand(args2) {
  const [action, ...rest] = args2;
  switch (action) {
    case "list":
    case void 0:
      listGroups();
      break;
    case "create":
      createGroupCmd(rest);
      break;
    case "delete":
      deleteGroupCmd(rest);
      break;
    case "rename":
      renameGroupCmd(rest);
      break;
    case "edit":
      editGroupCmd(rest);
      break;
    case "add":
      addSkillCmd(rest);
      break;
    case "remove":
      removeSkillCmd(rest);
      break;
    case "show":
      showGroupCmd(rest);
      break;
    default:
      if (action) {
        console.log(error2(`\u672A\u77E5\u64CD\u4F5C: ${action}`));
      }
      help();
  }
}
function help() {
  console.log();
  console.log(info("\u5206\u7EC4\u7BA1\u7406\u547D\u4EE4:"));
  console.log(`  ${success("codeskills group list")}              \u5217\u51FA\u6240\u6709\u5206\u7EC4`);
  console.log(`  ${success("codeskills group create <\u540D\u79F0>")}     \u521B\u5EFA\u65B0\u5206\u7EC4`);
  console.log(`  ${success("codeskills group delete <\u540D\u79F0>")}     \u5220\u9664\u5206\u7EC4`);
  console.log(`  ${success("codeskills group rename <\u65E7\u540D> <\u65B0\u540D>")}  \u91CD\u547D\u540D\u5206\u7EC4`);
  console.log(`  ${success("codeskills group edit <\u540D\u79F0>")}       \u7F16\u8F91\u5206\u7EC4\u63CF\u8FF0`);
  console.log(`  ${success("codeskills group add <\u6280\u80FD> [\u5206\u7EC4]")}  \u6DFB\u52A0\u6280\u80FD\u5230\u5206\u7EC4`);
  console.log(`  ${success("codeskills group remove <\u6280\u80FD> [\u5206\u7EC4]")} \u4ECE\u5206\u7EC4\u79FB\u9664\u6280\u80FD`);
  console.log(`  ${success("codeskills group show <\u540D\u79F0>")}        \u663E\u793A\u5206\u7EC4\u8BE6\u60C5`);
  console.log();
}
function listGroups() {
  const groups = getAllGroups();
  if (groups.length === 0) {
    console.log(warn("\u6682\u65E0\u5206\u7EC4"));
    console.log(`  ${info("\u521B\u5EFA\u5206\u7EC4:")} codeskills group create <\u540D\u79F0>`);
    return;
  }
  console.log();
  console.log(info("\u5206\u7EC4\u5217\u8868:"));
  console.log();
  for (const group of groups) {
    const skills = getGroupSkills(group.id);
    console.log(`  ${success("\u25CF")} ${group.name} ${info(`(${skills.length} \u4E2A\u6280\u80FD)`)}`);
    if (group.description) {
      console.log(`    ${group.description}`);
    }
  }
  console.log();
}
function createGroupCmd(args2) {
  const [name, ...descParts] = args2;
  if (!name) {
    console.log(error2("\u8BF7\u63D0\u4F9B\u5206\u7EC4\u540D\u79F0"));
    console.log(`  \u7528\u6CD5: codeskills group create <\u540D\u79F0> [\u63CF\u8FF0]`);
    return;
  }
  const description = descParts.join(" ");
  const id = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  try {
    createGroup(id, name, description);
    console.log(success(`\u5206\u7EC4 "${name}" \u521B\u5EFA\u6210\u529F\uFF01`));
  } catch (e) {
    if (e.message?.includes("UNIQUE")) {
      console.log(error2(`\u5206\u7EC4 "${name}" \u5DF2\u5B58\u5728`));
    } else {
      console.log(error2(`\u521B\u5EFA\u5931\u8D25: ${e.message}`));
    }
  }
}
function deleteGroupCmd(args2) {
  const [name] = args2;
  if (!name) {
    console.log(error2("\u8BF7\u63D0\u4F9B\u5206\u7EC4\u540D\u79F0"));
    return;
  }
  const group = getGroup(name) || getAllGroups().find((g) => g.name.toLowerCase() === name.toLowerCase());
  if (!group) {
    console.log(error2(`\u5206\u7EC4 "${name}" \u4E0D\u5B58\u5728`));
    return;
  }
  deleteGroup(group.id);
  console.log(success(`\u5206\u7EC4 "${group.name}" \u5DF2\u5220\u9664`));
}
function renameGroupCmd(args2) {
  const [oldName, ...newNameParts] = args2;
  if (!oldName || newNameParts.length === 0) {
    console.log(error2("\u8BF7\u63D0\u4F9B\u65E7\u540D\u79F0\u548C\u65B0\u540D\u79F0"));
    console.log(`  \u7528\u6CD5: codeskills group rename <\u65E7\u540D> <\u65B0\u540D>`);
    return;
  }
  const group = getGroup(oldName) || getAllGroups().find((g) => g.name.toLowerCase() === oldName.toLowerCase());
  if (!group) {
    console.log(error2(`\u5206\u7EC4 "${oldName}" \u4E0D\u5B58\u5728`));
    return;
  }
  const newName = newNameParts.join(" ");
  updateGroup(group.id, newName, group.description || void 0);
  console.log(success(`\u5206\u7EC4\u5DF2\u66F4\u540D\u4E3A "${newName}"`));
}
function editGroupCmd(args2) {
  const [name, ...descParts] = args2;
  if (!name) {
    console.log(error2("\u8BF7\u63D0\u4F9B\u5206\u7EC4\u540D\u79F0"));
    console.log(`  \u7528\u6CD5: codeskills group edit <\u540D\u79F0> [\u63CF\u8FF0]`);
    return;
  }
  const group = getGroup(name) || getAllGroups().find((g) => g.name.toLowerCase() === name.toLowerCase());
  if (!group) {
    console.log(error2(`\u5206\u7EC4 "${name}" \u4E0D\u5B58\u5728`));
    return;
  }
  const description = descParts.join(" ") || void 0;
  updateGroup(group.id, group.name, description);
  console.log(success(`\u5206\u7EC4 "${group.name}" \u5DF2\u66F4\u65B0`));
}
function addSkillCmd(args2) {
  const [skillName, groupName] = args2;
  if (!skillName) {
    console.log(error2("\u8BF7\u63D0\u4F9B\u6280\u80FD\u540D\u79F0"));
    console.log(`  \u7528\u6CD5: codeskills group add <\u6280\u80FD> [\u5206\u7EC4]`);
    return;
  }
  const skillId = skillName.toLowerCase().replace(/\s+/g, "-");
  const allGroups = getAllGroups();
  if (allGroups.length === 0) {
    console.log(warn("\u6682\u65E0\u5206\u7EC4\uFF0C\u8BF7\u5148\u521B\u5EFA\u5206\u7EC4: codeskills group create <\u540D\u79F0>"));
    return;
  }
  let targetGroup = groupName ? getGroup(groupName) || getAllGroups().find((g) => g.name.toLowerCase() === groupName.toLowerCase()) : allGroups.find((g) => g.name.toLowerCase() === "default") || allGroups[0];
  if (!targetGroup && groupName) {
    console.log(error2(`\u5206\u7EC4 "${groupName}" \u4E0D\u5B58\u5728`));
    return;
  }
  if (!targetGroup) {
    console.log(error2("\u6CA1\u6709\u53EF\u7528\u7684\u5206\u7EC4"));
    return;
  }
  addSkillToGroup(targetGroup.id, skillId);
  console.log(success(`\u6280\u80FD "${skillName}" \u5DF2\u6DFB\u52A0\u5230\u5206\u7EC4 "${targetGroup.name}"`));
}
function removeSkillCmd(args2) {
  const [skillName, groupName] = args2;
  if (!skillName) {
    console.log(error2("\u8BF7\u63D0\u4F9B\u6280\u80FD\u540D\u79F0"));
    console.log(`  \u7528\u6CD5: codeskills group remove <\u6280\u80FD> [\u5206\u7EC4]`);
    return;
  }
  const skillId = skillName.toLowerCase().replace(/\s+/g, "-");
  if (groupName) {
    const group = getGroup(groupName) || getAllGroups().find((g) => g.name.toLowerCase() === groupName.toLowerCase());
    if (!group) {
      console.log(error2(`\u5206\u7EC4 "${groupName}" \u4E0D\u5B58\u5728`));
      return;
    }
    removeSkillFromGroup(group.id, skillId);
    console.log(success(`\u6280\u80FD "${skillName}" \u5DF2\u4ECE\u5206\u7EC4 "${group.name}" \u79FB\u9664`));
  } else {
    const groups = getAllGroups();
    for (const group of groups) {
      removeSkillFromGroup(group.id, skillId);
    }
    console.log(success(`\u6280\u80FD "${skillName}" \u5DF2\u4ECE\u6240\u6709\u5206\u7EC4\u79FB\u9664`));
  }
}
function showGroupCmd(args2) {
  const [name] = args2;
  if (!name) {
    console.log(error2("\u8BF7\u63D0\u4F9B\u5206\u7EC4\u540D\u79F0"));
    return;
  }
  const group = getGroup(name) || getAllGroups().find((g) => g.name.toLowerCase() === name.toLowerCase());
  if (!group) {
    console.log(error2(`\u5206\u7EC4 "${name}" \u4E0D\u5B58\u5728`));
    return;
  }
  const skills = getGroupSkills(group.id);
  console.log();
  console.log(`${info("\u5206\u7EC4:")} ${success(group.name)}`);
  if (group.description) {
    console.log(`${info("\u63CF\u8FF0:")} ${group.description}`);
  }
  console.log(`${info("\u6280\u80FD:")} ${skills.length} \u4E2A`);
  console.log();
  if (skills.length > 0) {
    for (const skill of skills) {
      console.log(`  \u2022 ${skill.name}`);
      if (skill.description) {
        console.log(`    ${skill.description.substring(0, 60)}...`);
      }
    }
  } else {
    console.log(`  ${warn("\u6682\u65E0\u6280\u80FD")}`);
    console.log(`  ${info("\u6DFB\u52A0\u6280\u80FD:")} codeskills group add <\u6280\u80FD> ${group.name}`);
  }
  console.log();
}

// src/commands/activate.ts
function activateCommand(args2) {
  const [action, ...rest] = args2;
  if (action === "-a" || action === "--all" || action === "all") {
    activateAll();
  } else if (action === "-n" || action === "--none" || action === "none") {
    deactivateAll();
  } else if (!action || action === "list") {
    listActive();
  } else {
    toggleGroup(action);
  }
}
function toggleGroup(name) {
  const group = getGroup(name) || getAllGroups().find((g) => g.name.toLowerCase() === name.toLowerCase());
  if (!group) {
    console.log(error2(`\u5206\u7EC4 "${name}" \u4E0D\u5B58\u5728`));
    console.log(`  \u4F7F\u7528 codeskills activate --all \u6FC0\u6D3B\u6240\u6709\u5206\u7EC4`);
    return;
  }
  const isActive = getActiveGroups().some((g) => g.id === group.id);
  if (isActive) {
    deactivateGroup(group.id);
    console.log(success(`\u5206\u7EC4 "${group.name}" \u5DF2\u505C\u7528`));
  } else {
    activateGroup(group.id);
    console.log(success(`\u5206\u7EC4 "${group.name}" \u5DF2\u6FC0\u6D3B`));
  }
}
function activateAll() {
  const groups = getAllGroups();
  if (groups.length === 0) {
    console.log(warn("\u6682\u65E0\u5206\u7EC4"));
    return;
  }
  deactivateAllGroups();
  for (const group of groups) {
    activateGroup(group.id);
  }
  console.log(success(`\u5DF2\u6FC0\u6D3B\u6240\u6709\u5206\u7EC4 (${groups.length} \u4E2A)`));
  console.log(`  ${info("\u67E5\u770B\u72B6\u6001:")} codeskills status`);
}
function deactivateAll() {
  deactivateAllGroups();
  console.log(success("\u5DF2\u505C\u7528\u6240\u6709\u5206\u7EC4"));
  console.log(`  ${info("\u67E5\u770B\u72B6\u6001:")} codeskills status`);
}
function listActive() {
  const activeGroups = getActiveGroups();
  const allGroups = getAllGroups();
  if (allGroups.length === 0) {
    console.log(warn("\u6682\u65E0\u5206\u7EC4"));
    console.log(`  ${info("\u521B\u5EFA\u5206\u7EC4:")} codeskills group create <\u540D\u79F0>`);
    console.log();
    return;
  }
  console.log();
  console.log(info("\u5206\u7EC4\u72B6\u6001:"));
  console.log();
  for (const group of allGroups) {
    const isActive = activeGroups.some((g) => g.id === group.id);
    const status = isActive ? success("\u25CF \u6FC0\u6D3B") : warn("\u25CB \u505C\u7528");
    console.log(`  ${status}  ${group.name}`);
  }
  console.log();
}

// src/commands/status.ts
function statusCommand() {
  const allGroups = getAllGroups();
  const activeGroups = getActiveGroups();
  const activeSkills = getActiveSkills();
  const allSkills = getAllSkills();
  const ungrouped = getUngroupedSkills();
  console.log(info("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557"));
  console.log(info("\u2551           CodeSkills \u72B6\u6001               \u2551"));
  console.log(info("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D"));
  console.log();
  console.log(info("\u6280\u80FD\u7EDF\u8BA1:"));
  console.log(`  \u603B\u6570:     ${success(allSkills.length + " \u4E2A")}`);
  console.log(`  \u5DF2\u6FC0\u6D3B:   ${success(activeSkills.length + " \u4E2A")}`);
  if (ungrouped.length > 0) {
    console.log(`  \u672A\u5206\u7EC4:   ${warn(ungrouped.length + " \u4E2A")}`);
  } else {
    console.log(`  \u672A\u5206\u7EC4:   0 \u4E2A`);
  }
  console.log();
  console.log(info("\u5206\u7EC4\u7EDF\u8BA1:"));
  console.log(`  \u5206\u7EC4\u6570:   ${allGroups.length} \u4E2A`);
  console.log(`  \u5DF2\u6FC0\u6D3B:   ${activeGroups.length} \u4E2A`);
  if (allGroups.length > 0) {
    console.log();
    console.log(info("\u6FC0\u6D3B\u7684\u5206\u7EC4:"));
    if (activeGroups.length === 0) {
      console.log(`  ${warn("\u6682\u65E0\u6FC0\u6D3B\u7684\u5206\u7EC4")}`);
    } else {
      for (const group of activeGroups) {
        console.log(`  ${success("\u25CF")} ${group.name}`);
      }
    }
    console.log();
    console.log(info("\u6FC0\u6D3B\u7684\u6280\u80FD:"));
    if (activeSkills.length === 0) {
      console.log(`  ${warn("\u6682\u65E0\u6FC0\u6D3B\u7684\u6280\u80FD")}`);
    } else {
      const skillNames = activeSkills.slice(0, 10).map((s) => s.name);
      console.log(`  ${skillNames.join(", ")}`);
      if (activeSkills.length > 10) {
        console.log(`  ${warn(`...\u8FD8\u6709 ${activeSkills.length - 10} \u4E2A`)}`);
      }
    }
  } else {
    console.log();
    console.log(`  ${warn("\u6682\u65E0\u5206\u7EC4")}`);
    console.log(`  ${info("\u521B\u5EFA\u5206\u7EC4:")} codeskills group create <\u540D\u79F0>`);
  }
  console.log();
  console.log(info("\u5E38\u7528\u547D\u4EE4:"));
  console.log(`  ${info("codeskills status")}          \u67E5\u770B\u72B6\u6001`);
  console.log(`  ${info("codeskills activate <\u7EC4>")}  \u6FC0\u6D3B\u5206\u7EC4`);
  console.log(`  ${info("codeskills group list")}     \u5217\u51FA\u5206\u7EC4`);
  console.log(`  ${info("codeskills help")}           \u67E5\u770B\u5E2E\u52A9`);
  console.log();
}

// src/commands/install.ts
var import_fs2 = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var import_os2 = __toESM(require("os"));
var CONFIG_DIR2 = import_path2.default.join(import_os2.default.homedir(), ".codeskills");
var SKILLS_DIR2 = import_path2.default.join(CONFIG_DIR2, "skills");
function installCommand(args2) {
  const [skillName] = args2;
  if (!skillName) {
    console.log(error2("\u8BF7\u63D0\u4F9B\u6280\u80FD\u540D\u79F0"));
    console.log(`  \u7528\u6CD5: codeskills install <\u6280\u80FD>`);
    console.log(`  \u793A\u4F8B: codeskills install agent-builder`);
    return;
  }
  const existing = getSkill(skillName.toLowerCase().replace(/\s+/g, "-"));
  if (existing) {
    console.log(success(`\u6280\u80FD "${existing.name}" \u5DF2\u5B89\u88C5`));
    console.log(`  \u67E5\u770B: codeskills group show ${existing.id}`);
    return;
  }
  console.log(`${info("\u6B63\u5728\u5B89\u88C5\u6280\u80FD:")} ${skillName}`);
  fetch(`https://codeskills.cn/api/skills/${encodeURIComponent(skillName)}`).then((res) => {
    if (!res.ok) {
      throw new Error(`\u6280\u80FD "${skillName}" \u4E0D\u5B58\u5728`);
    }
    return res.json();
  }).then(async (data2) => {
    const meta = {
      id: data2.slug,
      name: data2.name,
      description: data2.description,
      tags: Array.isArray(data2.tags) ? data2.tags.join(",") : data2.tags,
      source: "local",
      source_url: `https://codeskills.cn/skills/${data2.slug}`
    };
    const skillPath = import_path2.default.join(SKILLS_DIR2, `${meta.id}.md`);
    import_fs2.default.mkdirSync(SKILLS_DIR2, { recursive: true });
    const contentRes = await fetch(`https://codeskills.cn/api/skills/${encodeURIComponent(skillName)}/content`);
    const content = await contentRes.text();
    import_fs2.default.writeFileSync(skillPath, content);
    installSkill(meta);
    console.log(success(`\u6280\u80FD "${meta.name}" \u5B89\u88C5\u6210\u529F\uFF01`));
    console.log(`  \u6280\u80FD\u6587\u4EF6: ${skillPath}`);
    console.log(`  \u67E5\u770B\u8BE6\u60C5: codeskills group show ${meta.id}`);
  }).catch((e) => {
    console.log(error2(e.message));
    console.log(`  \u641C\u7D22\u6280\u80FD: https://codeskills.cn/search?q=${encodeURIComponent(skillName)}`);
  });
}

// src/commands/web.ts
var import_http = __toESM(require("http"));
var import_https = __toESM(require("https"));
var import_fs3 = __toESM(require("fs"));
var import_path3 = __toESM(require("path"));
var PORT = 3741;
function webCommand(_args) {
  const pidFile = import_path3.default.join(CONFIG_DIR, "web.pid");
  if (import_fs3.default.existsSync(pidFile)) {
    const pid = parseInt(import_fs3.default.readFileSync(pidFile, "utf-8"));
    try {
      process.kill(pid, 0);
      console.log(`Web \u9762\u677F\u5DF2\u5728\u8FD0\u884C (PID: ${pid})`);
      console.log(`  \u8BBF\u95EE: http://localhost:${PORT}`);
      return;
    } catch {
      import_fs3.default.unlinkSync(pidFile);
    }
  }
  const server = import_http.default.createServer(requestHandler);
  server.listen(PORT, () => {
    import_fs3.default.writeFileSync(pidFile, process.pid.toString());
    console.log(`CodeSkills Web \u9762\u677F\u5DF2\u542F\u52A8`);
    console.log(`  \u8BBF\u95EE: http://localhost:${PORT}`);
    console.log(`  \u505C\u6B62: pkill -f "codeskills web"`);
    console.log();
  });
  server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.log(`\u7AEF\u53E3 ${PORT} \u5DF2\u88AB\u5360\u7528`);
    }
  });
}
function requestHandler(req, res) {
  const url = new URL(req.url || "/", `http://localhost:${PORT}`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  if (url.pathname === "/api/status") {
    const groups = getAllGroups();
    const activeGroups = getActiveGroups();
    const activeSkills = getActiveSkills();
    const allSkills = getAllSkills();
    const ungrouped = getUngroupedSkills();
    res.end(JSON.stringify({
      groups,
      activeGroups,
      activeSkills,
      allSkills,
      ungrouped,
      stats: {
        totalSkills: allSkills.length,
        activeSkills: activeSkills.length,
        totalGroups: groups.length,
        activeGroups: activeGroups.length,
        ungrouped: ungrouped.length
      }
    }));
    return;
  }
  if (url.pathname === "/api/groups" && req.method === "GET") {
    const groups = getAllGroups().map((g) => ({
      ...g,
      skills: getGroupSkills(g.id),
      isActive: getActiveGroups().some((ag) => ag.id === g.id)
    }));
    res.end(JSON.stringify(groups));
    return;
  }
  if (url.pathname === "/api/groups" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => body += chunk);
    req.on("end", () => {
      try {
        const { name, description } = JSON.parse(body);
        if (!name) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A" }));
          return;
        }
        const id = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const group = createGroup(id, name, description);
        res.end(JSON.stringify(group));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }
  if (url.pathname.match(/^\/api\/groups\/[^/]+$/) && req.method === "DELETE") {
    const id = url.pathname.split("/")[3];
    const group = getGroup(id);
    if (!group) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "\u5206\u7EC4\u4E0D\u5B58\u5728" }));
      return;
    }
    deleteGroup(id);
    res.end(JSON.stringify({ success: true }));
    return;
  }
  if (url.pathname.match(/^\/api\/groups\/[^/]+$/) && req.method === "GET") {
    const id = url.pathname.split("/")[3];
    const group = getGroup(id);
    if (!group) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "\u5206\u7EC4\u4E0D\u5B58\u5728" }));
      return;
    }
    const skills = getGroupSkills(id);
    const isActive = getActiveGroups().some((ag) => ag.id === id);
    res.end(JSON.stringify({ ...group, skills, isActive }));
    return;
  }
  if (url.pathname.match(/^\/api\/groups\/[^/]+\/activate$/) && req.method === "POST") {
    const id = url.pathname.split("/")[3];
    activateGroup(id);
    res.end(JSON.stringify({ success: true }));
    return;
  }
  if (url.pathname.match(/^\/api\/groups\/[^/]+\/deactivate$/) && req.method === "POST") {
    const id = url.pathname.split("/")[3];
    deactivateGroup(id);
    res.end(JSON.stringify({ success: true }));
    return;
  }
  if (url.pathname.match(/^\/api\/groups\/[^/]+\/skills$/) && req.method === "POST") {
    const id = url.pathname.split("/")[3];
    let body = "";
    req.on("data", (chunk) => body += chunk);
    req.on("end", () => {
      try {
        const { skillId } = JSON.parse(body);
        addSkillToGroup(id, skillId);
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }
  if (url.pathname.match(/^\/api\/groups\/[^/]+\/skills\/[^/]+$/) && req.method === "DELETE") {
    const parts = url.pathname.split("/");
    const groupId = parts[3];
    const skillId = parts[5];
    removeSkillFromGroup(groupId, skillId);
    res.end(JSON.stringify({ success: true }));
    return;
  }
  if (url.pathname === "/api/skills" && req.method === "GET") {
    res.end(JSON.stringify(getAllSkills()));
    return;
  }
  if (url.pathname === "/api/skills/ungrouped" && req.method === "GET") {
    res.end(JSON.stringify(getUngroupedSkills()));
    return;
  }
  if (url.pathname === "/api/remote/skills" && req.method === "GET") {
    import_https.default.get("https://codeskills.cn/api/skills", (apiRes) => {
      let data2 = "";
      apiRes.on("data", (chunk) => data2 += chunk);
      apiRes.on("end", () => {
        res.setHeader("Content-Type", "application/json");
        res.end(data2);
      });
    }).on("error", () => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: "\u83B7\u53D6\u8FDC\u7A0B\u6280\u80FD\u5931\u8D25" }));
    });
    return;
  }
  if (url.pathname === "/api/search" && req.method === "GET") {
    const query = (url.searchParams.get("q") || "").toLowerCase();
    import_https.default.get("https://codeskills.cn/api/skills", (apiRes) => {
      let data2 = "";
      apiRes.on("data", (chunk) => data2 += chunk);
      apiRes.on("end", () => {
        try {
          const allSkills = JSON.parse(data2);
          const results = allSkills.filter(
            (s) => s.title.toLowerCase().includes(query) || s.description && s.description.toLowerCase().includes(query) || s.tags && s.tags.some((t) => t.toLowerCase().includes(query))
          ).map((s) => ({
            slug: s.slug,
            name: s.title,
            description: s.description,
            tags: Array.isArray(s.tags) ? s.tags.join(",") : s.tags,
            source: s.source,
            source_url: s.sourceUrl
          }));
          res.end(JSON.stringify(results));
        } catch {
          res.writeHead(500);
          res.end(JSON.stringify({ error: "\u641C\u7D22\u5931\u8D25" }));
        }
      });
    }).on("error", () => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: "\u7F51\u7EDC\u9519\u8BEF\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5" }));
    });
    return;
  }
  if (url.pathname === "/api/skills/install" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => body += chunk);
    req.on("end", () => {
      try {
        const { slug } = JSON.parse(body);
        import_https.default.get(`https://codeskills.cn/api/skills/${encodeURIComponent(slug)}`, (apiRes) => {
          let data2 = "";
          apiRes.on("data", (chunk) => data2 += chunk);
          apiRes.on("end", () => {
            try {
              const skillData = JSON.parse(data2);
              const SKILLS_DIR3 = import_path3.default.join(CONFIG_DIR, "skills");
              import_fs3.default.mkdirSync(SKILLS_DIR3, { recursive: true });
              import_https.default.get(`https://codeskills.cn/api/skills/${encodeURIComponent(slug)}/content`, (contentRes) => {
                let content = "";
                contentRes.on("data", (chunk) => content += chunk);
                contentRes.on("end", () => {
                  import_fs3.default.writeFileSync(import_path3.default.join(SKILLS_DIR3, `${slug}.md`), content);
                  installSkill({
                    id: slug,
                    name: skillData.title || skillData.name,
                    description: skillData.description,
                    tags: Array.isArray(skillData.tags) ? skillData.tags.join(",") : skillData.tags,
                    source: "local",
                    source_url: `https://codeskills.cn/skills/${slug}`
                  });
                  res.end(JSON.stringify({ success: true, skill: skillData }));
                });
              }).on("error", () => {
                res.writeHead(500);
                res.end(JSON.stringify({ error: "\u83B7\u53D6\u5185\u5BB9\u5931\u8D25" }));
              });
            } catch {
              res.writeHead(500);
              res.end(JSON.stringify({ error: "\u89E3\u6790\u5931\u8D25" }));
            }
          });
        }).on("error", () => {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "\u6280\u80FD\u4E0D\u5B58\u5728" }));
        });
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }
  if (url.pathname === "/" || url.pathname === "/index.html") {
    res.setHeader("Content-Type", "text/html");
    res.end(getHtml());
    return;
  }
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
}
function getHtml() {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeSkills \u7BA1\u7406\u9762\u677F</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    h1 { color: #38bdf8; margin-bottom: 0.5rem; font-size: 1.8rem; }
    .subtitle { color: #64748b; margin-bottom: 2rem; }
    .card { background: #1e293b; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .card h2 { color: #94a3b8; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; }
    .stat { background: #334155; padding: 1rem; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 2rem; font-weight: bold; color: #38bdf8; }
    .stat-label { color: #94a3b8; font-size: 0.85rem; margin-top: 0.25rem; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #334155; padding-bottom: 1rem; }
    .tab { padding: 0.6rem 1.2rem; border-radius: 6px; background: #334155; border: none; color: #94a3b8; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
    .tab:hover { background: #475569; }
    .tab.active { background: #38bdf8; color: #0f172a; font-weight: 600; }
    .groups { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .group { background: #334155; padding: 1rem; border-radius: 8px; border: 2px solid transparent; transition: all 0.2s; }
    .group.active { border-color: #22c55e; }
    .group-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
    .group-name { font-weight: 600; font-size: 1.1rem; }
    .group.active .group-name { color: #22c55e; }
    .group-actions { display: flex; gap: 0.5rem; }
    .btn { padding: 0.4rem 0.8rem; border-radius: 6px; border: none; cursor: pointer; font-size: 0.8rem; transition: all 0.2s; }
    .btn-activate { background: #166534; color: #dcfce7; }
    .btn-activate:hover { background: #15803d; }
    .btn-deactivate { background: #475569; color: #e2e8f0; }
    .btn-deactivate:hover { background: #64748b; }
    .btn-delete { background: #7f1d1d; color: #fecaca; }
    .btn-delete:hover { background: #991b1b; }
    .btn-add { background: #38bdf8; color: #0f172a; font-weight: 600; }
    .btn-add:hover { background: #0ea5e9; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
    .skill-tag { background: #1e293b; padding: 0.3rem 0.7rem; border-radius: 4px; font-size: 0.8rem; color: #94a3b8; display: flex; align-items: center; gap: 0.4rem; }
    .skill-tag .remove { color: #ef4444; cursor: pointer; font-weight: bold; }
    .skill-tag .remove:hover { color: #f87171; }
    .empty { color: #64748b; font-style: italic; padding: 1rem; text-align: center; }
    .add-form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .add-form input { flex: 1; background: #334155; border: 1px solid #475569; padding: 0.6rem 1rem; border-radius: 6px; color: #e2e8f0; font-size: 0.9rem; }
    .add-form input::placeholder { color: #64748b; }
    .add-form button { background: #38bdf8; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; color: #0f172a; font-weight: 600; cursor: pointer; }
    .add-form button:hover { background: #0ea5e9; }
    .search-section { margin-top: 1rem; }
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal.hidden { display: none; }
    .hidden { display: none; }
    .modal-content { background: #1e293b; border-radius: 12px; padding: 2rem; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; }
    .modal-content h2 { margin-bottom: 1rem; color: #38bdf8; }
    .modal-content input, .modal-content textarea { width: 100%; background: #334155; border: 1px solid #475569; padding: 0.75rem; border-radius: 6px; color: #e2e8f0; margin-bottom: 1rem; font-size: 0.9rem; }
    .modal-content textarea { min-height: 80px; resize: vertical; }
    .modal-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
    .modal-actions button { padding: 0.6rem 1.2rem; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
    .modal-actions .cancel { background: #475569; color: #e2e8f0; }
    .modal-actions .confirm { background: #38bdf8; color: #0f172a; }
    nav { display: flex; gap: 1rem; margin-bottom: 2rem; align-items: center; }
    nav h1 { margin-bottom: 0; }
    nav a { color: #94a3b8; text-decoration: none; padding: 0.5rem 1rem; border-radius: 6px; }
    nav a:hover, nav a.active { background: #334155; color: #38bdf8; }
    .toast { position: fixed; bottom: 2rem; right: 2rem; background: #334155; padding: 1rem 1.5rem; border-radius: 8px; color: #e2e8f0; transform: translateY(100px); opacity: 0; transition: all 0.3s; z-index: 200; }
    .toast.show { transform: translateY(0); opacity: 1; }
    .toast.success { border-left: 4px solid #22c55e; }
    .toast.error { border-left: 4px solid #ef4444; }
    .search-bar { margin-bottom: 1rem; }
    .search-bar input { width: 100%; background: #334155; border: 1px solid #475569; padding: 0.75rem 1rem; border-radius: 8px; color: #e2e8f0; font-size: 0.95rem; }
    .search-bar input::placeholder { color: #64748b; }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .skill-card { background: #334155; border-radius: 8px; padding: 1rem; transition: all 0.2s; }
    .skill-card:hover { background: #475569; }
    .skill-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
    .skill-card-name { font-weight: 600; font-size: 1rem; color: #e2e8f0; }
    .skill-card-desc { color: #94a3b8; font-size: 0.85rem; line-height: 1.4; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .skill-card-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem; }
    .skill-tag-small { background: #1e293b; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; color: #64748b; }
    .skill-card-actions { display: flex; gap: 0.5rem; }
    .load-more { text-align: center; padding: 1rem; color: #38bdf8; cursor: pointer; font-weight: 600; }
    .load-more:hover { color: #0ea5e9; }
    .load-more.hidden { display: none; }
    .skill-picker-list { max-height: 400px; overflow-y: auto; margin: 1rem 0; }
    .skill-picker-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-radius: 6px; cursor: pointer; transition: background 0.2s; }
    .skill-picker-item:hover { background: #334155; }
    .skill-picker-item-info h4 { font-size: 0.95rem; margin-bottom: 0.2rem; }
    .skill-picker-item-info p { color: #64748b; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="container">
    <nav>
      <h1>CodeSkills</h1>
      <a href="#groups" class="active">\u5206\u7EC4</a>
      <a href="#search">\u641C\u7D22\u5B89\u88C5</a>
    </nav>

    <div id="groups-view">
      <div class="card">
        <h2>\u7EDF\u8BA1</h2>
        <div class="stats">
          <div class="stat"><div class="stat-value" id="stat-skills">0</div><div class="stat-label">\u603B\u6280\u80FD</div></div>
          <div class="stat"><div class="stat-value" id="stat-active-skills">0</div><div class="stat-label">\u5DF2\u6FC0\u6D3B</div></div>
          <div class="stat"><div class="stat-value" id="stat-groups">0</div><div class="stat-label">\u5206\u7EC4</div></div>
          <div class="stat"><div class="stat-value" id="stat-active-groups">0</div><div class="stat-label">\u5DF2\u6FC0\u6D3B</div></div>
        </div>
      </div>

      <div class="card">
        <h2>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          \u6211\u7684\u5206\u7EC4
        </h2>
        <div class="add-form">
          <input type="text" id="new-group-name" placeholder="\u65B0\u5206\u7EC4\u540D\u79F0...">
          <button onclick="createGroup()">+ \u521B\u5EFA\u5206\u7EC4</button>
        </div>
        <div class="groups" id="groups-list"></div>
      </div>
    </div>

    <div id="search-view" class="hidden">
      <div class="card">
        <h2>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          \u8FDC\u7A0B\u6280\u80FD\u5E02\u573A <span id="total-skills" style="color:#64748b;font-weight:normal">(\u52A0\u8F7D\u4E2D...)</span>
        </h2>
        <div class="search-bar">
          <input type="text" id="search-input" placeholder="\u641C\u7D22\u6280\u80FD\u540D\u79F0\u6216\u63CF\u8FF0..." oninput="filterSkills()">
        </div>
        <div class="skills-grid" id="skills-grid"></div>
        <div class="load-more" id="load-more" onclick="loadMoreSkills()">\u52A0\u8F7D\u66F4\u591A</div>
      </div>
    </div>
  </div>

  <div class="modal hidden" id="add-skill-modal">
    <div class="modal-content" style="max-width:600px;">
      <h2 id="modal-title">\u6DFB\u52A0\u6280\u80FD\u5230\u5206\u7EC4</h2>
      <input type="text" id="skill-search-input" placeholder="\u641C\u7D22\u6280\u80FD..." oninput="filterAvailableSkills()">
      <div class="skill-picker-list" id="skill-picker-list"></div>
      <div class="modal-actions">
        <button class="cancel" onclick="closeAddSkillModal()">\u53D6\u6D88</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    let currentGroupId = null
    let allSkills = []
    let displayedSkills = []
    let skillsPage = 0
    let skillsPerPage = 20
    let searchQuery = ''
    let availableSkills = []

    function navigate(view) {
      document.getElementById('groups-view').style.display = view === 'groups' ? 'block' : 'none'
      document.getElementById('search-view').style.display = view === 'search' ? 'block' : 'none'
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'))
      if (view === 'groups') document.querySelector('nav a:nth-child(2)').classList.add('active')
      if (view === 'search') {
        document.querySelector('nav a:nth-child(3)').classList.add('active')
        if (allSkills.length === 0) loadAllSkills()
      }
    }

    async function loadAllSkills() {
      try {
        const res = await fetch('/api/remote/skills')
        allSkills = await res.json()
        document.getElementById('total-skills').textContent = '(' + allSkills.length + ' \u4E2A\u6280\u80FD)'
        skillsPage = 0
        searchQuery = ''
        filterSkills()
      } catch (e) {
        console.error('Failed to load skills:', e)
      }
    }

    function filterSkills() {
      searchQuery = document.getElementById('search-input').value.toLowerCase()
      skillsPage = 0
      displayedSkills = allSkills.filter(s =>
        s.title.toLowerCase().includes(searchQuery) ||
        (s.description && s.description.toLowerCase().includes(searchQuery)) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(searchQuery)))
      )
      renderSkills()
    }

    function renderSkills() {
      const container = document.getElementById('skills-grid')
      const start = 0
      const end = (skillsPage + 1) * skillsPerPage
      const toShow = displayedSkills.slice(start, end)

      container.innerHTML = toShow.map(s => \`
        <div class="skill-card">
          <div class="skill-card-header">
            <span class="skill-card-name">\${s.title}</span>
          </div>
          <p class="skill-card-desc">\${s.description || ''}</p>
          <div class="skill-card-tags">
            \${(s.tags || []).slice(0, 4).map(t => \`<span class="skill-tag-small">\${t}</span>\`).join('')}
          </div>
          <div class="skill-card-actions">
            <button class="btn btn-add" onclick="installFromSearch('\${s.slug}')">\u5B89\u88C5</button>
          </div>
        </div>
      \`).join('')

      const loadMoreBtn = document.getElementById('load-more')
      if (end < displayedSkills.length) {
        loadMoreBtn.classList.remove('hidden')
      } else {
        loadMoreBtn.classList.add('hidden')
      }
    }

    function loadMoreSkills() {
      skillsPage++
      renderSkills()
    }

    async function installFromSearch(slug) {
      const statusEl = document.createElement('div')
      statusEl.className = 'skill-card'
      statusEl.style.textAlign = 'center'
      statusEl.style.color = '#38bdf8'
      statusEl.textContent = '\u5B89\u88C5\u4E2D...'
      document.getElementById('skills-grid').prepend(statusEl)

      try {
        const res = await fetch('/api/skills/install', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug })
        })

        statusEl.remove()
        if (res.ok) {
          showToast('\u5B89\u88C5\u6210\u529F', 'success')
          loadData()
        } else {
          const err = await res.json()
          showToast(err.error || '\u5B89\u88C5\u5931\u8D25', 'error')
        }
      } catch {
        statusEl.remove()
        showToast('\u5B89\u88C5\u5931\u8D25', 'error')
      }
    }

    async function loadData() {
      const res = await fetch('/api/status')
      const data = await res.json()
      document.getElementById('stat-skills').textContent = data.stats.totalSkills
      document.getElementById('stat-active-skills').textContent = data.stats.activeSkills
      document.getElementById('stat-groups').textContent = data.stats.totalGroups
      document.getElementById('stat-active-groups').textContent = data.stats.activeGroups
    }

    async function loadGroups() {
      const res = await fetch('/api/groups')
      const groups = await res.json()

      const container = document.getElementById('groups-list')
      if (groups.length === 0) {
        container.innerHTML = '<div class="empty">\u6682\u65E0\u5206\u7EC4\uFF0C\u8BF7\u521B\u5EFA\u4E00\u4E2A</div>'
        return
      }

      container.innerHTML = groups.map(g => \`
        <div class="group \${g.isActive ? 'active' : ''}">
          <div class="group-header">
            <span class="group-name">\${g.name}</span>
            <div class="group-actions">
              <button class="btn \${g.isActive ? 'btn-deactivate' : 'btn-activate'}" onclick="toggleGroup('\${g.id}', \${!g.isActive})">
                \${g.isActive ? '\u505C\u7528' : '\u6FC0\u6D3B'}
              </button>
              <button class="btn btn-add" onclick="openAddSkillModal('\${g.id}')">+ \u6280\u80FD</button>
              <button class="btn btn-delete" onclick="deleteGroup('\${g.id}')">\u5220\u9664</button>
            </div>
          </div>
          <div class="skills-list">
            \${g.skills.length === 0 ? '<span class="empty">\u6682\u65E0\u6280\u80FD</span>' : ''}
            \${g.skills.map(s => \`<span class="skill-tag">\${s.name}<span class="remove" onclick="removeSkill('\${g.id}', '\${s.id}')">\xD7</span></span>\`).join('')}
          </div>
        </div>
      \`).join('')
    }

    async function createGroup() {
      const name = document.getElementById('new-group-name').value.trim()
      if (!name) return

      await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      document.getElementById('new-group-name').value = ''
      loadGroups()
      loadData()
      showToast('\u5206\u7EC4\u5DF2\u521B\u5EFA', 'success')
    }

    async function deleteGroup(id) {
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u5206\u7EC4\u5417\uFF1F')) return
      await fetch(\`/api/groups/\${id}\`, { method: 'DELETE' })
      loadGroups()
      loadData()
      showToast('\u5206\u7EC4\u5DF2\u5220\u9664', 'success')
    }

    async function toggleGroup(id, activate) {
      await fetch(\`/api/groups/\${id}/\${activate ? 'activate' : 'deactivate'}\`, { method: 'POST' })
      loadGroups()
      loadData()
    }

    async function openAddSkillModal(groupId) {
      currentGroupId = groupId
      document.getElementById('add-skill-modal').classList.remove('hidden')
      document.getElementById('skill-search-input').value = ''
      document.getElementById('skill-search-input').focus()

      // Load all skills if not loaded
      if (availableSkills.length === 0) {
        try {
          availableSkills = await fetch('/api/remote/skills').then(r => r.json())
        } catch (e) {
          console.error('Failed to load skills for picker')
        }
      }

      filterAvailableSkills()
    }

    function filterAvailableSkills() {
      const query = document.getElementById('skill-search-input').value.toLowerCase()
      const container = document.getElementById('skill-picker-list')

      const filtered = availableSkills.filter(s =>
        s.title.toLowerCase().includes(query) ||
        (s.description && s.description.toLowerCase().includes(query))
      ).slice(0, 50)

      container.innerHTML = filtered.map(s => \`
        <div class="skill-picker-item" onclick="addSkillToGroup('\${s.slug}')">
          <div class="skill-picker-item-info">
            <h4>\${s.title}</h4>
            <p>\${s.description || ''}</p>
          </div>
          <button class="btn btn-add">+ \u6DFB\u52A0</button>
        </div>
      \`).join('')

      if (filtered.length === 0) {
        container.innerHTML = '<div class="empty">\u672A\u627E\u5230\u5339\u914D\u7684\u6280\u80FD</div>'
      }
    }

    async function addSkillToGroup(skillSlug) {
      if (!currentGroupId) return

      await fetch(\`/api/groups/\${currentGroupId}/skills\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: skillSlug })
      })

      closeAddSkillModal()
      loadGroups()
      showToast('\u6280\u80FD\u5DF2\u6DFB\u52A0', 'success')
    }

    function closeAddSkillModal() {
      document.getElementById('add-skill-modal').classList.add('hidden')
      currentGroupId = null
    }

    async function removeSkill(groupId, skillId) {
      await fetch(\`/api/groups/\${groupId}/skills/\${skillId}\`, { method: 'DELETE' })
      loadGroups()
    }

    function showToast(message, type = 'success') {
      const toast = document.getElementById('toast')
      toast.textContent = message
      toast.className = \`toast \${type} show\`
      setTimeout(() => toast.classList.remove('show'), 3000)
    }

    // Handle Enter key in inputs
    document.getElementById('new-group-name').addEventListener('keypress', e => { if (e.key === 'Enter') createGroup() })

    // Handle URL hash for navigation
    window.addEventListener('hashchange', () => {
      const hash = location.hash.slice(1)
      const view = (hash === 'groups' || hash === 'search') ? hash : 'groups'
      navigate(view)
    })

    // Init
    loadData()
    loadGroups()
    const initialHash = location.hash.slice(1)
    navigate(initialHash === 'search' ? 'search' : 'groups')
  </script>
</body>
</html>`;
}

// src/commands/search.ts
function searchCommand(args2) {
  const [query] = args2;
  if (!query) {
    console.log(error2("\u8BF7\u63D0\u4F9B\u641C\u7D22\u5173\u952E\u8BCD"));
    console.log(`  \u7528\u6CD5: codeskills search <\u5173\u952E\u8BCD>`);
    console.log(`  \u793A\u4F8B: codeskills search python`);
    return;
  }
  console.log(`${info("\u641C\u7D22\u8FDC\u7A0B\u6280\u80FD:")} ${query}`);
  console.log();
  fetch(`https://codeskills.cn/api/skills/search?q=${encodeURIComponent(query)}`).then((res) => {
    if (!res.ok) {
      throw new Error("\u641C\u7D22\u8BF7\u6C42\u5931\u8D25");
    }
    return res.json();
  }).then((skills) => {
    if (skills.length === 0) {
      console.log(warn("\u672A\u627E\u5230\u5339\u914D\u7684\u6280\u80FD"));
      console.log(`  \u6D4F\u89C8\u5168\u90E8: https://codeskills.cn`);
      return;
    }
    console.log(success(`\u627E\u5230 ${skills.length} \u4E2A\u5339\u914D\u7684\u6280\u80FD:`));
    console.log();
    for (const skill of skills.slice(0, 20)) {
      console.log(`  ${success("\u25CF")} ${skill.name}`);
      if (skill.description) {
        const desc = skill.description.length > 60 ? skill.description.substring(0, 60) + "..." : skill.description;
        console.log(`    ${desc}`);
      }
      if (skill.tags) {
        console.log(`    ${info("\u6807\u7B7E:")} ${skill.tags}`);
      }
      console.log(`    ${info("\u5B89\u88C5:")} codeskills install ${skill.slug}`);
      console.log();
    }
    if (skills.length > 20) {
      console.log(warn(`...\u8FD8\u6709 ${skills.length - 20} \u4E2A\u7ED3\u679C`));
      console.log(`  \u67E5\u770B\u66F4\u591A: https://codeskills.cn/search?q=${encodeURIComponent(query)}`);
    }
  }).catch((e) => {
    console.log(error2(e.message));
  });
}

// src/commands/list.ts
function listCommand(args2) {
  const [filter] = args2;
  if (filter === "--local" || filter === "-l") {
    listLocal();
  } else if (filter === "--remote" || filter === "-r") {
    listRemote();
  } else {
    listLocal();
  }
}
function listLocal() {
  const skills = getAllSkills();
  const groups = getAllGroups();
  if (skills.length === 0) {
    console.log(warn("\u6682\u65E0\u672C\u5730\u6280\u80FD"));
    console.log(`  ${info("\u641C\u7D22\u8FDC\u7A0B\u6280\u80FD:")} codeskills search <\u5173\u952E\u8BCD>`);
    console.log(`  ${info("\u6D4F\u89C8\u8FDC\u7A0B:")} codeskills list --remote`);
    return;
  }
  console.log(info("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557"));
  console.log(info("\u2551         \u672C\u5730\u5DF2\u5B89\u88C5\u6280\u80FD               \u2551"));
  console.log(info("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D"));
  console.log();
  const skillsByGroup = /* @__PURE__ */ new Map();
  for (const skill of skills) {
    const skillGroups = groups.filter(
      (g) => getGroupSkills(g.id).some((s) => s.id === skill.id)
    );
    if (skillGroups.length === 0) {
      if (!skillsByGroup.has("ungrouped")) {
        skillsByGroup.set("ungrouped", []);
      }
      skillsByGroup.get("ungrouped").push(skill);
    } else {
      for (const group of skillGroups) {
        if (!skillsByGroup.has(group.name)) {
          skillsByGroup.set(group.name, []);
        }
        skillsByGroup.get(group.name).push(skill);
      }
    }
  }
  for (const [groupName, groupSkills] of skillsByGroup) {
    const label = groupName === "ungrouped" ? warn("\u672A\u5206\u7EC4") : success(groupName);
    console.log(`${label} (${groupSkills.length}\u4E2A):`);
    for (const skill of groupSkills) {
      console.log(`  \u2022 ${skill.name}`);
      if (skill.description) {
        const desc = skill.description.length > 50 ? skill.description.substring(0, 50) + "..." : skill.description;
        console.log(`    ${desc}`);
      }
    }
    console.log();
  }
}
function listRemote() {
  console.log(`${info("\u6B63\u5728\u83B7\u53D6\u8FDC\u7A0B\u6280\u80FD\u5217\u8868...")}`);
  console.log();
  fetch("https://codeskills.cn/api/skills").then((res) => {
    if (!res.ok) {
      throw new Error("\u83B7\u53D6\u5217\u8868\u5931\u8D25");
    }
    return res.json();
  }).then((skills) => {
    if (skills.length === 0) {
      console.log(warn("\u6682\u65E0\u8FDC\u7A0B\u6280\u80FD"));
      return;
    }
    console.log(info("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557"));
    console.log(info("\u2551         \u8FDC\u7A0B\u6280\u80FD\u5E02\u573A                 \u2551"));
    console.log(info("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D"));
    console.log();
    console.log(success(`\u5171 ${skills.length} \u4E2A\u6280\u80FD`));
    console.log();
    for (const skill of skills.slice(0, 30)) {
      console.log(`  ${success("\u25CF")} ${skill.name}`);
      if (skill.description) {
        const desc = skill.description.length > 60 ? skill.description.substring(0, 60) + "..." : skill.description;
        console.log(`    ${desc}`);
      }
      if (skill.tags) {
        const tags = Array.isArray(skill.tags) ? skill.tags.join(", ") : skill.tags;
        console.log(`    ${info("\u6807\u7B7E:")} ${tags}`);
      }
      console.log(`    ${info("\u5B89\u88C5:")} codeskills install ${skill.slug}`);
      console.log();
    }
    if (skills.length > 30) {
      console.log(warn(`...\u8FD8\u6709 ${skills.length - 30} \u4E2A\u6280\u80FD`));
    }
    console.log(`  ${info("\u6D4F\u89C8\u5168\u90E8:")} https://codeskills.cn`);
  }).catch((e) => {
    console.log(error(e.message));
  });
}

// src/main.ts
var [command, ...args] = process.argv.slice(2);
switch (command) {
  case "group":
  case "g":
    groupCommand(args);
    break;
  case "activate":
  case "a":
    activateCommand(args);
    break;
  case "status":
  case "s":
    statusCommand();
    break;
  case "install":
  case "i":
    installCommand(args);
    break;
  case "web":
    webCommand(args);
    break;
  case "search":
    searchCommand(args);
    break;
  case "list":
    listCommand(args);
    break;
  case "help":
  case "h":
  case void 0:
    help2();
    break;
  default:
    console.log(`
${info("Unknown command:")} ${command}
`);
    help2();
}
function help2() {
  console.log(info("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557"));
  console.log(info("\u2551         CodeSkills CLI \u5E2E\u52A9             \u2551"));
  console.log(info("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D"));
  console.log();
  console.log(info("\u5E38\u7528\u547D\u4EE4:"));
  console.log("  codeskills status              \u67E5\u770B\u72B6\u6001");
  console.log("  codeskills list                \u5217\u51FA\u672C\u5730\u6280\u80FD");
  console.log("  codeskills list --remote       \u6D4F\u89C8\u8FDC\u7A0B\u6280\u80FD");
  console.log("  codeskills search <\u5173\u952E\u8BCD>      \u641C\u7D22\u8FDC\u7A0B\u6280\u80FD");
  console.log("  codeskills install <\u6280\u80FD>      \u5B89\u88C5\u6280\u80FD");
  console.log("  codeskills activate <\u7EC4>      \u6FC0\u6D3B\u5206\u7EC4");
  console.log("  codeskills web                \u542F\u52A8 Web \u7BA1\u7406\u9762\u677F");
  console.log();
  console.log(info("\u5206\u7EC4\u7BA1\u7406:"));
  console.log("  codeskills group list          \u5217\u51FA\u6240\u6709\u5206\u7EC4");
  console.log("  codeskills group create <\u540D\u79F0>  \u521B\u5EFA\u5206\u7EC4");
  console.log("  codeskills group delete <\u540D\u79F0>  \u5220\u9664\u5206\u7EC4");
  console.log("  codeskills group rename <\u65E7\u540D> <\u65B0\u540D>  \u91CD\u547D\u540D\u5206\u7EC4");
  console.log("  codeskills group edit <\u540D\u79F0>   \u7F16\u8F91\u5206\u7EC4");
  console.log("  codeskills group add <\u6280\u80FD> [\u5206\u7EC4]  \u6DFB\u52A0\u6280\u80FD\u5230\u5206\u7EC4");
  console.log("  codeskills group remove <\u6280\u80FD> [\u5206\u7EC4]  \u4ECE\u5206\u7EC4\u79FB\u9664\u6280\u80FD");
  console.log("  codeskills group show <\u540D\u79F0>   \u663E\u793A\u5206\u7EC4\u8BE6\u60C5");
  console.log();
  console.log(info("\u9009\u9879:"));
  console.log("  -h, --help                     \u663E\u793A\u5E2E\u52A9");
  console.log();
}
