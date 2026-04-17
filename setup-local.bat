@echo off
REM Copia portal para drive local, instala dependencias e valida

setlocal enabledelayedexpansion

set SOURCE=g:\Meu Drive\Opyta_Data_Versão_Cliente
set TARGET=C:\opyta-portal-local
set PATH=C:\Program Files\nodejs;%PATH%

echo.
echo ====================================================
echo Portal Cliente Opyta - Setup Local
echo ====================================================
echo.

if exist "%TARGET%" (
  echo Pasta destino ja existe. Removendo...
  rmdir /s /q "%TARGET%"
)

echo Copiando arquivos do projeto (excluindo node_modules)...
xcopy "%SOURCE%" "%TARGET%" /E /I /Y /EXCLUDE:%SOURCE%\copy-exclude.txt 2>nul || (
  echo Copiando sem arquivo de exclusao...
  xcopy "%SOURCE%" "%TARGET%" /E /I /Y
)

cd /d "%TARGET%" || (
  echo ERRO: Nao foi possivel acessar %TARGET%
  pause
  exit /b 1
)

echo.
echo Verificando Node.js...
node --version || (
  echo ERRO: Node.js nao encontrado. Instale a partir de https://nodejs.org/
  pause
  exit /b 1
)

echo.
echo Instalando dependencias (pode levar alguns minutos)...
call npm install --no-audit --no-fund || (
  echo ERRO: npm install falhou
  pause
  exit /b 1
)

echo.
echo Validando TypeScript...
call npm run typecheck || (
  echo AVISO: Existem erros de tipo. Revisar se necessario.
)

echo.
echo ====================================================
echo: Sucesso! Projeto pronto em: %TARGET%
echo ====================================================
echo.
echo Proximo passo: npm run dev
echo.
pause
