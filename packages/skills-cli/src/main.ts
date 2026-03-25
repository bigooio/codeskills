import { groupCommand } from './commands/group'
import { activateCommand } from './commands/activate'
import { statusCommand } from './commands/status'
import { installCommand } from './commands/install'
import { webCommand } from './commands/web'
import { searchCommand } from './commands/search'
import { listCommand } from './commands/list'
import { info } from './utils'

const [command, ...args] = process.argv.slice(2)

switch (command) {
  case 'group':
  case 'g':
    groupCommand(args)
    break
  case 'activate':
  case 'a':
    activateCommand(args)
    break
  case 'status':
  case 's':
    statusCommand()
    break
  case 'install':
  case 'i':
    installCommand(args)
    break
  case 'web':
    webCommand(args)
    break
  case 'search':
    searchCommand(args)
    break
  case 'list':
    listCommand(args)
    break
  case 'help':
  case 'h':
  case undefined:
    help()
    break
  default:
    console.log(`\n${info('Unknown command:')} ${command}\n`)
    help()
}

function help() {
  console.log(info('╔═══════════════════════════════════════════╗'))
  console.log(info('║         CodeSkills CLI 帮助             ║'))
  console.log(info('╚═══════════════════════════════════════════╝'))
  console.log()
  console.log(info('常用命令:'))
  console.log('  codeskills status              查看状态')
  console.log('  codeskills list                列出本地技能')
  console.log('  codeskills list --remote       浏览远程技能')
  console.log('  codeskills search <关键词>      搜索远程技能')
  console.log('  codeskills install <技能>      安装技能')
  console.log('  codeskills activate <组>      激活分组')
  console.log('  codeskills web                启动 Web 管理面板')
  console.log()
  console.log(info('分组管理:'))
  console.log('  codeskills group list          列出所有分组')
  console.log('  codeskills group create <名称>  创建分组')
  console.log('  codeskills group delete <名称>  删除分组')
  console.log('  codeskills group rename <旧名> <新名>  重命名分组')
  console.log('  codeskills group edit <名称>   编辑分组')
  console.log('  codeskills group add <技能> [分组]  添加技能到分组')
  console.log('  codeskills group remove <技能> [分组]  从分组移除技能')
  console.log('  codeskills group show <名称>   显示分组详情')
  console.log()
  console.log(info('选项:'))
  console.log('  -h, --help                     显示帮助')
  console.log()
}
