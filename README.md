
# Paggo - OCR Case - Frontend

Este é o frontend do projeto **Paggo - OCR Case**, uma aplicação web desenvolvida em **Next.js** que permite aos usuários autenticados fazer upload de documentos (notas fiscais), visualizar os documentos processados por OCR e interagir com explicações geradas por LLMs (Modelos de Linguagem).

## 🧩 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [NextAuth.js](https://next-auth.js.org/) (Autenticação)
- TypeScript

## ⚙️ Funcionalidades Implementadas

- ✅ Tela de Login e Registro de Conta
- ✅ Feedback para erros de login (mensagens de erro)
- ✅ Confirmação visual de conta criada com sucesso
- ✅ Dashboard com listagem dos documentos do usuário
- ✅ Upload de novos documentos (com autenticação)
- ✅ Visualização do texto extraído do documento (OCR)
- ✅ Visualização das respostas do LLM com explicações sobre o documento
- ✅ Download do documento com texto OCR e explicações LLM (botão)

## 🧪 Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/paggo-ocr-frontend.git
cd paggo-ocr-frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo (ajuste as URLs conforme necessário):

```
REACT_APP_API_URL=http://localhost:3002
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta
```

### 4. Inicie a aplicação

```bash
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

## 🧠 Estrutura de Pastas

```
/app              # Páginas e rotas da aplicação (Next.js App Router)
/components       # Componentes reutilizáveis (botões, inputs, cartões)
/services         # Serviços (como chamadas à API)
/lib              # Funções auxiliares
/public           # Arquivos públicos
/styles           # Estilos globais (Tailwind)
```

## 🚀 Deploy

Recomendado usar [Vercel](https://vercel.com/) para deploy da aplicação Next.js.

---

Feito por Pedro.
