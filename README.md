# Dex BRA

PWA de coleção pessoal de cartas Pokémon, com valores de mercado da Liga BRA.

## Como rodar

```bash
cd liga-pokedex
cp .env.example .env
npm install
npm run dev
```

Abre em `http://localhost:5174` (ou a próxima porta livre).

## Integração com a liga_bra

Com `VITE_USE_MOCK=false` o app usa a API:

- Login Keycloak da Liga (`/auth/login?return_to=...`) e JWT no Dex
- `GET /api/v1/userCollections` para listar
- `POST /api/v1/userCollections/add_to_collection` para cadastrar/atualizar quantidade
- `DELETE /api/v1/userCollections/{id}` para remover
- `POST /api/v1/1/products/paginate` para buscar cartas
- `GET /api/v1/get-conditions/card` para condições

Na liga_bra, defina:

```
DEX_BRA_ORIGINS=http://localhost:5174,http://localhost:5175
```

Para voltar ao layout de demonstração: `VITE_USE_MOCK=true`.
