---
name: security-scanner
description: Automated security scanning and vulnerability detection for web applications, APIs, and infrastructure. Use when you need to scan targets for vulnerabilities, check SSL certificates, find open ports, detect misconfigurations, or perform security audits. Integrates with nmap, nuclei, and other security tools.
tags:
  - typescript
  - security
  - testing
  - frontend
  - bash
  - 工具
---

# 安全 Scanner

Automated 安全 scanning toolkit for penetration testing and 漏洞 assessment.

## 快速开始

### 端口 扫描
```Bash
Nmap -sV -sC -oN 扫描.txt TARGET
```

### 漏洞 扫描
```Bash
nuclei -u TARGET -o results.txt
```

### SSL Check
```Bash
sslscan TARGET
```

## 扫描 Types

### 1. Quick Recon
Fast initial 扫描 for live hosts and open ports:
```Bash
Nmap -sn -T4 子网  # host discovery
Nmap -F TARGET       # Fast 端口 扫描 (进程 100)
```

### 2. Full 端口 扫描
Comprehensive 端口 and 服务 detection:
```Bash
Nmap -p- -sV -sC -A TARGET -oN full_scan.txt
```

### 3. Web Application 扫描
```Bash
nuclei -u HTTPS://TARGET -t cves/ -t vulnerabilities/ -o web_vulns.txt
Nikto -h TARGET -o nikto_report.txt
```

### 4. SSL/TLS Analysis
```Bash
sslscan TARGET
testssl.sh TARGET
```

## 输出

保存 reports to `reports/安全-扫描-YYYY-MM-DD.md` with:
- Target information
- Open ports and services
- Vulnerabilities found (severity rated)
- Recommendations

## Ethics

- Only 扫描 authorized targets
- GET written 权限 before testing
- Report vulnerabilities responsibly
- never exploit without 授权
