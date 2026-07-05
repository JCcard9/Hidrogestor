/**
 * @openapi
 * tags:
 *   - name: Leituras
 *     description: Gerenciamento de leituras de consumo
 * paths:
 *   /listarLeitura/{id}:
 *     get:
 *       summary: Lista leituras de uma unidade consumidora
 *       tags: [Leituras]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Lista de leituras retornada
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *         404:
 *           description: Leitura não encontrada
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *   /gravarNovaLeitura:
 *     post:
 *       summary: Registra uma nova leitura e cria uma fatura
 *       tags: [Leituras]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nr_unidadeconsumidora:
 *                   type: string
 *                 qt_consumo:
 *                   type: number
 *                 nr_mes:
 *                   type: integer
 *                 data_registro:
 *                   type: string
 *       responses:
 *         200:
 *           description: Leitura cadastrada com sucesso
 *   /exportarLeituras/{id}:
 *     get:
 *       summary: Exporta leituras em CSV
 *       tags: [Leituras]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: CSV gerado com sucesso
 *           content:
 *             text/csv:
 *               schema:
 *                 type: string
 *         204:
 *           description: Nenhum dado para exportar
 *   /excluirLeitura/{id}:
 *     delete:
 *       summary: Exclui uma leitura e a fatura correspondente
 *       tags: [Leituras]
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
 *               properties:
 *                 nr_unidadeconsumidora:
 *                   type: string
 *                 nr_mes:
 *                   type: integer
 *       responses:
 *         200:
 *           description: Leitura e fatura excluídas com sucesso
 *         404:
 *           description: Leitura não encontrada
 */
