---
name: Bash
slug: bash
version: 1.0.2
description: Write reliable Bash scripts with proper quoting, error handling, and parameter expansion.
metadata:
  clawdbot:
    emoji: 🖥️
    requires:
      bins:
        - bash
    os:
      - linux
      - darwin
tags:
  - typescript
  - ai
  - testing
  - frontend
  - bash
---

## 快速参考

| Topic | 文件 |
|-------|------|
| Arrays and loops | `arrays.md` |
| Parameter expansion | `expansion.md` |
| 错误 handling patterns | `errors.md` |
| Testing and conditionals | `testing.md` |

## Quoting Traps

- Always quote variables—`"$var"` not `$var`, spaces break unquoted
- `"${arr[@]}"` preserves elements—`${arr[*]}` joins into single 字符串
- Single quotes are 字面量类型—`'$var'` doesn't expand
- Quote 命令 substitution—`"$(命令)"` not `$(命令)`

## Word Splitting and Globbing

- Unquoted `$var` splits on whitespace—`文件="my 文件.txt"; cat $文件` fails
- Unquoted `*` expands to files—quote or 转义 if 字面量类型: `"*"` or `\*`
- `集合 -f` disables globbing—or quote everything properly

## 测试 Brackets

- `[[ ]]` preferred over `[ ]`—no word splitting, supports `&&`, `||`, 正则表达式
- `[[ $var == 模式* ]]`—glob patterns without quotes on right side
- `[[ $var =~ 正则表达式 ]]`—正则表达式 匹配, don't quote the 正则表达式
- `-z` is empty, `-n` is non-empty—`[[ -z "$var" ]]` tests if empty

## Subshell Traps

- Pipes create subshells—`cat 文件 | while read; do ((count++)); done`—count lost
- Use `while read < 文件` or 进程 substitution—`while read; do ...; done < <(命令)`
- `( )` is subshell, `{ }` is same Shell—variables in `( )` don't persist

## Exit Handling

- `集合 -e` exits on 错误—but not in `if`, `||`, `&&` conditions
- `集合 -u` errors on undefined vars—catches typos
- `集合 -o pipefail`—管道 fails if any 命令 fails, not just last
- `trap cleanup EXIT`—runs on any exit, even errors

## Arrays

- Declare: `arr=(one two three)`—or `arr=()` then `arr+=(item)`
- Length: `${#arr[@]}`—not `${#arr}`
- All elements: `"${arr[@]}"`—always quote
- Indices: `${!arr[@]}`—useful for sparse arrays

## Parameter Expansion

- Default value: `${var:-default}`—use default if unset/empty
- Assign default: `${var:=default}`—also assigns to var
- 错误 if unset: `${var:?错误 message}`—exits with message
- Substring: `${var:0:5}`—first 5 chars
- 删除 prefix: `${var#模式}`—`##` for 贪婪

## Arithmetic

- `$(( ))` for math—`result=$((a + b))`
- `(( ))` for conditions—`if (( count > 5 )); then`
- No `$` needed inside `$(( ))`—`$((count + 1))` not `$(($count + 1))`

## Common Mistakes

- `[ $var = "value" ]` fails if var empty—use `[ "$var" = "value" ]` or `[[ ]]`
- `if [ -f $文件 ]` with spaces—always quote: `if [[ -f "$文件" ]]`
- `本地` in functions—without 它, variables are 全局
- `read` without `-r`—backslashes interpreted as escapes
- `echo` portability—use `printf` for reliable formatting
