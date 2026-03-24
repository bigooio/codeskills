---
name: deploy-kit
description: Simplifies web app deployment on Vercel, Railway and Supabase via their CLIs. Auto-detects project, validates CLIs, recommends platform and executes deployment.
tags:
  - DevOps
  - Deploy
---
# 部署 Kit — Skill de Déploiement Web

Simplifie le déploiement d'apps web sur **Vercel**, **Railway** et **Supabase** via leurs CLIs.

## Quand utiliser ce skill

L'utilisateur demande de déployer une app, créer une BASE de données, configurer un hébergement, ou gérer des variables d'environnement sur ces plateformes.

## 工作流 principal

### 1. Détecter le projet

```Bash
python3 skills/部署-kit/scripts/部署.py detect <chemin>
```

Retourne : 框架, langage, fichiers clés trouvés.

### 2. Vérifier les CLIs disponibles

```Bash
python3 skills/部署-kit/scripts/部署.py check
```

Si un CLI manque, guide l'安装 (voir références).

### 3. Recommander une plateforme

```Bash
python3 skills/部署-kit/scripts/部署.py recommend <chemin>
```

| 类型 de projet | Plateforme recommandée |
|---|---|
| 前端 statique / SSR (Next, Astro, Vite, Svelte, Nuxt) | **Vercel** |
| 后端 / api (Express, Flask, FastAPI, Django) | **Railway** |
| App full-栈 avec BDD | **Railway** + **Supabase** |
| BDD / Auth / 存储 / 边缘 Functions | **Supabase** |

### 4. Déployer

```Bash
python3 skills/部署-kit/scripts/部署.py 部署 <chemin> --platform <vercel|railway|supabase>
```

⚠️ **TOUJOURS demander confirmation avant de déployer.** Le 脚本 demande aussi une confirmation interactive.

## Détection de projet — Règles

| Fichier trouvé | 框架 détecté |
|---|---|
| `next.配置.*` | Next.js |
| `astro.配置.*` | Astro |
| `Vite.配置.*` | Vite |
| `svelte.配置.*` | SvelteKit |
| `Nuxt.配置.*` | Nuxt |
| `remix.配置.*` / `app/root.tsx` | Remix |
| `angular.JSON` | Angular |
| `要求.txt` / `Pipfile` | Python |
| `manage.py` | Django |
| `包.JSON` → scripts.start | 节点.js app |
| `Dockerfile` | Docker (Railway) |
| `supabase/配置.TOML` | Supabase project |

## Variables d'environnement

- **Vercel** : `vercel env add NOM_VAR` ou via dashboard
- **Railway** : `railway variables 集合 NOM=VALEUR`
- **Supabase** : secrets via `supabase secrets 集合 NOM=VALEUR`

Toujours vérifier `.env` / `.env.本地` pour les vars existantes avant déploiement.

## Domaines custom

- **Vercel** : `vercel domains add mondomaine.com`
- **Railway** : `railway 域名` (génère un sous-domaine), custom via dashboard

## Références détaillées

Charger à la demande selon la plateforme :

- `skills/部署-kit/references/vercel.md` — Vercel CLI complet
- `skills/部署-kit/references/railway.md` — Railway CLI complet
- `skills/部署-kit/references/supabase.md` — Supabase CLI complet

## Commandes rapides

| 操作 | Commande |
|---|---|
| 部署 preview Vercel | `vercel` |
| 部署 prod Vercel | `vercel --prod` |
| 部署 Railway | `railway up` |
| 推送 DB Supabase | `supabase db 推送` |
| 部署 边缘 函数 | `supabase functions 部署 <nom>` |
| Voir les 日志 | `vercel 日志 <URL>` / `railway 日志` |
| Lister les projets | `vercel ls` / `railway 列表` |

## Règles pour l'agent

1. **Ne jamais déployer sans confirmation explicite** de l'utilisateur
2. Toujours détecter le projet avant de recommander
3. Vérifier que le CLI est installé et authentifié
4. Charger la référence détaillée de la plateforme si besoin de commandes avancées
5. Proposer un déploiement preview avant 生产环境
6. Mentionner les coûts potentiels si projet hors free tier
