const db = require("../db");
const { calcularFatura, calcularConsumoIncremental } = require("../utils");

// Cria uma nova leitura, calcula o consumo e gera a fatura correspondente
const criarLeitura = async ({ nr_unidadeconsumidora, qt_consumo, nr_mes, data_registro }) => {
  // Busca a leitura anterior mais recente da mesma unidade
  const previousReadingResult = await db.query(
    "SELECT qt_consumo FROM tb_leitura WHERE nr_unidadeconsumidora = $1 AND nr_mes < $2 ORDER BY nr_mes DESC LIMIT 1",
    [nr_unidadeconsumidora, nr_mes]
  );

  const previousConsumption = previousReadingResult.rows[0]?.qt_consumo ?? 0;
  const incrementalConsumption = calcularConsumoIncremental(qt_consumo, previousConsumption);

  // Grava a nova leitura no banco
  await db.query(
    "INSERT INTO tb_leitura(nr_unidadeconsumidora, qt_consumo, nr_mes, data_registro) VALUES($1, $2, $3, $4)",
    [nr_unidadeconsumidora, qt_consumo, nr_mes, data_registro]
  );

  // Calcula o valor da fatura com base no consumo incremental
  const valorFatura = calcularFatura(incrementalConsumption);

  // Grava a fatura gerada no banco
  await db.query(
    "INSERT INTO tb_fatura(nr_mes, vl_fatura, nr_unidadeconsumidora) VALUES($1, $2, $3)",
    [nr_mes, valorFatura, nr_unidadeconsumidora]
  );

  return { nr_mes, valorFatura };
};

// Lista as leituras de uma unidade consumidora
const listarLeituras = async (id) => {
  const { rows } = await db.query(
    "SELECT id_registroconsumo AS id, qt_consumo AS quantidadeConsumida, nr_mes AS mesLido, data_registro AS dataLeitura FROM tb_leitura WHERE nr_unidadeconsumidora = $1 ORDER BY nr_mes ASC",
    [id]
  );
  return rows;
};

// Mesma listagem, usada para gerar o CSV de exportação
const exportarLeituras = async (id) => {
  const { rows } = await db.query(
    "SELECT qt_consumo AS quantidadeConsumida, nr_mes AS mesLido, data_registro AS dataLeitura FROM tb_leitura WHERE nr_unidadeconsumidora = $1 ORDER BY nr_mes ASC",
    [id]
  );
  return rows;
};

// Exclui uma leitura e a fatura correspondente (mesma unidade e mês)
const excluirLeitura = async (id, nr_unidadeconsumidora, nr_mes) => {
  const leituraResult = await db.query(
    "DELETE FROM tb_leitura WHERE id_registroconsumo = $1 AND nr_unidadeconsumidora = $2 AND nr_mes = $3",
    [id, nr_unidadeconsumidora, nr_mes]
  );

   // Se não excluiu nenhuma leitura, não há o que excluir na fatura
  if (leituraResult.rowCount === 0) {
    return 0;
  }

  const faturaResult = await db.query(
    "DELETE FROM tb_fatura WHERE nr_unidadeconsumidora = $1 AND nr_mes = $2",
    [nr_unidadeconsumidora, nr_mes]
  );

  return leituraResult.rowCount + faturaResult.rowCount;
};

module.exports = {
  criarLeitura,
  listarLeituras,
  exportarLeituras,
  excluirLeitura
};
