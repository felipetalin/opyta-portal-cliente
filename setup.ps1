#!/usr/bin/env pwsh

# Setup rápido do Portal Cliente Opyta
# Execute este script para preparar o ambiente completo

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup - Portal Cliente Opyta" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 1. Node.js
Write-Host "1. Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = & "C:\Program Files\nodejs\node.exe" -v 2>$null
if ($nodeVersion) {
    Write-Host "✓ Node.js $nodeVersion encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js nao encontrado. Instale via: winget install OpenJS.NodeJS.LTS" -ForegroundColor Red
    exit 1
}

# 2. Pasta do projeto
Write-Host ""
Write-Host "2. Localizando projeto..." -ForegroundColor Yellow
if (Test-Path "C:\opyta-portal-local") {
    Write-Host "✓ Pasta encontrada em C:\opyta-portal-local" -ForegroundColor Green
} else {
    Write-Host "✗ Pasta nao encontrada. Copie o projeto para C:\opyta-portal-local" -ForegroundColor Red
    exit 1
}

# 3. Dependências
Write-Host ""
Write-Host "3. Instalando/validando dependências..." -ForegroundColor Yellow
$env:Path = "C:\Program Files\nodejs;" + $env:Path
Set-Location "C:\opyta-portal-local"

$npm = & "C:\Program Files\nodejs\npm.cmd" -v 2>$null
if ($npm) {
    Write-Host "✓ npm versão $npm disponível" -ForegroundColor Green
    & npm install --silent 2>&1 | Out-Null
    Write-Host "✓ Dependências prontas" -ForegroundColor Green
} else {
    Write-Host "✗ npm nao disponível" -ForegroundColor Red
    exit 1
}

# 4. Validação TypeScript
Write-Host ""
Write-Host "4. Validando TypeScript..." -ForegroundColor Yellow
$tsResult = & npm run typecheck 2>&1 | Select-String "tsc"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Tipagem correta" -ForegroundColor Green
} else {
    Write-Host "✗ Erros de tipo encontrados (veja acima)" -ForegroundColor Red
}

# 5. Build final
Write-Host ""
Write-Host "5. Construindo para produção..." -ForegroundColor Yellow
$buildResult = & npm run build 2>&1 | Select-String "successfully"
if ($buildResult) {
    Write-Host "✓ Build sucesso" -ForegroundColor Green
} else {
    Write-Host "✗ Erro na compilacao" -ForegroundColor Red
    exit 1
}

# 6. Dev Server
Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write- Host "SETUP COMPLETO!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar o servidor de desenvolvimento:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  cd C:\opyta-portal-local" -ForegroundColor White
Write-Host "  \$env:Path = 'C:\Program Files\nodejs;' + \$env:Path" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Acesse: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credenciais de teste:" -ForegroundColor Yellow
Write-Host "  Email: demo@opyta.com" -ForegroundColor White
Write-Host "  Senha: Demo@12345" -ForegroundColor White
Write-Host ""
Write-Host "Leia AUTENTICACAO.md para setup completo" -ForegroundColor Cyan
