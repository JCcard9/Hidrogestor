const db = require("../db");

// Busca as faturas de uma unidade consumidora, ordenadas por mês
const listarFaturas = async (id) => {
  const { rows } = await db.query(
    `SELECT fatura.nr_mes AS mesLido, fatura.vl_fatura AS valorFatura, fatura.dt_leitura AS dataLeitura
     FROM tb_fatura fatura
     WHERE fatura.nr_unidadeconsumidora = $1
     ORDER BY nr_mes ASC`,
    [id]
  );
  return rows;
};

// Mesma consulta, usada para gerar o CSV de exportação
const exportarFaturas = async (id) => {
  const { rows } = await db.query(
    `SELECT fatura.nr_mes AS mesLido, fatura.vl_fatura AS valorFatura, fatura.dt_leitura AS dataLeitura
     FROM tb_fatura fatura
     WHERE fatura.nr_unidadeconsumidora = $1
     ORDER BY nr_mes ASC`,
    [id]
  );
  return rows;
};

module.exports = {
  listarFaturas,
  exportarFaturas
};
