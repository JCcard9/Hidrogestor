/**
 * @openapi
 * tags:
 *   - name: Faturas
 *     description: Consultas e exportação de faturas
 * paths:
 *   /listarFaturas/{id}:
 *     get:
 *       summary: Lista faturas de uma unidade consumidora
 *       tags: [Faturas]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Lista de faturas retornada com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *         404:
 *           description: Nenhuma fatura encontrada
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *   /exportarFaturas/{id}:
 *     get:
 *       summary: Exporta faturas em CSV
 *       tags: [Faturas]
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
 */
