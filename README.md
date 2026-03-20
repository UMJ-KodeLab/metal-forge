# Metal Forge - E-Commerce de CDs de Heavy Metal

Sistema e-commerce completo especializado na venda de CDs de heavy metal, com visual tematico dark/metal.

## Stack

- **Frontend:** React (Vite) + React Router + Axios + React Toastify
- **Backend:** Node.js + Express + Sequelize ORM
- **Banco de Dados:** SQLite (dev) / PostgreSQL (prod)
- **Autenticacao:** JWT (JSON Web Tokens) + bcryptjs
- **Pagamento:** MercadoPago SDK
- **Upload:** Multer

## Funcionalidades

- Catalogo com 61 CDs de 12 subgeneros do metal
- Filtros por genero, faixa de preco e busca por texto
- Ordenacao por preco, nome e data
- Carrinho de compras persistente
- Lista de desejos (Wishlist)
- Autenticacao de usuarios (registro/login)
- Integracao com MercadoPago para pagamentos
- Painel administrativo completo:
  - Dashboard com metricas
  - CRUD de produtos com upload de capa
  - CRUD de generos customizaveis
  - Gerenciamento de pedidos
- Capas de CD geradas em SVG com cores por genero
- Design responsivo com tema dark/metal

## Subgeneros Incluidos

Thrash Metal, Death Metal, Black Metal, Power Metal, Doom Metal, Speed Metal, Heavy Metal, Metalcore, Symphonic Metal, Progressive Metal, Folk Metal, Nu Metal

## Como Rodar

### Pre-requisitos

- Node.js 18+
- npm

### Backend

```bash
cd server
npm install
cp .env.example .env  # Configurar variaveis de ambiente
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
node scripts/generate-covers.js  # Gerar capas dos CDs
npm run dev
```

O servidor inicia na porta **5000**.

### Frontend

```bash
cd client
npm install
npm run dev
```

O frontend inicia na porta **5173**.

### Com Docker (PostgreSQL)

```bash
docker-compose up -d  # Sobe o PostgreSQL
```

## Variaveis de Ambiente (server/.env)

```env
PORT=5000
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d
NODE_ENV=development

# MercadoPago (opcional)
MERCADOPAGO_ACCESS_TOKEN=seu_token
MERCADOPAGO_PUBLIC_KEY=sua_chave_publica

# PostgreSQL (producao)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=metalforge
DB_USER=metalforge
DB_PASSWORD=metalforge123
```

## Usuarios Padrao

| Email | Senha | Role |
|-------|-------|------|
| admin@metalforge.com | admin123 | Admin |

## API Endpoints

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | /api/auth/register | Cadastro |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Perfil |
| GET | /api/products | Listar produtos |
| GET | /api/products/:id | Detalhe do produto |
| POST | /api/products | Criar produto (admin) |
| PUT | /api/products/:id | Editar produto (admin) |
| DELETE | /api/products/:id | Remover produto (admin) |
| GET | /api/genres | Listar generos |
| POST | /api/genres | Criar genero (admin) |
| PUT | /api/genres/:id | Editar genero (admin) |
| DELETE | /api/genres/:id | Remover genero (admin) |
| GET | /api/cart | Ver carrinho |
| POST | /api/cart/items | Adicionar item |
| PUT | /api/cart/items/:id | Alterar quantidade |
| DELETE | /api/cart/items/:id | Remover item |
| GET | /api/wishlist | Listar wishlist |
| POST | /api/wishlist | Adicionar a wishlist |
| DELETE | /api/wishlist/:productId | Remover da wishlist |
| POST | /api/orders | Criar pedido |
| GET | /api/orders | Listar pedidos |
| GET | /api/orders/:id | Detalhe do pedido |
| PUT | /api/orders/:id/status | Atualizar status (admin) |
| POST | /api/payment/create-preference | Criar pagamento |
| POST | /api/payment/webhook | Webhook MercadoPago |
| GET | /api/admin/dashboard | Dashboard (admin) |
| GET | /api/admin/orders | Todos os pedidos (admin) |

## Estrutura do Projeto

```
metal-forge/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # ProductCard, Header, Footer
│   │   ├── pages/             # Home, Catalog, Cart, Admin...
│   │   ├── context/           # AuthContext, CartContext
│   │   ├── services/          # API (axios)
│   │   └── styles/            # Tema global dark/metal
│   └── package.json
├── server/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # DB, env
│   │   ├── controllers/       # Logica dos endpoints
│   │   ├── middleware/        # Auth JWT, upload
│   │   ├── models/            # Sequelize models
│   │   └── routes/            # Express routes
│   ├── migrations/            # Sequelize migrations
│   ├── seeders/               # Dados iniciais
│   ├── scripts/               # Gerador de capas SVG
│   └── package.json
└── docker-compose.yml         # PostgreSQL (opcional)
```

## Licenca

MIT
