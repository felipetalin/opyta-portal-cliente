# Setup de Autenticação Real - Portal Cliente Opyta

## Overview
O portal agora suporta autenticação real via **Supabase Auth** com Row-Level Security (RLS) para filtrar projetos por usuário.

---

## 1. Habilitar Autenticação no Supabase Dashboard

1. Acesse: https://supabase.com/dashboard/project/zmmylgtdorzdkdxpmnvj/settings/auth
2. Vá para **Providers > Email**
3. Habilite "Email Session"
4. Configure:
   - ✓ Confirm email (recomendado para produção)
   - Auto-confirm users (útil para teste)

---

## 2. Criar Usuários de Teste

No **Supabase Dashboard → Authentication → Users**, clique em "Add User":

```
Email: demo@opyta.com
Password: Demo@12345
```

---

## 3. Autorizar Usuário a Projetos

No **SQL Editor** do Supabase, execute:

```sql
-- Inserir permissoes de acesso do usuario a projetos
INSERT INTO usuario_projetos (id_usuario, id_projeto)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'demo@opyta.com'),
  1  -- ID do projeto a autorizar
);

-- Para visualizar todos os projetos autorizados:
SELECT up.*, p.nome_projeto, u.email
FROM usuario_projetos AS up
JOIN projetos AS p ON up.id_projeto = p.id_projeto
JOIN auth.users AS u ON up.id_usuario = u.id;
```

---

## 4. Atualizar Variáveis de Ambiente

Seu `.env.local` ja contem as chaves corretas:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zmmylgtdorzdkdxpmnvj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (read-only)
AUTH_COOKIE_NAME=opyta_portal_session
```

---

## 5. Rotas da Autenticação

### POST `/api/auth/login`
Faz login com email/senha reais no Supabase.

**Request:**
```json
{
  "email": "demo@opyta.com",
  "password": "Demo@12345"
}
```

**Response:**
```json
{
  "ok": true
}
```

A sessão é armazenada em cookie httpOnly `opyta_portal_session`.

### POST `/api/auth/logout`
Remove o cookie de sessão e redireciona para `/login`.

---

## 6. Fluxo de Sessão

1. Usuario faz login → `/api/auth/login`
2. Token JWT armazenado em cookie seguro
3. Middleware verifica token em rotas protegidas
4. `getServerSession()` busca usuário + seus projetos autorizados
5. RLS do banco garante que usuario só vê seus projetos

---

## 7. Row-Level Security (RLS)

A tabela `projetos` tem RLS ativa:

```sql
-- Usuarios só conseguem SELECT projetos que estão em usuario_projetos
WHERE id_projeto IN (
  SELECT id_projeto FROM usuario_projetos 
  WHERE id_usuario = auth.uid()
)
```

---

## 8. Testar Localmente

### Terminal 1: Dev Server
```powershell
cd C:\opyta-portal-local
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm run dev
```

Acesse: http://localhost:3000

### Terminal 2: Inspecionar Cookies
```powershell
# No navegador, abra DevTools → Application → Cookies
# Procure por opyta_portal_session com o token JWT
```

---

## 9. Estrutura de Dados

### Tabela: `usuario_projetos`
```sql
CREATE TABLE usuario_projetos (
  id UUID PRIMARY KEY,
  id_usuario UUID (references auth.users),
  id_projeto INTEGER (references projetos),
  criado_em TIMESTAMP
);
```

Essa tabela mapeia cada usuário aos projetos que ele pode visualizar.

---

## 10. Próximos Passos

- [ ] Integrar Supabase Auth UI para registro de usuarios
- [ ] Adicionar suporte a SSO (Google, GitHub)
- [ ] Implementar 2FA (Two-Factor Authentication)
- [ ] Logs de acesso e auditoria
- [ ] Resetar senha via email
- [ ] Integrar mapa interativo com dados reais (Mapbox/Leaflet)

---

## Troubleshooting

**"Credenciais invalidas"**
- Verifique email/senha no Supabase Users
- Confirme que auto-confirm está habilitado se usando Confirm Email

**"Erro ao buscar projetos do usuario"**
- Valide que usuario está em `usuario_projetos`
- Verifique RLS policies no banco

**"Sessao expirou"**
- Token dura 7 dias por padrão
- Implemente refresh token para sessoes longas

---

## Documentação Oficial

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
