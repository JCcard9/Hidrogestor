const bcrypt = require("bcrypt");
const db = require("../db");

// Lista todos os residentes cadastrados
const listarUsuarios = async () => {
  const { rows } = await db.query("SELECT * FROM tb_residente");
  return rows;
};

// Busca um residente pelo CPF
const buscarUsuarioPorCpf = async (cpf) => {
  const { rows } = await db.query(
    "SELECT * FROM tb_residente WHERE tx_cpf = $1",
    [cpf]
  );
  return rows[0];
};

// Cadastra um novo residente, criptografando a senha antes de salvar
const gravarNovoUsuario = async ({ nome, nr_unidadeconsumidora, cpf, tipo_usuario, senha, data_cadastro }) => {
  const senhaCriptografada = await bcrypt.hash(senha, 10);
  const query = `
    INSERT INTO tb_residente(tx_nome, nr_unidadeconsumidora, tx_cpf, tipo_usuario, tx_senha, data_cadastro)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING id_residente
  `;
  const values = [nome, nr_unidadeconsumidora, cpf, tipo_usuario, senhaCriptografada, data_cadastro];
  const result = await db.query(query, values);
  return result.rows[0];
};

// Verifica se o CPF já existe e conta quantos "contadores" (tipo_usuario 0) já estão cadastrados
const verificarDuplicatas = async (cpf) => {
  const cpfCheck = await db.query("SELECT COUNT(*) FROM tb_residente WHERE tx_cpf = $1", [cpf]);
  const contadorCheck = await db.query("SELECT COUNT(*) FROM tb_residente WHERE tipo_usuario = 0");

  return {
    cpf_existe: Number(cpfCheck.rows[0].count) > 0,
    total_contadores: Number(contadorCheck.rows[0].count)
  };
};

// Compara a senha informada com a senha criptografada armazenada
const verificarSenha = async (senha, senhaArmazenada) => {
  return bcrypt.compare(senha, senhaArmazenada);
};

// Atualiza os dados de um residente
const atualizarUsuario = async (id, { nome, nr_unidadeconsumidora, cpf }) => {
  const result = await db.query(
    "UPDATE tb_residente SET tx_nome = $1, nr_unidadeconsumidora = $2, tx_cpf = $3 WHERE id_residente = $4",
    [nome, nr_unidadeconsumidora, cpf, id]
  );
  return result.rowCount;
};

// Exclui um residente pelo id
const excluirUsuario = async (id) => {
  const result = await db.query(
    "DELETE FROM tb_residente WHERE id_residente = $1",
    [id]
  );
  return result.rowCount;
};

module.exports = {
  listarUsuarios,
  buscarUsuarioPorCpf,
  gravarNovoUsuario,
  verificarDuplicatas,
  verificarSenha,
  atualizarUsuario,
  excluirUsuario
};
