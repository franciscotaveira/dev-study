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
  },
  hiperfoco: {
    id: "hiperfoco",
    name: "Modo Hiperfoco (TDAH)",
    description: "Trilha otimizada para TDAH: micro-doses de dopamina, Sprints curtas e direto ao ponto.",
    modules: [
      {
        title: "Sprint 1: O Coração da Lógica (Python)",
        items: [
          "1.1 Algoritmos: A Receita Secreta",
          "1.2 Variáveis: Caixas Mágicas",
          "1.3 Operadores: Matemática e Lógica",
          "1.4 Decisões (If/Else): Escolhendo Caminhos",
          "1.5 Repetições (Loops): Automação Simples",
          "1.6 Funções: Comandos Mágicos",
          "1.7 Coleções: Listas e Dicionários"
        ]
      },
      {
        title: "Sprint 2: A Arte de Construir na Web",
        items: [
          "2.1 HTML: O Esqueleto da Página",
          "2.2 CSS: Dando Estilo e Personalidade",
          "2.3 JavaScript: Fazendo a Página Ganhar Vida",
          "2.4 Git & GitHub: Guardando suas Criações"
        ]
      },
      {
        title: "Sprint 3: O Poder Oculto (Dados & Backend)",
        items: [
          "3.1 POO: Organização Avançada",
          "3.2 Lendo e Escrevendo Arquivos JSON/CSV",
          "3.3 Bancos de Dados (SQLite)",
          "3.4 Acessando APIs com requests",
          "3.5 Flask: O Cérebro da sua Aplicação Web"
        ]
      },
      {
        title: "Sprint 4: O Próximo Nível (Arquitetura & IA)",
        items: [
          "4.1 Padrões de Projeto (Design Patterns)",
          "4.2 Nuvem e Microsserviços Básicos",
          "4.3 Segurança e Prevenção Básica (OWASP)",
          "4.4 Intro à Inteligência Artificial (Scikit-Learn)"
        ]
      }
    ]
  },
  typescript: {
    id: "typescript",
    name: "TypeScript Full-Stack",
    description: "Trilha focada em dominar a linguagem moderna do mercado: Typescript, React moderno, Next.js e Node.js.",
    modules: [
      {
        title: "1ª Fase: Fundamentos do TypeScript",
        items: [
          "Bem-vindo ao TypeScript: O Super-Poder do JavaScript",
          "Tipagens Estáticas vs Dinâmicas",
          "Tipos Primitivos, Arrays e Objetos",
          "Interfaces vs Types",
          "Enums e Generics Básicos"
        ]
      },
      {
        title: "2ª Fase: TS no Front-End (React)",
        items: [
          "Configurando React com TypeScript (Vite/Next)",
          "Tipando Props e Componentes",
          "Tipando Hooks (useState, useEffect, refs)",
          "Tipando Context API",
          "Integração com Ferramentas Modernas (Tailwind)"
        ]
      },
      {
        title: "3ª Fase: TS no Back-End (Node)",
        items: [
          "Configurando Node + TypeScript",
          "Construindo uma API com Express + TS",
          "Validação de Dados Estrita com Zod",
          "Prisma ORM com TypeScript",
          "Tratamento de Erros e Middlewares Tipados"
        ]
      }
    ]
  },
  java: {
    id: "java",
    name: "Back-End Elite: Java + Spring",
    description: "Trilha pura para Engenharia de Software. Java, Orientação a Objetos, Spring Boot e Microsserviços.",
    modules: [
      {
        title: "1ª Fase: Core Java & POO",
        items: [
          "Sintaxe Java e a JVM",
          "Orientação a Objetos: Classes, Objetos e Métodos",
          "Herança, Polimorfismo e Interfaces",
          "Tratamento de Exceções",
          "Coleções (List, Set, Map) e Streams API"
        ]
      },
      {
        title: "2ª Fase: Banco de Dados Relacional",
        items: [
          "SQL Fundamental e Normalização",
          "Conectando Java ao Banco via JDBC",
          "Introdução a ORM e JPA/Hibernate",
          "Mapeamento de Entidades e Relacionamentos"
        ]
      },
      {
        title: "3ª Fase: Spring Boot API",
        items: [
          "A Magia do Spring Boot: Injeção de Dependência",
          "Construindo RESTful APIs",
          "Spring Data JPA para Banco de Dados",
          "Segurança com Spring Security e JWT",
          "Arquitetura de Microsserviços Básica"
        ]
      }
    ]
  },
  ai_engineering: {
    id: "ai_engineering",
    name: "Engenharia de IA Aplicada",
    description: "Integre LLMs, RAG e Agentes Autônomos em sistemas reais. Metodologia focada em microvitórias e construção prática.",
    modules: [
      {
        title: "1ª Fase: Caixa de Ferramentas e Fundamentos",
        items: [
          "Fundamentos de IA e Visão Geral de LLMs",
          "IA no dia a dia: Ferramentas para UX & UI",
          "Acelerando Infraestrutura: IA para DevOps",
          "Acelerando Processos: IA para Gestão de Projetos"
        ]
      },
      {
        title: "2ª Fase: Orquestração e Contexto",
        items: [
          "Chamadas de APIs Generativas na Prática",
          "Mestrado em Prompt Engineering e Few-Shot",
          "Dominando o Model Context Protocol (MCP)",
          "Arquitetura de Sistemas Híbridos com IA"
        ]
      },
      {
        title: "3ª Fase: Autonomia e Especialização",
        items: [
          "Desenvolvimento de Agentes Autônomos",
          "Processamento de Dados RAG Avançado",
          "Técnicas de Fine-Tuning e Otimização de Modelos",
          "Segurança, Governança e Ética em IA"
        ]
      },
      {
        title: "Fase Final: O Engenheiro de Elite",
        items: [
          "Deploy de Soluções com LLMs",
          "Projeto Integrador – Capstone Project",
          "Mentoria: Carreira e Entrevistas de Alta Renda"
        ]
      }
    ]
  },
  google_support: {
    id: "google_support",
    name: "Suporte de TI: Fundamentos (Google)",
    description: "Prepare-se para o mercado de tecnologia dominando hardware, redes, sistemas operacionais e solução de problemas.",
    modules: [
      {
        title: "Módulo 1: Introdução à TI e Computação",
        items: [
          "1.1 O que é TI e Suporte de TI?",
          "1.2 Do Ábaco ao Computador Moderno",
          "1.3 Linguagem de Computador (Sistema Binário)",
          "1.4 Introdução à Visão Geral da Arquitetura do Computador",
          "1.5 Desafio do Módulo 1: Fundamentos Básicos"
        ]
      },
      {
        title: "Módulo 2: Componentes e Hardware do Computador",
        items: [
          "2.1 CPU, Placas-mãe e Memória RAM",
          "2.2 Armazenamento Físico (Discos Rígidos, HDD/SSD)",
          "2.3 Fontes de Alimentação e Periféricos",
          "2.4 Como montar tudo: Adicionando Componentes",
          "2.5 Desafio do Módulo 2: Componentes e Hardware"
        ]
      },
      {
        title: "Módulo 3: Instalação e Uso de Sistemas Operacionais",
        items: [
          "3.1 Componentes de um SO (Kernel, Espaço do Usuário)",
          "3.2 Gerenciamento de Processos e Memória Virtual",
          "3.3 Instalação Prática do Windows 10 e do Linux",
          "3.4 Prática: Criando Pastas via Terminal (Windows e Linux)",
          "3.5 Desafio do Módulo 3: Instalação e Uso de SO"
        ]
      },
      {
        title: "Módulo 4: Redes de Computadores",
        items: [
          "4.1 Noções Básicas de Rede e Hardware de Rede",
          "4.2 O Modelo TCP/IP e o funcionamento da Web",
          "4.3 História, Limitações e o futuro da Internet",
          "4.4 Privacidade e Segurança: Mantendo Hackers longe",
          "4.5 Desafio do Módulo 4: Noções de Rede"
        ]
      },
      {
        title: "Módulo 5: Interagindo com o Software",
        items: [
          "5.1 Como o software é criado: Código, scripting e programação",
          "5.2 Tipos de Software e Sistemas de Controle de Versão",
          "5.3 Gerenciamento de Software (Instalação e Remoção)",
          "5.4 Automatização de processos via terminal",
          "5.5 Desafio do Módulo 5: Gerenciamento de Software"
        ]
      },
      {
        title: "Módulo 6: Práticas Recomendadas de Solução de Problemas",
        items: [
          "6.1 Metodologia de suporte e Isolamento de problemas",
          "6.2 Atendimento ao Cliente e Habilidades Interpessoais",
          "6.3 Sistemas de Emissão de Tíquetes e Documentação",
          "6.4 Preparando-se para o mercado: Currículo e Entrevista",
          "6.5 Desafio do Módulo 6: Solução de Problemas e Carreira"
        ]
      }
    ]
  }
};

export const defaultCurriculumId = "universal";
export const curriculum = curriculums[defaultCurriculumId].modules;


