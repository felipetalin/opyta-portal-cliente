# Portal Cliente Opyta (V1)

Base inicial do portal cliente em Next.js + TypeScript, isolado do sistema atual.

## Estado atual validado

- Deploy publicado validado em `https://opyta-portal-cliente.vercel.app`.
- A versao publicada exibe tela de login com campos de email e senha.
- O acesso a `/projetos` sem sessao redireciona para `/login?next=/projetos`.
- O endpoint publicado `/api/auth/demo` continua respondendo com sucesso, indicando que ainda existe dependencia de fluxo demo no backend publicado.
- O endpoint publicado `/api/auth/logout` responde com redirecionamento para `/login`.
- O workspace local atual nao representa integralmente essa versao publicada; a divergencia conhecida esta principalmente na camada de autenticacao e na UX da tela de login.
- Ate que a paridade seja restabelecida, o deploy publicado deve ser tratado como referencia de comportamento visivel e o workspace local como base parcial de desenvolvimento.

Atualizacao de paridade local (2026-04-17):

- O login local foi ajustado para UX de email + senha e agora usa `/api/auth/login`.
- Foi mantida compatibilidade temporaria com fluxo legado demo para evitar quebra durante a convergencia.
- Validacao em producao: `/api/auth/login` responde (credenciais invalidas retornam 401) e `/api/auth/demo` permanece ativo (200 para `demo@opyta.com`).

## Principios

- Read-only por padrao: sem importacao, sem consolidacao, sem edicao.
- Sem cadastro publico.
- Acesso apenas a projetos autorizados.
- Mapa como elemento central da analise.

## Rotas V1

- `/login`
- `/dashboard`
- `/projetos`
- `/projetos/[id]`

## Versao de trabalho

- Referencia funcional atual: deploy em producao no Vercel.
- Referencia de codigo atual: workspace local em fase anterior ou paralela ao deploy publicado, com divergencia conhecida na autenticacao.
- Estado observado do deploy: experiencia de login mais avancada na interface, mas com indicio de compatibilidade legada via `/api/auth/demo`.
- Antes de novas melhorias estruturais, a prioridade e alinhar o repositorio local com a versao efetivamente publicada.

## Arquitetura

- `src/app`: rotas e composicao de pagina.
- `src/components`: componentes de UI e analitica.
- `src/lib`: tipos, auth e consulta de dados (read-only).

## Como rodar

1. Instale Node.js 20+.
2. Instale dependencias:

```bash
npm install
```

3. Copie `.env.example` para `.env.local` e ajuste valores.
4. Rode em desenvolvimento:

```bash
npm run dev
```

## Proximos passos recomendados

- Restabelecer paridade entre o deploy publicado e o codigo deste workspace, especialmente no fluxo de autenticacao.
- Identificar se a tela publicada de email e senha envia para um endpoint novo ou apenas encapsula o mesmo fluxo demo legado.
- Documentar a estrategia real de autenticacao em uso no deploy publicado e como ela se conecta a permissao por projeto.
- Integrar a fonte geoespacial read-only na mesma base de codigo alinhada ao deploy.
- Substituir o mapa mock por provider real (Mapbox/Leaflet) com controle de camada.
- Adicionar testes de rota, autenticacao e autorizacao para evitar nova divergencia entre ambiente publicado e workspace local.

## Plano de execucao (proximas etapas)

### Fase 1 - Paridade e baseline

Objetivo: garantir que o workspace local reflita com fidelidade o comportamento publicado.

Entregaveis:

- Inventario de diferencas entre deploy e workspace local (rotas, auth, formulario de login, middleware, estrutura de dados).
- Definicao da base oficial de codigo para trabalho continuo (branch/repo/versao).
- Atualizacao do README com a referencia unica de versao para evitar novos desvios.

Criterio de concluido:

- Fluxo local de login e rotas protegidas com o mesmo comportamento observado no deploy.

Status:

- Em andamento: endpoint local `/api/auth/login` e formulario de email/senha ja aplicados.
- Confirmado: deploy oficial mantem endpoints em paralelo (`/api/auth/login` e `/api/auth/demo`).
- Proxima acao para fechamento da fase: definir data de corte para desativar `/api/auth/demo` e migrar totalmente para `/api/auth/login`.
- Controle de corte adicionado localmente: variavel `AUTH_DEMO_ENABLED` para desligar o endpoint legado por ambiente sem alterar codigo.
- Hardening adicionado no login: `AUTH_ALLOW_LEGACY_LOGIN_FALLBACK` controla se `/api/auth/login` pode aceitar fallback legado quando credenciais explicitas nao estiverem configuradas.

### Procedimento de corte do legado (homolog -> producao)

1. Homolog: configurar `AUTH_ALLOW_LEGACY_LOGIN_FALLBACK=false` e manter `AUTH_DEMO_ENABLED=true` por uma janela curta de observacao.
2. Validar que o login continua funcional apenas com credenciais configuradas (`AUTH_LOGIN_EMAIL` e `AUTH_LOGIN_PASSWORD`).
3. Homolog: configurar `AUTH_DEMO_ENABLED=false` e validar que `/api/auth/demo` retorna erro de endpoint descontinuado.
4. Producao: repetir a configuracao final (`AUTH_ALLOW_LEGACY_LOGIN_FALLBACK=false` e `AUTH_DEMO_ENABLED=false`).
5. Encerrar Fase 1 somente apos smoke test de login, logout e rotas protegidas (`/dashboard`, `/projetos`, `/projetos/[id]`).

### Fase 2 - Auth unica e controle de acesso por projeto

Objetivo: consolidar autenticacao real e autorizacao por projeto em um unico fluxo.

Entregaveis:

- Remocao de dependencia demo no login e sessao.
- Sessao server-side validada de forma consistente em paginas e APIs.
- Modelo de permissao por projeto centralizado (base para versao Cliente e ADM).

Criterio de concluido:

- Usuario autenticado acessa apenas projetos autorizados; usuario sem permissao recebe bloqueio consistente.

### Fase 3 - Estrutura Cliente x ADM

Objetivo: separar claramente o que e uso de cliente e o que e administracao de acessos.

Entregaveis:

- Rotas de cliente mantidas em foco read-only (dashboard, projetos, detalhe).
- Rotas ADM para gestao de usuarios, projetos e vinculos de acesso.
- Regra de papeis documentada (ex.: admin, cliente) e aplicada nas rotas.

Criterio de concluido:

- ADM consegue gerenciar acessos sem SQL manual; cliente so enxerga o que foi liberado.

### Fase 4 - Dados geoespaciais e mapa real

Objetivo: trocar base mock por dados reais e visualizacao geoespacial robusta.

Entregaveis:

- Fonte geoespacial read-only integrada.
- Provider de mapa real com camadas e filtros.
- KPIs alimentados por dados reais e nao por mocks estaticos.

Criterio de concluido:

- Detalhe do projeto apresenta mapa e indicadores consistentes com a fonte oficial de dados.

### Fase 5 - Qualidade e operacao

Objetivo: criar seguranca de evolucao e rotina de deploy confiavel.

Entregaveis:

- Testes de autenticacao, autorizacao e rotas protegidas.
- Checklist de pre-deploy (build, typecheck, variaveis de ambiente, smoke test).
- Registro de versao implantada e evidencias minimas de validacao.

Criterio de concluido:

- Toda release passa por checklist e nao regride comportamento de acesso.

## Ordem sugerida de execucao imediata

1. Fechar Fase 1 (paridade).
2. Entrar na Fase 2 (auth e permissao por projeto).
3. Abrir Fase 3 (ADM x Cliente) sem bloquear as fases 4 e 5.

## Historico de execucao

### 2026-04-17

- Reavaliacao do deploy publicada em `https://opyta-portal-cliente.vercel.app`, com confirmacao de login com email+senha na UI e redirecionamento de rotas protegidas para login sem sessao.
- Confirmacao de coexistencia de endpoints em producao: `/api/auth/login` ativo e `/api/auth/demo` ainda ativo.
- Implementacao local da tela de login com email+senha em `src/components/auth/login-form.tsx` e integracao na pagina `src/app/login/page.tsx`.
- Criacao de rota local `src/app/api/auth/login/route.ts` para fluxo de login padronizado.
- Inclusao de controles de transicao por ambiente em `.env.example`: `AUTH_DEMO_ENABLED` e `AUTH_ALLOW_LEGACY_LOGIN_FALLBACK`.
- Hardening do endpoint legado em `src/app/api/auth/demo/route.ts` com bloqueio configuravel via `AUTH_DEMO_ENABLED`.
- Registro no README do procedimento de corte homolog -> producao para desativar legado com seguranca.
- Verificacao operacional apos alerta de indisponibilidade: aplicacao respondeu normalmente em web e endpoints de auth no momento da checagem.
- Inicializacao do repositorio Git local e commit base para versionamento da etapa.
- Vinculo do projeto local com Vercel via `npx vercel link`.
- Deploy de producao executado com alias em `https://opyta-portal-cliente.vercel.app`.
- Correcao de build Next.js 16 na rota de login com `Suspense` em `src/app/login/page.tsx` apos erro de prerender com `useSearchParams`.