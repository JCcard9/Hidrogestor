// Calcula o consumo de água/energia com base na leitura atual e na leitura anterior
const calcularConsumoIncremental = (leituraAtual, leituraAnterior = 0) => {
  const atual = Number(leituraAtual);
  const anterior = Number(leituraAnterior) || 0;

   // Se algum valor for inválido (não numérico) ou negativo, o consumo é considerado 0
  if (Number.isNaN(atual) || Number.isNaN(anterior) || atual <= 0 || anterior < 0) {
    return 0;
  }

  // O consumo é a diferença entre a leitura atual e a anterior
  const consumo = atual - anterior;
  return consumo > 0 ? consumo : 0;
};

// Calcula o valor da fatura com base no consumo, usando faixas (tarifas progressivas)
const calcularFatura = (consumo) => {
  const consumoNumerico = Number(consumo);

  // Se não houver consumo válido, cobra-se apenas a taxa mínima (20)
  if (Number.isNaN(consumoNumerico) || consumoNumerico <= 0) {
    return 20;
  }

  let valor = 0;

  // Faixa 1: primeiros 10 m³/kWh, a R$ 4,50 cada
  const faixa1 = Math.min(consumoNumerico, 10);
  valor += faixa1 * 4.5;

  // Faixa 2: de 10 até 25 (mais 15 unidades), a R$ 9,00 cada
  if (consumoNumerico > 10) {
    const faixa2 = Math.min(consumoNumerico - 10, 15);
    valor += faixa2 * 9;
  }

  // Faixa 3: de 25 até 50 (mais 25 unidades), a R$ 14,00 cada
  if (consumoNumerico > 25) {
    const faixa3 = Math.min(consumoNumerico - 25, 25);
    valor += faixa3 * 14;
  }

  // Faixa 4: acima de 50, a R$ 17,00 cada unidade excedente
  if (consumoNumerico > 50) {
    const faixa4 = consumoNumerico - 50;
    valor += faixa4 * 17;
  }

  // Soma a taxa mínima (20) com o valor calculado nas faixas, arredondando para 2 casas decimais
  return Number((20 + valor).toFixed(2));
};

module.exports = {
  calcularFatura,
  calcularConsumoIncremental
};
