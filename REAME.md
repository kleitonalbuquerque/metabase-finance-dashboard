# 📊 Metabase Finance Dashboard

Projeto de **Business Intelligence (BI)** utilizando **Metabase**, com ingestão de dados financeiros reais via **API pública**, persistência em **PostgreSQL** e orquestração completa com **Docker**.

O objetivo é demonstrar uma **arquitetura real de dados**, separando claramente:
- ingestão
- armazenamento
- visualização

Tudo isso **sem frontend customizado**, usando apenas ferramentas de mercado.

---

## 🧱 Diagrama de Arquitetura

┌───────────────────────────┐
│      API Pública          │
│   Frankfurter (ECB)       │
│  Câmbio USD → BRL / EUR   │
└─────────────┬─────────────┘
              │
              │ HTTP (JSON)
              ▼
┌───────────────────────────┐
│   Ingestão (Node.js)      │
│                           │
│ - Axios (HTTP client)     │
│ - Retry / Backoff         │
│ - Validação da API        │
│ - Insert idempotente      │
└─────────────┬─────────────┘
              │
              │ SQL
              ▼
┌───────────────────────────┐
│     PostgreSQL 15         │
│                           │
│ - Histórico diário        │
│ - exchange_rates          │
│ - Chave primária composta │
└─────────────┬─────────────┘
              │
              │ JDBC
              ▼
┌───────────────────────────┐
│        Metabase           │
│                           │
│ - Perguntas salvas        │
│ - Dashboards              │
│ - Filtros interativos     │
└─────────────┬─────────────┘

🚀 Stack Utilizada
## Ingestão / Backend

- Node.js 20
- Axios
- pg

## Banco de Dados
- PostgreSQL 15

## BI / Analytics
- Metabase

## Infraestrutura

- Docker
- Docker Compose

# Estrutura

metabase-finance-dashboard/
│
├── docker-compose.yml
│
├── ingest/
│   ├── Dockerfile
│   ├── package.json
│   └── index.js
│
├── sql/
│   └── init.sql
│
└── README.md

▶️ Como Rodar o Projeto

## Pré-requisitos

- Docker
- Docker Compose


▶️ Rodar a ingestão inicial

```
docker compose down
docker compose up --build ingest
```

▶️ Subir o Metabase

```
docker compose up -d
```

▶️ Acesse: [http://localhost:3000](http://localhost:3000)

