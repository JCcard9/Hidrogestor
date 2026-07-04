const usuarioService = require("../services/usuarioService");

// Lista todos os usuários (residentes) cadastrados
const listarUsuarios = async (req, res) => {
  try {
    const rows = await usuarioService.listarUsuarios();
    if (rows.length === 0) return res.status(404).json({ error: "Residente não encontrado" });
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar usuários:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Autentica o usuário pelo CPF e senha
const login = async (req, res) => {
  const { cpf, senha } = req.body;

  try {
    const usuario = await usuarioService.buscarUsuarioPorCpf(cpf);

    if (!usuario) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const senhaValida = await usuarioService.verificarSenha(senha, usuario.tx_senha);

    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Remove a senha antes de devolver os dados do usuário
    delete usuario.tx_senha;

    return res.json({
      message: "Login bem-sucedido",
      usuario
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Cadastra um novo usuário
const gravarNovoUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.gravarNovoUsuario(req.body);
    res.json({
      message: "Novo usuário adicionado",
      id: usuario.id_residente
    });
  } catch (err) {
    // Código 23505 = violação de chave única (CPF ou unidade já existentes)
    if (err.code === "23505") {
      return res.status(400).json({ error: "CPF ou Unidade Consumidora já cadastrados" });
    }

    console.error("Erro ao gravar novo usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Verifica se já existe um usuário cadastrado com o mesmo CPF
const verificarDuplicatas = async (req, res) => {
  try {
    const result = await usuarioService.verificarDuplicatas(req.body.cpf);
    res.json(result);
  } catch (err) {
    console.error("Erro ao verificar duplicatas:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Atualiza os dados de um residente já cadastrado
const atualizarUsuario = async (req, res) => {
  const id = req.params.id;
  const { nome, nr_unidadeconsumidora, cpf } = req.body;

  if (!nome || !nr_unidadeconsumidora || !cpf) {
    return res.status(400).json({ error: "Nome, unidade e CPF são obrigatórios" });
  }

  try {
    const rowCount = await usuarioService.atualizarUsuario(id, req.body);

    if (rowCount === 0) return res.status(404).json({ error: "Residente não encontrado" });

    res.json({ message: "Residente atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar residente:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Exclui um residente pelo id
const excluirUsuario = async (req, res) => {
  const id = req.params.id;

  try {
    const rowCount = await usuarioService.excluirUsuario(id);

    if (rowCount === 0) return res.status(404).json({ error: "Residente não encontrado" });

    res.json({ message: "Residente excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir residente:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  listarUsuarios,
  login,
  gravarNovoUsuario,
  verificarDuplicatas,
  atualizarUsuario,
  excluirUsuario
};
