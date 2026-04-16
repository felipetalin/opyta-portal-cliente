# Portal Cliente Opyta (V1)

Base isolada de um portal cliente em Next.js + TypeScript para visualizacao analitica geoespacial, integrado ao Supabase com autenticacao real e Row-Level Security.

## Status

- ✅ Scaffold Next.js 16 + TypeScript pronto
- ✅ Autenticacao real com Supabase (Email/Password)
- ✅ RLS (Row-Level Security) configurado
- ✅ Rotas V1 implementadas
- ✅ Tipagem completa do banco
- ✅ Build validado sem erros
- ✅ Publicado no GitHub (baseline demo)
- ✅ Deploy inicial no Vercel concluido
- ✅ Identidade visual Opyta aplicada (logo, paleta verde/dourado, tipografia, icones)
- ✅ Login oficial com email/senha real habilitado
- ✅ Dashboard e lista de projetos com dados reais autorizados
- ✅ Dashboard com cards por projeto (cliente, status, local e datas)
- ✅ Lista de projetos com nome da empresa cliente
- ✅ Mapa Leaflet funcional em producao (CSS, altura, satelite, marcadores)
- ✅ URL de producao estavel identificada e validada com usuario real

## Fonte Oficial do Projeto

### Regra de trabalho (a partir de agora)
- **Fonte unica da verdade**: repositório GitHub.
- Evolucao funcional, ajustes e hotfixes devem partir da branch do repositório (nao de copias locais paralelas).
- Qualquer mudanca feita localmente deve ser commitada e enviada antes de novo deploy.

### Repositorio oficial
- GitHub: https://github.com/felipetalin/opyta-portal-cliente
- Tag de referencia para apresentacao: `v0.3-demo-analitico`

### Ambiente local recomendado
- Pasta de trabalho: `C:\opyta-portal-local`
- Backups em Google Drive sao historicos e nao devem ser usados como base primária de desenvolvimento.

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

### Deploy oficial (Vercel)

1. Importar o repositorio `felipetalin/opyta-portal-cliente` no Vercel (preset Next.js).
2. Definir variáveis de ambiente (Production/Preview/Development):

```env
NEXT_PUBLIC_APP_NAME=Portal Cliente Opyta
NEXT_PUBLIC_SUPABASE_URL=https://zmmylgtdorzdkdxpmnvj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-supabase>
AUTH_COOKIE_NAME=opyta_portal_session
```

3. Executar deploy de produção.
4. Se o link abrir com redirecionamento para `vercel.com/sso-api`, desativar proteção de autenticação em Production (Deployment Protection) para acesso público.

### Publicacao de versao (recomendado)

```powershell
git add .
git commit -m "feat: <resumo-da-entrega>"
git push origin main

# opcional: marcar marco de demonstracao
git tag -a vX.Y.Z -m "<descricao-curta>"
git push origin vX.Y.Z
```

## Proximas Etapas para Continuidade

### Proxima etapa para retomada (primeira acao ao voltar)

**Etapa foco**: implementar o detalhe do projeto em `/projetos/[id]` com base analitica real (`vw_geo_biota`).

**Escopo minimo desta retomada**:
- carregar dados do projeto autenticado
- renderizar mapa Leaflet com pontos geoespacializados
- habilitar filtro por `nome_campanha`
- exibir popup do ponto com indicador, campanha, data e valor

**Criterio de pronto**:
- abrir um projeto em `/projetos/[id]` e visualizar pontos no mapa
- trocar campanha no filtro e observar atualizacao dos pontos
- manter acesso restrito por usuario (RLS + projetos autorizados)

### Prioritario (proximo ciclo de trabalho)

- [x] **Lista de projetos aprimorada**: exibir nome do cliente/empresa junto ao nome do projeto para facilitar identificacao
- [ ] **Detalhe do projeto (`/projetos/[id]`)**: implementar pagina de detalhe com mapa Leaflet + KPI cards + filtro por campanha usando dados analiticos reais (`vw_geo_biota`)
- [ ] **Filtro de campanha no mapa**: dropdown `nome_campanha` para controlar quais pontos aparecem no mapa do detalhe
- [ ] **Popup analitico no mapa**: ao clicar num marcador, exibir metricas do ponto (indicador, campanha, data, valor)
- [x] **UX do dashboard**: adicionar cards de resumo por projeto (cliente, status, local e datas) para ampliar valor da pagina inicial

### Liberacao de acesso para clientes reais

Este e o fluxo operacional para ativar um novo cliente no portal sem expor o sistema a cadastros nao autorizados.

**Principio**: nenhum cliente se cadastra sozinho. A Opyta controla 100% dos acessos.

#### Passo a passo para liberar um cliente

```
1. Criar usuario no Supabase
   - Supabase Dashboard → Authentication → Users → Invite user
   - Informar e-mail do cliente; o Supabase envia convite com link de definicao de senha
   - Alternativa (via SQL):
     SELECT supabase_admin.create_user('{"email":"cliente@empresa.com","password":"SenhaTemporaria@1","email_confirm":true}');

2. Obter o UUID do usuario criado
   - Authentication → Users → copiar o `user_id` (UUID)

3. Vincular usuario aos projetos autorizados
   INSERT INTO usuario_projetos (user_id, projeto_id)
   VALUES
     ('<uuid-do-cliente>', <id-projeto-1>),
     ('<uuid-do-cliente>', <id-projeto-2>);

4. Validar acesso
   - Logar com as credenciais do cliente em: https://opyta-portal-cliente.vercel.app/login
   - Confirmar que apenas os projetos corretos aparecem no dashboard
   - Confirmar que o mapa e os detalhes carregam sem erro

5. Enviar credenciais ao cliente (e-mail seguro)
   - URL de acesso: https://opyta-portal-cliente.vercel.app
   - E-mail: <email-cadastrado>
   - Senha temporaria (orientar a trocar no primeiro acesso)
```

#### Revogar ou alterar acesso

```sql
-- Remover todos os projetos de um usuario
DELETE FROM usuario_projetos WHERE user_id = '<uuid>';

-- Remover acesso a projeto especifico
DELETE FROM usuario_projetos WHERE user_id = '<uuid>' AND projeto_id = <id>;

-- Desativar usuario (sem excluir)
-- Supabase Dashboard → Authentication → Users → selecionar → Ban user
```

#### Meta: painel interno de gerenciamento de acessos (medio prazo)

- [ ] Tela `/admin/usuarios` (acesso restrito a role `admin`) para criar/vincular/revogar usuarios sem usar SQL manual
- [ ] Envio automatico de e-mail de boas-vindas com credenciais apos vinculacao
- [ ] Log de ultimo acesso por usuario exibido no painel admin

### Medio prazo

- [ ] **Dominio customizado**: configurar dominio `portal.opyta.com.br` no Vercel (requer acesso ao DNS)
- [ ] **Graficos de tendencia**: evolucao temporal de indicadores por ponto/campanha
- [ ] **Download de dados**: exportar filtros ativos como CSV/PDF

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
	- carregar `leaflet/dist/leaflet.css` no componente client `src/components/map/map-with-leaflet.tsx`
	- manter regras essenciais de posicionamento das camadas `.leaflet-*`
	- reforcar contraste dos pontos no satelite (halo branco + preenchimento mais forte)
- Verificacao tecnica:
	- conferir lat/lon no BD antes de depurar UI
	- validar log do Next sem erro runtime do Leaflet
	- testar com `Ctrl+F5` apos restart limpo do dev server

### 8) Build Vercel pode falhar em `/login` com `useSearchParams`
- Sintoma observado: `useSearchParams() should be wrapped in a suspense boundary at page "/login"`.
- Causa principal: componente client com `useSearchParams` renderizado sem `Suspense` na pagina App Router.
- Correcao aplicada:
	- envolver o formulario de login com `<Suspense fallback=...>` em `src/app/login/page.tsx`.
- Prevencao:
	- sempre que usar hooks de navegacao client (`useSearchParams`, `usePathname`) em rota App Router, validar boundary de `Suspense`.

### 9) Dashboard/lista vazios com login ok: mismatch de fonte de dados
- Sintoma observado: autenticacao funciona, mas dashboard/projetos aparecem vazios.
- Causa principal: pagina consultando mock (`data/projects.ts`) com IDs `p-1001...`, enquanto autorizacoes reais usam IDs numericos em `usuario_projetos`.
- Correcao aplicada:
	- dashboard e lista migrados para queries reais (`getProjetosByIds`) com IDs autorizados da sessao.
- Prevencao:
	- para ambiente oficial, nao usar mock como fonte primaria de paginas protegidas.

### 10) URL de deploy vs URL oficial
- URL de deploy individual (com hash/sufixo) muda a cada publicacao.
- URL oficial de producao permanece estavel e deve ser a unica compartilhada com clientes/socios.
- Procedimento:
	- verificar status `Ready` + `Current` no Vercel antes de validar com usuario final.

### 11) Enriquecimento de contexto no dashboard e lista
- Sintoma observado: usuario via projeto, mas sem contexto suficiente de cliente e cronograma para decidir rapidamente.
- Causa principal: cards exibiam dados minimos (nome/ID), sem `nome_empresa` e sem bloco visual de datas no dashboard.
- Correcao aplicada:
   - criada query `getProjetosWithCliente` para combinar projetos autorizados com `clientes.nome_empresa`.
   - dashboard evoluido para cards por projeto com cliente, status, local e datas.
   - lista de projetos alinhada ao mesmo padrao visual e informacional.
- Prevencao:
   - manter telas protegidas com contexto minimo de negocio (cliente + status + tempo) para evitar regressao de usabilidade.

## Troubleshooting

### "Deploy abre pagina SSO da Vercel"
- Causa: proteção de autenticação ativa no deployment de produção.
- Ajuste: Vercel Project Settings -> Deployment Protection -> liberar acesso público para Production.

### "Mapa satelite fragmentado ou sem pontos"
- Confirmar CSS base do Leaflet carregado no client map (`src/components/map/map-with-leaflet.tsx`).
- Validar coordenadas no banco (`latitude`/`longitude` nao nulas) para o projeto selecionado.
- Fazer hard refresh (`Ctrl+F5`) após deploy/restart.

### "Build Vercel falha em /login com useSearchParams"
- Garantir `Suspense` envolvendo o formulario/painel que usa `useSearchParams`.
- Confirmar build local com `npm run build` antes do push.

### "Login funciona, mas dashboard/projetos vazios"
- Confirmar que as paginas usam query real no Supabase (nao mock local).
- Verificar se o usuario possui registros em `usuario_projetos`.
- Conferir se IDs autorizados da sessao sao convertidos para numero antes da query `.in("id_projeto", ids)`.

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
- Repositorio oficial: https://github.com/felipetalin/opyta-portal-cliente
- Workspace local recomendado: C:\opyta-portal-local
- Codigo-fonte backup (historico): g:\Meu Drive\Opyta_Data_Versão_Cliente

## License

Proprietary - Opyta Geoambiental
