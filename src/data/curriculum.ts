export type Module = {
  title: string;
  items: string[];
};

export const curriculums: Record<string, { id: string, name: string, description: string, modules: Module[] }> = {
  senai: {
    id: "senai",
    name: "Trilha Prática SENAI",
    description: "Currículo padrão focado no curso técnico do SENAI (Front-end e Back-end).",
    modules: [
      {
        title: "1ª Fase: Onboarding e Preparação",
        items: [
          "Integração: Mensagem de Boas-vindas",
          "Setup Inicial: Perdeu as Trilhas Rápidas?",
          "Estratégia: Dicas para estudar a distância",
          "Comunidade: Dúvidas? Vem pro Discord!"
        ]
      },
      {
        title: "2ª Fase: Construção de Interfaces (Front-End)",
        items: [
          "Missão de Preparo: Boas-vindas ao Front-End",
          "Missão 1: Introdução a Web e HTML",
          "Missão 2: Elementos de Páginas Web (Parte 1)",
          "Missão 3: Elementos de Páginas Web (Parte 2)",
          "Missão 4: HTML - Formulários e Entradas de Dados",
          "Missão 5: HTML - Tabelas e Estruturas",
          "Missão 6: Boas Práticas, SEO e Acessibilidade",
          "Missão 7: Introdução à Estilização (CSS)",
          "Missão 8: CSS - Seus Primeiros Códigos",
          "Missão 9: Dominando Seletores (Parte 1)",
          "Missão 10: Dominando Seletores (Parte 2)",
          "Missão 11: Box Model - Posicionamento",
          "Missão 12: CSS Grid Layout (Parte 1)",
          "Missão 13: CSS Grid Layout (Parte 2)",
          "Missão 14: Flexbox - Responsividade (Parte 1)",
          "Missão 15: Flexbox - Responsividade (Parte 2)",
          "Missão 16: Cores, Fontes e Backgrounds na Prática",
          "Missão 17: JS - Tipos, Escopo e Lógica (Parte 1)",
          "Missão 18: JS - Tipos, Escopo e Lógica (Parte 2)",
          "Missão 19: Manipulação de Elementos e Switch-Case",
          "Missão 20: Arrays na Prática",
          "Missão 21: Laços de Repetição (Parte 1)",
          "Missão 22: Laços de Repetição (Parte 2)",
          "Missão 23: Laços de Repetição (Parte 3)",
          "Missão 24: Funções e Eventos (Parte 1)",
          "Missão 25: Funções e Eventos (Parte 2)",
          "Missão 26: Manipulando o DOM - Jogo da Velha (Pt 1)",
          "Missão 27: Manipulando o DOM - Jogo da Velha (Pt 2)",
          "Missão 28: Validação de Formulários JS"
        ]
      },
      {
        title: "3ª Fase: Arquitetura de Servidores (Back-End)",
        items: [
          "Missão 29: Orientação a Objetos - POO (Parte 1)",
          "Missão 30: Orientação a Objetos - POO (Parte 2)",
          "Missão 31: Assincronia, Promises e JSON (Parte 1)",
          "Missão 32: Assincronia, Promises e JSON (Parte 2)",
          "Missão 33: Node.js Descomplicado",
          "Missão 34: NPM - Gerenciando Pacotes",
          "Missão 35: CommonJS e Códigos Reutilizáveis",
          "Missão 36: Express.js - Construindo APIs",
          "Missão 37: Princípio da Responsabilidade Única",
          "Missão 38: MVC - Estruturando Aplicações",
          "Missão 39: Bancos de Dados - SQL vs NoSQL",
          "Missão 40: CRUD - Aplicação Completa (Parte 1)",
          "Missão 41: CRUD - Aplicação Completa (Parte 2)",
          "Missão 42: Autenticação e Segurança (Boss Final)"
        ]
      },
      {
        title: "Boss Fights & Conclusão",
        items: [
          "Boss Fight 1: Orientações Iniciais",
          "Boss Fight 2: Desafio Extra de Código",
          "Boss Fight Final: Avaliação Regular",
          "Retrospectiva: Avalie sua Jornada",
          "Vitória: Mensagem de Encerramento",
          "Próximo Nível: Escolha seu próximo caminho"
        ]
      }
    ]
  },
  universal: {
    id: "universal",
    name: "Full-Stack Universal",
    description: "Trilha moderna completa, do iniciante ao pro, passando por React, Node e DevOps.",
    modules: [
      {
        title: "1ª Fase: Lógica e Fundamentos Universais",
        items: [
          "Integração: Como Estudar e Aprender a Aprender",
          "Setup do Desenvolvedor: VS Code, Git e Terminal",
          "Lógica de Programação: Variáveis e Tipos de Dados",
          "Lógica de Programação: Estruturas Condicionais (If/Else)",
          "Lógica de Programação: Laços de Repetição (For/While)",
          "Lógica de Programação: Funções e Escopos",
          "Lógica de Programação: Arrays e Objetos",
          "Algoritmos Básicos e Resolução de Problemas",
          "Versionamento com Git e GitHub (Commits e Branches)"
        ]
      },
      {
        title: "2ª Fase: Front-End Fundacional (A Web Visível)",
        items: [
          "HTML5: A Estrutura da Web",
          "HTML5: Formulários e Semântica",
          "CSS3: Seletores e Estilização Básica",
          "CSS3: Box Model, Margens e Paddings",
          "CSS3: Flexbox (Layouts Unidimensionais)",
          "CSS3: Grid Layout (Layouts Bidimensionais)",
          "CSS3: Design Responsivo e Media Queries",
          "JavaScript: Manipulação do DOM (A Árvore da Página)",
          "JavaScript: Eventos (Cliques, Inputs, Teclas)",
          "JavaScript: Assincronismo (Promises, async/await)",
          "JavaScript: Consumo de APIs (Fetch e REST)",
          "Boas Práticas de UI/UX para Desenvolvedores"
        ]
      },
      {
        title: "3ª Fase: Front-End Avançado (Modern UI/SPA)",
        items: [
          "Introdução a Componentes e Estado",
          "React/Vue: O Básico (Renderização e Props)",
          "React/Vue: Reatividade e Ciclo de Vida",
          "React/Vue: Gerenciamento de Estado de Aplicação",
          "Roteamento no Front-End (Client-Side Routing)",
          "Estilização Moderna (Tailwind CSS / Styled Components)",
          "Consumo Avançado de APIs e SWR/React Query",
          "Buid Tools (Vite, Webpack) e NPM/Yarn"
        ]
      },
      {
        title: "4ª Fase: Back-End (O Motor Oculto)",
        items: [
          "Noções Básicas de Redes: HTTP, Request, Response",
          "Linguagem Back-End (Node.js, Python, Java ou C#)",
          "Construindo um Servidor Simples",
          "Rotas e Endpoints (RESTful APIs)",
          "Middlewares, Autenticação e JWT",
          "Segurança Básica (CORS, Hash de Senhas, Rate Limiting)",
          "Arquitetura MVC (Model-View-Controller)"
        ]
      },
      {
        title: "5ª Fase: Bancos de Dados e Persistência",
        items: [
          "SQL vs NoSQL: Quando Usar Cada Um",
          "Bancos Relacionais (PostgreSQL/MySQL): Tabelas e Chaves",
          "Bancos Relacionais: Consultas (SELECT, JOIN, WHERE)",
          "Bancos NoSQL (MongoDB/Firestore): Coleções e Documentos",
          "ORM/Query Builders (Prisma, Drizzle, Sequelize)",
          "Migrações de Banco de Dados e Schemas"
        ]
      },
      {
        title: "6ª Fase: Full-Stack e DevOps Iniciante",
        items: [
          "Juntando Tudo: Conectando Front-End e Back-End",
          "Gestão de Variáveis de Ambiente (.env) e Secrets",
          "Dockerização: O Básico de Contêineres (Dockerfile)",
          "Deploy de Front-End (Vercel, Netlify)",
          "Deploy de Back-End (Render, Cloud Run, Heroku)",
          "CI/CD Básico: GitHub Actions",
          "Testes Automatizados (Unitários e Integração E2E)"
        ]
      },
      {
        title: "Mestre Supremo: Arquitetura e Escala",
        items: [
          "Padrões de Projeto (Design Patterns) Universais",
          "Clean Architecture e Domain-Driven Design (DDD)",
          "Mensageria e Filas (RabbitMQ, Kafka, Redis)",
          "Microserviços vs Monolito",
          "Otimização de Performance Web",
          "Portfólio: Seu TCC / Projeto Final Full-Stack"
        ]
      }
    ]
  }
};

export const defaultCurriculumId = "universal";
export const curriculum = curriculums[defaultCurriculumId].modules;


