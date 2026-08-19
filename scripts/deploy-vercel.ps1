# 一键部署到 Vercel（不走 GitHub）
# 用法：在 E:\个人网站 目录里运行 pwsh -File scripts\deploy-vercel.ps1

$ErrorActionPreference = 'Stop'
$env:NODE_TLS_REJECT_UNAUTHORIZED = '0'

Write-Host ''
Write-Host '================================================' -ForegroundColor Cyan
Write-Host '  Vercel 一键部署脚本' -ForegroundColor Cyan
Write-Host '  项目：瞿达炎 · 个人网站' -ForegroundColor Cyan
Write-Host '================================================' -ForegroundColor Cyan
Write-Host ''

# 1. 检查 vercel CLI
Write-Host '[1/4] 检查 Vercel CLI...' -ForegroundColor Yellow
$vercel = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercel) {
  Write-Host '  Vercel CLI 未安装，正在安装...' -ForegroundColor Yellow
  npm install -g vercel 2>&1 | Out-Null
  $vercel = Get-Command vercel -ErrorAction SilentlyContinue
  if (-not $vercel) {
    Write-Host '  ❌ 安装失败，请手动运行: npm install -g vercel' -ForegroundColor Red
    exit 1
  }
}
Write-Host "  ✅ Vercel CLI: $($vercel.Source)" -ForegroundColor Green

# 2. 检查登录
Write-Host ''
Write-Host '[2/4] 检查 Vercel 登录状态...' -ForegroundColor Yellow
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host '  未登录，需要登录' -ForegroundColor Yellow
  Write-Host '  即将打开浏览器进行 Vercel 授权...' -ForegroundColor Yellow
  Write-Host ''
  vercel login
  if ($LASTEXITCODE -ne 0) {
    Write-Host '  ❌ 登录失败' -ForegroundColor Red
    exit 1
  }
}
Write-Host "  ✅ 当前账号: $($whoami -join ' ')" -ForegroundColor Green

# 3. 部署
Write-Host ''
Write-Host '[3/4] 开始部署到生产环境...' -ForegroundColor Yellow
Write-Host '  (首次部署会让你确认几个项目配置，一路回车即可)' -ForegroundColor Gray
Write-Host ''

vercel --prod --yes

if ($LASTEXITCODE -ne 0) {
  Write-Host ''
  Write-Host '  ❌ 部署失败，请把上面的错误信息发给我' -ForegroundColor Red
  exit 1
}

Write-Host ''
Write-Host '================================================' -ForegroundColor Green
Write-Host '  🎉 部署成功！' -ForegroundColor Green
Write-Host '================================================' -ForegroundColor Green
Write-Host ''
Write-Host '  复制上面的 Production URL，访问你的网站。' -ForegroundColor Cyan
Write-Host ''