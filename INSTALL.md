# Portal Cliente Opyta — Instruções de Instalação e Troubleshooting

## ⚠️ Aviso: Google Drive sincronização e npm

A pasta `g:\Meu Drive\Opyta_Data_Versão_Cliente` está sincronizada com Google Drive.  
Isso causa bloqueios de I/O (EBADF) durante `npm install` e `pnpm install`.

### Solução recomendada

**Opção 1: Copiar para Drive Local (Recomendado)**

```powershell
# No PowerShell (admin)
Copy-Item -Path "g:\Meu Drive\Opyta_Data_Versão_Cliente" -Destination "C:\opyta-portal-local" -Recurse -Force
cd C:\opyta-portal-local
npm install
npm run dev
```

Acesse: http://localhost:3000

**Opção 2: Excluir node_modules do sincronismo**

1. Abra Google Drive Settings → Excluded folders
2. Marque `node_modules` como excluído do sincronismo
3. Rode `npm install` normalmente na pasta original

**Opção 3: Usar GitHub Codespaces**

Push o projeto para GitHub e desenvolva em um Codespace (ambiente Linux, sem conflito de sincronismo).

## Instalação pós-setup

```bash
node --version  # Deve ser v20+ (verificar)
npm --version

npm install      # Instala dependências
npm run build    # Valida build
npm run dev      # Inicia servidor em :3000
npm run typecheck # Verifica tipos TypeScript
```

## Estrutura do proyecto

```
src/
├── app/              # Next.js App Router (rotas)
│   ├── login/        # Autenticação demo
│   ├── dashboard/    # Dashboard resumido
│   ├── projetos/     # Lista de projetos
│   └── [id]/         # Detalhe de projeto com mapa
├── components/       # UI e Layout
│   ├── auth/
│   ├── layout/
│   ├── map/
│   └── ui/
├── lib/              # Lógica e tipos
│   ├── auth.ts       # Session e autorização
│   ├── types.ts      # Tipos TypeScript
│   └── data/
│       └── projects.ts # Base mock
└── globals.css       # Styles

middleware.ts        # Proteção de rotas
```

## Foco V1

✅ Read-only: sem cadastro, sem escrita, sem sincronização  
✅ Autenticado: demo@opyta.com acessa 2 projetos liberados  
✅ Mapa central: visualização em cada projeto  
✅ KPIs: indicadores de qualidade e cobertura  

## Próximos passos pós-build local

1. Integrar autenticação real (JWT do Supabase)
2. Conectar a base de dados read-only (Supabase RLS strict)
3. Integrar provider de mapa real (Mapbox/Leaflet)
4. Adicionar filtros e camadas geoespaciais
5. Deploy em Vercel (conectado ao GitHub)

## Suporte

- Documentação Next.js: https://nextjs.org/docs
- TypeScript: https://www.typescriptlang.org
- Supabase docs: https://supabase.com/docs
