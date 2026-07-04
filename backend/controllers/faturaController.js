const faturaService = require("../services/faturaService");
const { Parser } = require("json2csv");

// Lista as faturas de um residente pelo id
const listarFaturas = async (req, res) => {
  const id = req.params.id;

  try {
    const rows = await faturaService.listarFaturas(id);
    if (rows.length === 0) return res.status(404).json({ error: "Residente não encontrado" });
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar faturas:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Exporta as faturas de um residente em formato CSV
const exportarFaturas = async (req, res) => {
  const id = req.params.id;

  try {
    const rows = await faturaService.exportarFaturas(id);

    if (rows.length == 0) {
      return res.status(204).end();
    }

    // Converte o JSON retornado em CSV
    const json = rows;
    const parser = new Parser();
    const csv = parser.parse(json);

    res.header("Content-Type", "text/csv");
    res.attachment(`faturas_${id}.csv`);
    return res.send(csv);
  } catch (err) {
    console.error("Erro ao exportar faturas:", err);
    res.status(500).json({ error: "Erro ao gerar CSV" });
  }
};

module.exports = {
  listarFaturas,
  exportarFaturas
};
