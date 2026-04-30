# CogniVerse ERP

ERP web interno da CogniVerse Agency, construido com Next.js 14, Prisma, NextAuth e PostgreSQL via Supabase.

## Stack

- Next.js 14 App Router
- TypeScript estrito
- Tailwind CSS
- Prisma ORM
- PostgreSQL via Supabase
- NextAuth com Credentials Provider
- Deploy na Vercel

## Seguranca

- Nunca versione `.env`, `.env.local`, `.env.production` ou qualquer credencial real.
- Use apenas [`.env.example`](C:/Users/nohat/Documents/Playground/.env.example) como modelo sem segredos.
- O usuario admin inicial e criado via seed com senha armazenada em hash `bcrypt`.
- `NEXTAUTH_SECRET`, `DATABASE_URL` e `DIRECT_URL` devem ser configurados somente nos ambientes locais e na Vercel.
- Ao subir para GitHub, revise se nao existe nenhum valor sensivel hardcoded em commits, scripts ou fixtures.

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variaveis de ambiente
cp .env.example .env.local

# 3. Aplicar migrations
npx prisma migrate dev --name init

# 4. Rodar seed
npx prisma db seed

# 5. Rodar em desenvolvimento
npm run dev
```

## Variaveis de ambiente

```env
# Supabase Postgres
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gerar com: openssl rand -base64 32"
```

Observacoes:

- `DATABASE_URL` deve apontar para a string de conexao usada pela aplicacao.
- `DIRECT_URL` deve apontar para a conexao direta do banco no Supabase, usada pelo Prisma em migrations.
- Em producao na Vercel, ajuste `NEXTAUTH_URL` para o dominio final do app.

## Seed inicial

- URL local: `http://localhost:3000`
- Email: `admin@cogniverse.com`
- Senha: `JGfferdCv232d@`

## Deploy com Supabase + Vercel

1. Criar o projeto Postgres no Supabase.
2. Copiar a connection string de pooling para `DATABASE_URL`.
3. Copiar a connection string direta para `DIRECT_URL`.
4. Configurar as variaveis `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET` e `NEXTAUTH_URL` na Vercel.
5. Executar as migrations antes ou durante o fluxo de release.
6. Rodar o seed apenas se quiser iniciar a base com dados padrao.

## Checklist antes de subir para GitHub

- Confirmar que `.env.local` nao esta versionado.
- Confirmar que as credenciais reais nao aparecem em arquivos do projeto.
- Conferir se o build passa com `npm run build`.
- Revisar se o repositorio contem apenas dados de demonstracao nao sensiveis.

## Scripts uteis

```bash
npm run dev
npm run build
npx prisma migrate dev --name init
npx prisma db seed
```
