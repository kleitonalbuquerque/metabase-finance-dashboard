import axios from "axios";
import pg from "pg";

/**
 * Utilitário simples para esperar
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Conecta no Postgres com retry
 */
async function connectWithRetry() {
  const maxRetries = 10;
  const delayMs = 2000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = new pg.Client({
        host: "postgres",
        port: 5432,
        user: "metabase",
        password: "metabase",
        database: "finance",
      });

      await client.connect();
      console.log("✅ Conectado ao Postgres");
      return client;
    } catch (error) {
      console.log(
        `⏳ Tentativa ${attempt}/${maxRetries} - aguardando Postgres...`
      );
      console.error("Erro ao conectar ao Postgres:", error.message);
      await sleep(delayMs);
    }
  }

  throw new Error("❌ Não foi possível conectar ao Postgres");
}

/**
 * Execução principal
 */
async function main() {
  let client;

  try {
    // 1️⃣ Conectar ao banco
    client = await connectWithRetry();

    // 2️⃣ Buscar dados na API (Frankfurter)
    const response = await axios.get(
      "https://api.frankfurter.app/2024-01-01..2024-01-31",
      {
        params: {
          from: "USD",
          to: "BRL,EUR",
        },
      }
    );

    if (!response.data?.rates) {
      console.error("❌ Resposta inesperada da API:", response.data);
      process.exit(1);
    }

    const rates = response.data.rates;

    // 3️⃣ Inserir dados
    let inserted = 0;

    for (const [date, currencies] of Object.entries(rates)) {
      for (const [currency, rate] of Object.entries(currencies)) {
        await client.query(
          `
          INSERT INTO exchange_rates
          (date, base_currency, target_currency, rate)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT DO NOTHING
          `,
          [date, "USD", currency, rate]
        );

        inserted++;
      }
    }

    console.log(`✅ Ingestão finalizada (${inserted} registros processados)`);
  } catch (error) {
    console.error("❌ Erro na ingestão:", error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
      console.log("🔌 Conexão com Postgres encerrada");
    }
  }
}

// ▶️ Executar
await main();
