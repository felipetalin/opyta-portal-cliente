# Portal Cliente Opyta (V1)

Base isolada de um portal cliente em Next.js + TypeScript para visualizacao analitica geoespacial, integrado ao Supabase com autenticacao real e Row-Level Security.

## Status

- ✅ Scaffold Next.js 16 + TypeScript pronto
- ✅ Autenticacao real com Supabase (Email/Password)
- ✅ RLS (Row-Level Security) configurado
- ✅ Rotas V1 implementadas
- ✅ Tipagem completa do banco
- ✅ Build validado sem erros

## Principios Centrais

- **Read-only por padrao**: sem importacao, consolidacao ou edicao
- **Sem cadastro publico**: autenticacao necessaria para acesso
- **Acesso controlado**: usuario ve apenas projetos autorizados (tabela `usuario_projetos`)
- **Seguranca em camadas**: RLS no banco + middleware no Next.js

## Arquitetura

```
src/
├── app/
│   ├── (public)
│   │   ├── login/              # Tela de autenticacao
│   │   └── page.tsx            # Redirect para login
│   ├── (protected)
│   │   ├── dashboard/          # Resumo de projetos
│   │   ├── projetos/           # Lista completa
│   │   └── projetos/[id]/      # Detalhe + mapa + KPIs
│   ├── api/auth/
│   │   ├── login/route.ts      # POST email/password → JWT
│   │   └── logout/route.ts     # POST → logout
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Estilos globais
│   └── middleware.ts           # Protecao de rotas
├── components/
│   ├── auth/login-form.tsx     # Formulario login real
│   ├── map/map-panel.tsx       # Painel de mapa (placeholder)
│   ├── ui/kpi-card.tsx         # Cards de indicadores
│   └── layout/app-shell.tsx    # Layout protegido
├── lib/
│   ├── supabase.ts             # Cliente Supabase
│   ├── auth.ts                 # Sessao + busca de projetos
│   ├── types.ts                # Tipos da aplicacao
│   ├── database.types.ts       # Tipos do Supabase (gerados)
│   ├── queries.ts              # Queries read-only
│   └── data/projects.ts        # Mock data (fallback)
```

## Rotas Protegidas

```
GET  /login                     # Acesso sem auth
POST /api/auth/login            # Login com email/senha
POST /api/auth/logout           # Logout
GET  /dashboard                 # [PROTEGIDO] Resumo
GET  /projetos                  # [PROTEGIDO] Lista
GET  /projetos/[id]             # [PROTEGIDO] Detalhe
```

## Autenticacao

### Login Real (Production-Ready)

1. Usuario insere email + senha em `/login`
2. Requisicao POST `/api/auth/login` valida no Supabase
3. JWT retornado e armazenado em cookie httpOnly
4. Middleware valida token em rotas protegidas
5. `getServerSession()` busca usuario + seus projetos autorizados
6. RLS garante isolamento de dados

### Credenciais de Teste

```
Email: demo@opyta.com
Senha: Demo@12345
```

**Nota**: Criar usuario no Supabase Dashboard ou via script SQL em `AUTENTICACAO.md`

## Instalacao Local

### Prerequisitos
- Node.js 20+
- npm 11+
- Supabase project ativo (zmmylgtdorzdkdxpmnvj)

### Setup Rápido

```powershell
# 1. Clonar/copiar para local disk (longe de Google Drive)
Copy-Item "g:\Meu Drive\Opyta_Data_Versão_Cliente" "C:\opyta-portal-local" -Recurse

# 2. Instalar dependências
cd C:\opyta-portal-local
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm install

# 3. Configurar .env (ja prenchido)
Copy-Item ".env.example" ".env.local"

# 4. Dev server
npm run dev
```

Acesse: **http://localhost:3000**

## Ambiente

### Variáveis (`.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zmmylgtdorzdkdxpmnvj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<generated-anon-key>

# Cookie
AUTH_COOKIE_NAME=opyta_portal_session
```

## Estrutura de Dados

### Tabelas Principais

| Tabela | Proposito |
|--------|-----------|
| `projetos` | Projetos geoespaciais |
| `pontos_coleta` | Locais de monitoramento |
| `usuario_projetos` | Mapeamento usuario → projetos (RLS) |

### Views (Read-Only)

| View | Dados |
|------|-------|
| `vw_geo_biota` | Dados biologicos + coordenadas |
| `vw_geo_fisico` | Dados fisico-quimicos + coordenadas |

## Build e Deploy

```powershell
# Validar tipos
npm run typecheck

# Build para producao
npm run build

# Iniciar servidor (modo producao)
npm start
```

## Proximos Passos (Roadmap)

- [ ] **Mapa Interativo**: Integrar Mapbox ou Leaflet para visualizacao geoespacial
- [ ] **Filtros Dinamicos**: Busca por projeto, periodo, parametro
- [ ] **Relatorios**: Download de dados em CSV/PDF
- [ ] **Graficos**: Tendencias temporais de indicadores
- [ ] **Swagger**: Documentacao OpenAPI para API interna
- [ ] **2FA**: Autenticacao de dois fatores
- [ ] **Audit Logs**: Registro de acessos e operacoes
- [ ] **Cache**: Redis para queries frequentes
- [ ] **E2E Tests**: Cypress ou Playwright

## Documentacao

- [AUTENTICACAO.md](./AUTENTICACAO.md) - Setup de auth real + RLS
- [Supabase Docs](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript](https://www.typescriptlang.org/docs/)

## Diferencas: Mock vs Real

| Aspecto | Mock | Real |
|---------|------|------|
| Auth | hardcoded `demo@opyta.com` | Supabase Auth |
| Dados | em memoria (`data/projects.ts`) | Supabase PostgreSQL |
| Filtros | sim, controlado manualmente | RLS automatico |
| Producao | nao recomendado | pronto |

## Aprendizados Reais (Integracao com Streamlit)

### 1) Fonte de dados correta muda o resultado
- O detalhe de projeto nao pode usar apenas `pontos_coleta` para representar analitica.
- Para ficar fiel ao Streamlit, o mapa e os filtros devem usar a base analitica (`vw_geo_biota` / consolidada), com agregacao por ponto e campanha.

### 2) Campanha do BI nao e `id_campanha`
- No fluxo analitico, a chave de filtro do usuario deve considerar `nome_campanha` (texto real exibido no BI), nao apenas IDs operacionais.
- Misturar `id_campanha` com `nome_campanha` gera filtros inconsistentes e opcoes "inexistentes" para o usuario.

### 3) Sessao autenticada precisa chegar nas queries
- Em rotas protegidas, consultas ao Supabase devem rodar no contexto do JWT do usuario.
- Sem contexto autenticado, o RLS pode retornar vazio mesmo com dados existentes.

### 4) Mapa "analitico" exige geoespacializacao do indicador
- Marcador simples nao reproduz comportamento do Streamlit.
- Para aderencia funcional: imagem satelite + simbolo proporcional ao indicador + legenda de escala + popup com metricas do ponto.

### 5) Problema visual de tiles pode mascarar dados corretos
- Leaflet pode renderizar area branca/cortada se o tamanho do mapa nao for invalidado apos montar.
- Solucao aplicada: `invalidateSize()` no mount e no resize.

### 6) Checklist de regressao para o detalhe do projeto
- [ ] Filtro usa `nome_campanha` real
- [ ] KPI vem de dataset analitico, nao de tabela operacional isolada
- [ ] Mapa usa base satelite e indicador selecionavel
- [ ] Popup mostra metricas analiticas do ponto
- [ ] Query executa com token do usuario (RLS)

### 7) Mapa quebrado com satelite: causa e correcoes
- Sintoma observado: imagem satelite "fragmentada" e pontos aparentemente ausentes, mesmo com coordenadas validas no banco.
- Causa principal: estilos base do Leaflet ausentes/incompletos no bundle global, afetando composicao de tiles e camadas.
- Correcao aplicada:
	- carregar `leaflet/dist/leaflet.css` em `src/app/globals.css`
	- manter regras essenciais de posicionamento das camadas `.leaflet-*`
	- reforcar contraste dos pontos no satelite (halo branco + preenchimento mais forte)
- Verificacao tecnica:
	- conferir lat/lon no BD antes de depurar UI
	- validar log do Next sem erro runtime do Leaflet
	- testar com `Ctrl+F5` apos restart limpo do dev server

## Troubleshooting

### "npm: command not found"
```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm -v  # Deve retornar versao
```

### "Erro ao buscar projetos"
- Valide usuario em tabela `usuario_projetos`
- Confirme RLS no Supabase Dashboard

### "Credenciais invarias"
- Usuario existe no Supabase Users?
- Email exatamente como cadastrado?
- Auto-confirm habilitado?

## Contato & Support

- Projeto: Portal Cliente Opyta V1
- Data: abril 2026
- Repositorio: isolado em C:\opyta-portal-local
- Codigo-fonte backup: g:\Meu Drive\Opyta_Data_Versão_Cliente

## License

Proprietary - Opyta Geoambiental
