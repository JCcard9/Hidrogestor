const request = require('supertest');
const bcrypt = require('bcrypt');

const mockQuery = jest.fn();

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: mockQuery
  }))
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));

mockQuery.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });
const app = require('./server');

beforeEach(() => {
  mockQuery.mockReset();
  bcrypt.compare.mockReset();
  bcrypt.hash.mockReset();
});

describe('server.js endpoints', () => {
  test('GET /listarUsuarios returns users', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id_residente: 1, tx_nome: 'João' }] });

    const response = await request(app).get('/listarUsuarios');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id_residente: 1, tx_nome: 'João' }]);
    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM tb_residente');
  });

  test('GET /listarUsuarios returns 404 when no users are found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get('/listarUsuarios');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Residente não encontrado' });
  });

  test('POST /login succeeds with valid credentials', async () => {
    const user = { tx_senha: 'hashed-senha', tx_cpf: '123' };

    mockQuery.mockResolvedValueOnce({ rows: [user] });
    bcrypt.compare.mockResolvedValueOnce(true);

    const response = await request(app)
      .post('/login')
      .send({ cpf: '123', senha: 'senha' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Login bem-sucedido',
      usuario: expect.objectContaining({ tx_cpf: '123' })
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('senha', 'hashed-senha');
  });

  test('POST /login returns 401 for unknown user', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .post('/login')
      .send({ cpf: '999', senha: 'senha' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Credenciais inválidas' });
  });

  test('POST /login returns 401 for invalid password', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ tx_senha: 'hashed-senha' }] });
    bcrypt.compare.mockResolvedValueOnce(false);

    const response = await request(app)
      .post('/login')
      .send({ cpf: '123', senha: 'senha' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Credenciais inválidas' });
  });

  test('POST /gravarNovoUsuario returns id on success', async () => {
    bcrypt.hash.mockResolvedValueOnce('hashed-senha');
    mockQuery.mockResolvedValueOnce({ rows: [{ id_residente: 42 }] });

    const response = await request(app)
      .post('/gravarNovoUsuario')
      .send({
        nome: 'Maria',
        nr_unidadeconsumidora: '1001',
        cpf: '12345678900',
        tipo_usuario: 1,
        senha: 'senha',
        data_cadastro: '2026-06-28'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Novo usuário adicionado',
      id: 42
    });
    expect(bcrypt.hash).toHaveBeenCalledWith('senha', 10);
  });

  test('POST /gravarNovoUsuario returns 400 for duplicate key', async () => {
    bcrypt.hash.mockResolvedValueOnce('hashed-senha');
    const duplicateError = new Error('duplicate');
    duplicateError.code = '23505';
    mockQuery.mockRejectedValueOnce(duplicateError);

    const response = await request(app)
      .post('/gravarNovoUsuario')
      .send({
        nome: 'Maria',
        nr_unidadeconsumidora: '1001',
        cpf: '12345678900',
        tipo_usuario: 1,
        senha: 'senha',
        data_cadastro: '2026-06-28'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'CPF ou Unidade Consumidora já cadastrados' });
  });

  test('POST /verificarDuplicatas returns boolean and counter', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ count: '1' }] });
    mockQuery.mockResolvedValueOnce({ rows: [{ count: '3' }] });

    const response = await request(app)
      .post('/verificarDuplicatas')
      .send({ cpf: '12345678900' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ cpf_existe: true, total_contadores: 3 });
  });

  test('PUT /atualizarUsuario/:id returns success when updated', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });

    const response = await request(app)
      .put('/atualizarUsuario/5')
      .send({ nome: 'Paulo', nr_unidadeconsumidora: '2002', cpf: '11122233344' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Residente atualizado com sucesso' });
  });

  test('PUT /atualizarUsuario/:id returns 404 when not found', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });

    const response = await request(app)
      .put('/atualizarUsuario/999')
      .send({ nome: 'Paulo', nr_unidadeconsumidora: '2002', cpf: '11122233344' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Residente não encontrado' });
  });

  test('DELETE /excluirUsuario/:id returns success when deleted', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });

    const response = await request(app).delete('/excluirUsuario/6');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Residente excluído com sucesso' });
  });

  test('DELETE /excluirUsuario/:id returns 404 when not found', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });

    const response = await request(app).delete('/excluirUsuario/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Residente não encontrado' });
  });

  test('DELETE /excluirLeitura/:id removes reading and invoice', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });

    const response = await request(app)
      .delete('/excluirLeitura/7')
      .send({ nr_unidadeconsumidora: '100', nr_mes: 2 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Leitura e fatura excluídas com sucesso' });
  });

  test('GET /listarFaturas/:id returns invoices', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ mesLido: 1, valorFatura: 100.5, dataLeitura: '2026-06-01' }] });

    const response = await request(app).get('/listarFaturas/10');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ mesLido: 1, valorFatura: 100.5, dataLeitura: '2026-06-01' }]);
  });

  test('GET /listarFaturas/:id returns 404 when no invoices', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get('/listarFaturas/10');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Residente não encontrado' });
  });

  test('POST /gravarNovaLeitura creates first month reading and invoice', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    mockQuery.mockResolvedValueOnce({});
    mockQuery.mockResolvedValueOnce({});

    const response = await request(app)
      .post('/gravarNovaLeitura')
      .send({ nr_unidadeconsumidora: '100', qt_consumo: 10, nr_mes: 1, data_registro: '2026-06-28' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Nova leitura e fatura adicionadas com sucesso',
      result: { nr_mes: 1, valorFatura: 65 }
    });
  });

  test('POST /gravarNovaLeitura calculates invoice based on previous month difference', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ qt_consumo: 30 }] });
    mockQuery.mockResolvedValueOnce({});
    mockQuery.mockResolvedValueOnce({});

    const response = await request(app)
      .post('/gravarNovaLeitura')
      .send({ nr_unidadeconsumidora: '100', qt_consumo: 50, nr_mes: 2, data_registro: '2026-07-01' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Nova leitura e fatura adicionadas com sucesso',
      result: { nr_mes: 2, valorFatura: 155 }
    });
    expect(mockQuery).toHaveBeenLastCalledWith(
      'INSERT INTO tb_fatura(nr_mes, vl_fatura, nr_unidadeconsumidora) VALUES($1, $2, $3)',
      [2, 155, '100']
    );
  });

  test('POST /gravarNovaLeitura includes minimum tariff for small consumptions', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    mockQuery.mockResolvedValueOnce({});
    mockQuery.mockResolvedValueOnce({});

    const response = await request(app)
      .post('/gravarNovaLeitura')
      .send({ nr_unidadeconsumidora: '100', qt_consumo: 1, nr_mes: 3, data_registro: '2026-08-01' });

    expect(response.status).toBe(200);
    expect(mockQuery).toHaveBeenLastCalledWith(
      'INSERT INTO tb_fatura(nr_mes, vl_fatura, nr_unidadeconsumidora) VALUES($1, $2, $3)',
      [3, 24.5, '100']
    );
  });

  test('POST /gravarNovaLeitura charges progressive tariff for 27 cubic meters', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    mockQuery.mockResolvedValueOnce({});
    mockQuery.mockResolvedValueOnce({});

    const response = await request(app)
      .post('/gravarNovaLeitura')
      .send({ nr_unidadeconsumidora: '100', qt_consumo: 27, nr_mes: 4, data_registro: '2026-09-01' });

    expect(response.status).toBe(200);
    expect(mockQuery).toHaveBeenLastCalledWith(
      'INSERT INTO tb_fatura(nr_mes, vl_fatura, nr_unidadeconsumidora) VALUES($1, $2, $3)',
      [4, 228, '100']
    );
  });

  test('GET /listarLeitura/:id returns readings', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ quantidadeConsumida: 20, mesLido: 1, dataLeitura: '2026-06-01' }] });

    const response = await request(app).get('/listarLeitura/100');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ quantidadeConsumida: 20, mesLido: 1, dataLeitura: '2026-06-01' }]);
  });

  test('GET /listarLeitura/:id returns 404 when no readings', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get('/listarLeitura/100');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Leitura não encontrada' });
  });

  test('GET /exportarLeituras/:id returns CSV when data exists', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ quantidadeConsumida: 12, mesLido: 1, dataLeitura: '2026-06-01' }] });

    const response = await request(app).get('/exportarLeituras/100');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/csv');
    expect(response.text).toContain('"quantidadeConsumida","mesLido","dataLeitura"');
  });

  test('GET /exportarLeituras/:id returns 204 when no data', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get('/exportarLeituras/100');

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
  });

  test('GET /exportarFaturas/:id returns CSV when data exists', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ mesLido: 2, valorFatura: 123.45, dataLeitura: '2026-06-01' }] });

    const response = await request(app).get('/exportarFaturas/100');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/csv');
    expect(response.text).toContain('"mesLido","valorFatura","dataLeitura"');
  });

  test('GET /exportarFaturas/:id returns 204 when no data', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get('/exportarFaturas/100');

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
  });
});
