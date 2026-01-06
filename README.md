# 🛡️ Log & Audit API Service

> API RESTful desenvolvida em Node.js para centralização de logs, auditoria de eventos e execução de tarefas agendadas (Cron Jobs).

![Node.js](https://img.shields.io/badge/Runtime-Node.js_18-339933?style=flat&logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express-000000?style=flat&logo=express)
![Architecture](https://img.shields.io/badge/Architecture-MVC-orange)

## 🎯 Objetivo do Projeto

Este serviço atua como um **hub central de observabilidade**. Ele foi projetado para:

1.  **Processar Eventos:** Receber e categorizar logs de sistema (Erros, Avisos, Sucessos).
2.  **Armazenamento em Memória (Buffer):** Manter um histórico rotativo dos últimos eventos na RAM para acesso de baixíssima latência.
3.  **Automação (Jobs):** Executar rotinas de sincronização e manutenção através de agendadores internos (Cron).
4.  **Exposição de Dados:** Fornecer endpoints JSON para que qualquer cliente (Dashboard, Mobile, CLI) possa consumir os dados de auditoria.

---

## 🛠️ Stack Tecnológica

O projeto foi construído com foco em performance e organização de código.

* **Node.js & Express:** Core da aplicação.
* **In-Memory Storage Strategy:** Estrutura de dados (Array/Buffer) para persistência volátil de logs, eliminando I/O de disco para consultas rápidas.
* **Node-Cron:** Gerenciador de tarefas agendadas (ETL/Cleanup).

---

## 📂 Arquitetura (MVC)

A estrutura de pastas segue o padrão **Model-View-Controller** (adaptado para API, onde a View é o JSON), garantindo separação de responsabilidades.

```bash
/
├── src/
│   ├── config/         # Configurações globais (ex: Scheduler/Cron)
│   ├── controllers/    # Lógica de entrada/saída das rotas (Req/Res)
│   ├── jobs/           # Regras de negócio que rodam em background
│   ├── services/       # Serviços externos e lógica pesada
│   ├── utils/          # Ferramentas auxiliares (Logger Customizado)
│   └── app.js          # Entry point do servidor
└── .env                # Variáveis de ambiente (Segurança)
```

---

## 🚀 Instalação e Execução
### Pré-requisitos
* Node.js v18+

* NPM ou Yarn


### Passo a Passo
1. Clone e instale as dependências:
```bash
npm install
```
2. Configure o ambiente: Crie um arquivo .env na raiz do projeto

3. Inicie o servidor:
```bash
npm run dev
```

---

## 🤝 Como Contribuir
Contribuições são sempre bem-vindas! Se você tem alguma ideia para melhorar o projeto, siga os passos abaixo:

* Faça um **Fork** do projeto.

* Crie uma nova Branch para sua feature (`git checkout -b feature/MinhaFeature`).

* Faça o Commit das suas alterações (`git commit -m 'feat: Adiciona nova funcionalidade'`).

* Faça o Push para a Branch (`git push origin feature/MinhaFeature`).

* Abra um Merge Request (ou Pull Request) para a branch main.

---

## ⚙️ Funcionalidades Internas
Logger Customizado `(src/utils/logger.js)`
Sistema de log proprietário que:

1. Salva automaticamente o log na memória RAM (logsMemoria).

2. Implementa rotação automática (descarta logs muito antigos para economizar memória).

Agendador `(src/config/scheduler.js)`
Configurado para manter a aplicação viva e executando tarefas periódicas sem intervenção humana.
