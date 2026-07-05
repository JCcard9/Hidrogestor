/**
 * @openapi
 * tags:
 *   - name: Usuários
 *     description: Operações de autenticação e cadastro de residentes
 * paths:
 *   /listarUsuarios:
 *     get:
 *       summary: Lista todos os residentes
 *       tags: [Usuários]
 *       responses:
 *         200:
 *           description: Lista de residentes retornada com sucesso
 *         404:
 *           description: Nenhum residente encontrado
 *   /login:
 *     post:
 *       summary: Realiza login do usuário
 *       tags: [Usuários]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cpf:
 *                   type: string
 *                 senha:
 *                   type: string
 *       responses:
 *         200:
 *           description: Login realizado com sucesso
 *         401:
 *           description: Credenciais inválidas
 *   /gravarNovoUsuario:
 *     post:
 *       summary: Cadastra um novo residente
 *       tags: [Usuários]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                   type: string
 *                 nr_unidadeconsumidora:
 *                   type: string
 *                 cpf:
 *                   type: string
 *                 tipo_usuario:
 *                   type: integer
 *                 senha:
 *                   type: string
 *                 data_cadastro:
 *                   type: string
 *       responses:
 *         200:
 *           description: Usuário cadastrado com sucesso
 *         400:
 *           description: CPF ou unidade consumidora já cadastrados
 *   /verificarDuplicatas:
 *     post:
 *       summary: Verifica duplicidade de CPF e contador
 *       tags: [Usuários]
 *       responses:
 *         200:
 *           description: Resultado da verificação retornado
 *   /atualizarUsuario/{id}:
 *     put:
 *       summary: Atualiza dados de um residente
 *       tags: [Usuários]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - nome
 *                 - nr_unidadeconsumidora
 *                 - cpf
 *               properties:
 *                 nome:
 *                   type: string
 *                 nr_unidadeconsumidora:
 *                   type: string
 *                 cpf:
 *                   type: string
 *       responses:
 *         200:
 *           description: Residente atualizado com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         400:
 *           description: Dados de usuário incompletos
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         404:
 *           description: Residente não encontrado
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *   /excluirUsuario/{id}:
 *     delete:
 *       summary: Remove um residente
 *       tags: [Usuários]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Residente excluído com sucesso
 *         404:
 *           description: Residente não encontrado
 */
