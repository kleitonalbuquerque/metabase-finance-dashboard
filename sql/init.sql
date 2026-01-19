CREATE TABLE IF NOT EXISTS exchange_rates (
  date DATE NOT NULL,
  base_currency VARCHAR(10) NOT NULL,
  target_currency VARCHAR(10) NOT NULL,
  rate NUMERIC NOT NULL,
  PRIMARY KEY (date, base_currency, target_currency)
);
