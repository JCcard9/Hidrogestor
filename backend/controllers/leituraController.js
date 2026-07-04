const leituraService = require("../services/leituraService");
const { Parser } = require("json2csv");

// Grava uma nova leitura (e gera a fatura correspondente)
const gravarNovaLeitura = async (req, res) => {
  try {
    const result = await leituraService.criarLeitura(req.body);
    res.json({ message: "Nova leitura e fatura adicionadas com sucesso", result });
  } catch (err) {
    console.error("Erro ao gravar nova leitura:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Lista as leituras de um residente pelo id
const listarLeituras = async (req, res) => {
  const id = req.params.id;

  try {
    const rows = await leituraService.listarLeituras(id);

    if (rows.length === 0) return res.status(404).json({ error: "Leitura não encontrada" });

    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar leitura:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Exporta as leituras de um residente em formato CSV
const exportarLeituras = async (req, res) => {
  const id = req.params.id;

  try {
    const rows = await leituraService.exportarLeituras(id);

    if (rows.length == 0) {
      return res.status(204).end();
    }

    const json = rows;
    const parser = new Parser();
    const csv = parser.parse(json);

    res.header("Content-Type", "text/csv");
    res.attachment(`leituras_${id}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error("Erro ao exportar leituras:", err);
    res.status(500).json({ error: "Erro ao gerar CSV" });
  }
};

// Exclui uma leitura específica (e sua fatura) com base na unidade e no mês
const excluirLeitura = async (req, res) => {
  const id = req.params.id;
  const { nr_unidadeconsumidora, nr_mes } = req.body;

  try {
    const result = await leituraService.excluirLeitura(id, nr_unidadeconsumidora, nr_mes);

    if (result === 0) {
      return res.status(404).json({ error: "Leitura não encontrada" });
    }

    res.json({ message: "Leitura e fatura excluídas com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir leitura:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  gravarNovaLeitura,
  listarLeituras,
  exportarLeituras,
  excluirLeitura
};
