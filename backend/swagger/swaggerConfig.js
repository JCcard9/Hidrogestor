const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HidroGestor API",
      version: "1.0.0",
      description: "Documentação das rotas da API do sistema HidroGestor."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local"
      }
    ]
  },
  apis: [path.join(__dirname, "**", "*.js").replace(/\\/g, "/")]
};

module.exports = swaggerJsdoc(options);
