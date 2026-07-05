# 💧 Hidrogestor

Este repositório contém um projeto realizado de um sistema completo para gerenciamento de leituras de hidrômetro, cadastro de usuários e geração de faturas em uma comunidade. A idéia é que seja em um modelo de assinatura de um ano, e que seja usado por apenas uma comunidade. Para atender mais de uma, seriam criadas instâncias Duplicadas (Silo).

---

## 📚 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Diagramas do Sistema](#diagramas-do-sistema)
- [Autores](#autores)
- [Criação do Banco de Dados](#criação-do-banco-de-dados)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Gerenciamento de Dependências](#gerenciamento-de-dependências)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Testes Unitários](#testes-unitários)


---

## 🧾 Sobre o Projeto

O sistema permite:

- Cadastro de moradores com informações da residência;
- Registro de leituras mensais dos hidrômetros;
- Geração automática de faturas com base no consumo;
- Armazenamento do histórico de consumo e valor por residência;
- Interface intuitiva para administradores da comunidade.

---

## 🛠 Tecnologias Utilizadas

- **Frontend:** HTML, CSS, JavaScript;
- **Backend:** Node.js e Express.js;
- **Banco de Dados:** PostgreSQL.
- **Documentação API:** Swagger;
---

## 🧩 Diagramas do Sistema

Todos os diagramas e a apresentação estão organizados na pasta docs:

**Diagramas de Atividade:** Fluxo de processos do sistema;

**Casos de Uso:** Funcionalidades principais e interações dos usuários;

**Diagrama de Classes:** Estrutura de classes e relacionamentos;

**Diagrama ER:** Modelo lógico do banco de dados;

**Diagramas de Sequência:** Fluxo de mensagens entre os componentes para cada funcionalidade (leitura, cadastro, fatura).

---

## 👨‍💻 Autores

Gabriela Aparecida Zanette Nunez;

Giovani Pedro Zanatta;

Natália Carolina Dilli;

Luiz Felipe Degani Demarck;

Projeto desenvolvido para [Curso de análise e desenvolvimento de sistemas /Universidade do Oeste de Santa Catarina– UNOESC].

## 🗃️ Criação do Banco de Dados

```sql
CREATE DATABASE gestor;
```

## 📋 Tabelas do Banco de Dados

### `tb_residente`

```sql
CREATE TABLE tb_residente (
    id_residente SERIAL PRIMARY KEY,
    tx_nome VARCHAR(150) NOT NULL,
    nr_unidadeconsumidora VARCHAR(150) NOT NULL,
    tx_cpf VARCHAR(14) NOT NULL,
    tipo_usuario SMALLINT NOT NULL DEFAULT 1,
    tx_senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (nr_unidadeconsumidora, tx_cpf)
);
```

### `tb_leitura`

```sql
CREATE TABLE tb_leitura (
    id_registroconsumo SERIAL PRIMARY KEY,
    nr_unidadeconsumidora VARCHAR(150) NOT NULL,
    qt_consumo NUMERIC(10,2) NOT NULL,
    nr_mes SMALLINT NOT NULL CHECK (nr_mes BETWEEN 1 AND 12),
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (nr_unidadeconsumidora, nr_mes)
);
```

### `tb_fatura`

```sql
CREATE TABLE tb_fatura (
    id_fatura SERIAL PRIMARY KEY,
    nr_mes SMALLINT NOT NULL CHECK (nr_mes BETWEEN 1 AND 12),
    dt_leitura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vl_fatura NUMERIC(18,2) NOT NULL,
    nr_unidadeconsumidora VARCHAR(150) NOT NULL
);
```

## 🔍 Consultas

Para visualizar os dados:

```sql
select * from tb_residente;
select * from tb_leitura;
select * from tb_fatura;
```

---

# 🛠️ Gerenciamento de Dependências e Build (NPM Workspaces)

Este documento descreve o sistema de build e o gerenciamento de dependências unificado do projeto **Hidrogestor**.

Como a aplicação é construída com **Node.js** (backend) e **HTML/CSS/JS Estático** (frontend), optou-se por utilizar o **NPM (Node Package Manager) com Workspaces** para a orquestração do projeto. O NPM atua como a ferramenta de build e gerência de dependências nativa do ecossistema JavaScript, cumprindo o mesmo papel que o **Maven** para Java ou o **Gradle** para Kotlin/Java.

---

#---

# 🏗️ Estrutura do Projeto

O projeto segue uma arquitetura de **monorepo** com separação clara entre backend e frontend:

```
Hidrogestor/
├── package.json                    # Configuração do Workspace Raiz
├── package-lock.json               # Pinagem estrita de versões
├── backend/
│   ├── package.json                # Dependências do Backend (Express, pg, bcrypt, etc.)
│   ├── app.js                      # Configuração da aplicação Express
│   ├── db.js                       # Conexão com PostgreSQL
│   ├── server.js                   # Inicialização do servidor na porta 3000
│   ├── server.test.js              # Testes unitários (Jest + Supertest)
│   ├── routes.js                   # Definição de rotas da API
│   ├── utils.js                    # Funções utilitárias
│   ├── controllers/                # Camada de Controle (MVC)
│   ├── services/                   # Camada de Negócio (MVC)
│   └── swagger/                    # Documentação da API (Swagger)
├── frontend/
│   ├── package.json                # Dependências do Frontend (http-server, etc.)
│   ├── Login/                      # Módulo de autenticação
│   ├── Pagina_inicial/             # Página inicial
│   ├── Pagina_principal/           # Painel principal
│   ├── Lista_residentes/           # Listar moradores
│   ├── Cadastro/                   # Cadastrar novo morador
│   ├── Editar_residentes/          # Editar morador existente
│   ├── Registrar_leitura/          # Registrar leitura do hidrômetro
│   ├── Lista_leituras/             # Listar leituras
│   ├── Consultar_consumo/          # Consultar consumo de água
│   ├── Lista_faturas/              # Listar faturas
│   └── Suporte/                    # Página de suporte
├── docs/                           # Diagramas do projeto
├── README.md                       # Este arquivo
```

---

## 🚀 Como Executar o Projeto

Graças ao gerenciamento unificado, você não precisa entrar em pastas separadas ou instalar dependências manualmente em cada diretório. Todos os comandos podem ser executados a partir da **raiz do projeto**:

### 1. Instalar todas as dependências (Build/Setup)
Para baixar e preparar todas as dependências tanto do backend quanto do frontend:
```bash
npm install
```
*Este comando analisa a árvore de dependências completa e cria um único `node_modules` otimizado na raiz, evitando redundâncias.*

### 2. Executar em modo de Desenvolvimento (Concorrente)
Para rodar o backend e o servidor do frontend simultaneamente:
```bash
npm run dev
```
*Este comando utiliza a biblioteca `concurrently` para subir o servidor backend na porta configurada e um servidor web estático (`http-server`) para o frontend na porta `5500`, garantindo a comunicação via CORS localmente.*

### 3. Rodar Testes
Para executar a suíte de testes unitários do backend (utilizando Jest e Supertest):
```bash
npm test
```
### 3. Rodando o projeto localmente
Para executar o projeto localmente e abrir com o "Live Server":
```bash
node server.js
```

---

## 📝 Detalhes das Ferramentas e Scripts

### Scripts Disponibilizados no `package.json` Raiz:

*   `npm run install:all`: Atalho explícito para garantir a instalação de dependências.
*   `npm run start:backend`: Executa o script de inicialização do backend.
*   `npm run start:frontend`: Inicia o servidor estático para servir o frontend na porta 5500.
*   `npm run dev`: Executa simultaneamente os servidores de frontend e backend com logs coloridos no console para facilitar a depuração.
*   `npm test`: Executa os testes automatizados do backend.

### Dependências Importantes Gerenciadas:
1.  **http-server** (Frontend): Servidor web leve e de produção/dev para servir arquivos estáticos HTML/JS do frontend, garantindo que o app rode em um endereço local seguro (`http://localhost:5500`) em vez de abrir arquivos locais via protocolo `file://`, que causaria bloqueios de CORS pelo navegador.
2.  **concurrently** (Raiz): Ferramenta utilizada para rodar múltiplos comandos CLI de forma concorrente em um único terminal.
3.  **jest & supertest** (Backend): Ferramentas de testes automatizados.
4.  **pg, express, bcrypt, cors, dotenv** (Backend): Bibliotecas para comunicação com banco de dados PostgreSQL, API REST, criptografia de senhas, liberação de CORS e gerenciamento de ambiente.

# 🚀 Documentação das Rotas API

API documentada com **Swagger**.

## 🔗 Documentação da API
Com o servidor rodando, acesse:
👉 **[http://localhost:3000/api-docs/#/](http://localhost:3000/api-docs/#/)**

---

## 🛠️ Módulos e Endpoints

* **👥 Usuários:** Autenticação, listagem, cadastro (com validação de CPF), atualização e exclusão de residentes.
* **📊 Leituras:** Registo e listagem de consumos por unidade, eliminação de registos e exportação de dados para **CSV**.
* **📄 Faturas:** Consulta de faturas geradas e exportação do histórico para **CSV**.

---


## Testes unitários

O backend possui testes unitários para validar o comportamento das rotas em server.js, usando jest e supertest.

### Como funciona

- pg.Pool.query é mockado para evitar conexão real com o banco de dados.
- bcrypt.compare e bcrypt.hash também são mockados para simular validação de senha e criptografia.
- O arquivo server.js não é modificado para os testes; apenas a instância do app exportada é utilizada.

### Como rodar

bash
npm test


### O que os testes validam

Os testes cobrem os principais fluxos de cada endpoint:

- GET /listarUsuarios
  - retorna lista de usuários quando existem registros
  - retorna 404 quando não há resultados

- POST /login
  - sucesso quando CPF existe e senha é válida
  - 401 quando CPF não existe
  - 401 quando senha inválida

- POST /gravarNovoUsuario
  - retorna o id do novo usuário quando a inserção é bem-sucedida
  - trata o erro de chave duplicada (23505) e retorna 400

- POST /verificarDuplicatas
  - retorna cpf_existe correto com base na consulta mockada
  - retorna total_contadores com a contagem de usuários tipo contador

- PUT /atualizarUsuario/:id
  - sucesso quando a atualização altera uma linha
  - 404 quando o usuário não é encontrado

- DELETE /excluirUsuario/:id
  - sucesso quando a exclusão remove uma linha
  - 404 quando o usuário não é encontrado

- GET /listarFaturas/:id
  - retorna faturas quando existem dados
  - retorna 404 quando não há faturas

- POST /gravarNovaLeitura
  - simula a criação de leitura e fatura para o primeiro mês
  - simula a criação para meses seguintes, com cálculo de consumo baseado em leitura anterior

- GET /listarLeitura/:id
  - retorna leituras quando existem dados
  - retorna 404 quando não há leituras

- GET /exportarLeituras/:id
  - retorna CSV quando há dados
  - retorna 204 quando não há dados para exportar

- GET /exportarFaturas/:id
  - retorna CSV quando há dados
  - retorna 204 quando não há dados para exportar

### Benefícios

- valida a lógica das rotas sem precisar de banco de dados real
- ajuda a identificar regressões rapidamente
- mantém os testes independentes do ambiente de execução

📝 Observações

- As tabelas tb_residente e tb_leitura possuem restrições de unicidade para evitar duplicações
- O campo tipo_usuario utiliza valor padrão 1 (ativo)
- Todos os campos de data utilizam TIMESTAMP com valor padrão CURRENT_TIMESTAMP
- Os valores monetários são armazenados como DECIMAL para precisão



