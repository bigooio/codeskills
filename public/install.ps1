#!/usr/bin/env pwsh
#
# CodeSkills CLI Windows 安装脚本
# 用法:
#   irm https://codeskills.cn/install.ps1 | iex
#   or
#   powershell -Command "irm https://codeskills.cn/install.ps1 | iex"
#

param(
    [string]$Source = "github"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CodeSkills CLI Installer (Windows)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is required but not installed." -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

$nodeVersion = node --version
Write-Host "[OK] Node.js $nodeVersion" -ForegroundColor Green

# Determine source
if ($Source -eq "gitcode") {
    $RAW_URL = "https://gitcode.com/codeskills/codeskills/raw/develop/packages/skills-cli/bin/skills.js"
    $LABEL = "GitCode"
} else {
    $RAW_URL = "https://raw.githubusercontent.com/bigooio/codeskills/develop/packages/skills-cli/bin/skills.js"
    $LABEL = "GitHub"
}

Write-Host "[INFO] Source: $LABEL" -ForegroundColor Cyan

# Install directory
$INSTALL_DIR = "$env:USERPROFILE\.local\bin"
$CLI_PATH = "$INSTALL_DIR\codeskills.cmd"

# Create directory if not exists
if (-not (Test-Path $INSTALL_DIR)) {
    New-Item -ItemType Directory -Path $INSTALL_DIR -Force | Out-Null
}

Write-Host "[INFO] Downloading CLI..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri $RAW_URL -OutFile $CLI_PATH -UseBasicParsing
} catch {
    Write-Host "[ERROR] Download failed: $_" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $CLI_PATH) -or (Get-Content $CLI_PATH -Raw).Length -lt 100) {
    Write-Host "[ERROR] Download failed or file is invalid." -ForegroundColor Red
    exit 1
}

Write-Host "[OK] CLI installed to $CLI_PATH" -ForegroundColor Green

# Create .cmd wrapper for Windows (Node.js scripts need a wrapper)
$WRAPPER_PATH = "$INSTALL_DIR\codeskills.cmd"
$wrapperContent = "@echo off`nnode `"%~dp0codeskills.js`" %*"
Set-Content -Path $WRAPPER_PATH -Value $wrapperContent -Encoding ASCII

# Add to PATH if not already
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*\.local\bin*") {
    [Environment]::SetEnvironmentVariable(
        "Path",
        "$userPath;$INSTALL_DIR",
        "User"
    )
    Write-Host "[OK] Added $INSTALL_DIR to PATH" -ForegroundColor Green
    Write-Host "[INFO] Please restart your terminal or run: refreshenv" -ForegroundColor Yellow
} else {
    Write-Host "[OK] PATH already contains .local\bin" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Installation complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Usage:"
Write-Host "  codeskills list              - List all skills"
Write-Host "  codeskills search <keyword>  - Search skills"
Write-Host "  codeskills install <name>     - Install a skill"
Write-Host "  codeskills help              - Show help"
Write-Host ""
Write-Host "Note: Restart your terminal or refresh environment for changes to take effect." -ForegroundColor Yellow
