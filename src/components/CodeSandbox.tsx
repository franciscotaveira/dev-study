import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Play,
  RotateCcw,
  Sparkles,
  Copy,
  CheckCircle2,
  Monitor,
  Code,
  HelpCircle,
  Terminal,
  Bug,
  Check,
  Trash2,
  Award,
  Lightbulb,
  RefreshCw,
  Zap,
  Bookmark,
  Lock,
  ChevronRight,
  CheckCircle,
  X,
  AlertCircle,
  Wand2,
  Info,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Keyboard,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CodeSandboxProps {
  onSendToMentor: (code: string) => void;
  isNightMode?: boolean;
  isAutoFormatEnabled?: boolean;
  onSolvedBug?: (category: string) => void;
}

interface Lesson {
  id: string;
  name: string;
  objective: string;
  whatIs: string;
  analogy: string;
  minCode: string;
  specs: {
    text: string;
    check: (html: string, css: string, js: string) => boolean;
  }[];
  defaultHtml: string;
  defaultCss: string;
  defaultJs: string;
  isBugChallenge?: boolean;
}

interface Track {
  id: string;
  name: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

const TRACKS: Track[] = [
  {
    id: "html-basico",
    name: "HTML Estrutural",
    icon: "📄",
    color: "text-orange-400 border-orange-500/20 bg-orange-500/5",
    lessons: [
      {
        id: "html-l0",
        name: "Clean Code: Formatar O Documento",
        objective:
          "Observe como o código desalinhado atrapalha a leitura! Corrija a indentação (espaçamento) das tags HTML para manter o seu código limpo.",
        whatIs:
          'A indentação é o "recuo" que fazemos na margem esquerda das linhas para mostrar o que está dentro do quê. O atalho "Formatar o Documento" (Prettier) faria isso para você no editor!',
        analogy:
          "Indentação correta é como ter gavetas organizadas: você sabe exatamente onde estão as camisetas, meias e cuecas sem precisar revirar tudo.",
        minCode:
          "<div>\n  <p>Estou dentro do div, por isso tenho 2 espaços a mais!</p>\n</div>",
        defaultHtml:
          "<body>\n<h1>Título desalinhado</h1>\n  <p>Parágrafo solto</p>\n</body>",
        defaultCss:
          "body { font-family: sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; }",
        defaultJs: "",
        specs: [
          {
            text: "Indentar a tag <h1> com 2 espaços de margem em relação ao <body>",
            check: (html) => html.includes("  <h1>") || html.includes("\t<h1>"),
          },
          {
            text: "O pai <body> não deve ter espaços sobrando na frente no fechamento",
            check: (html) =>
              html.split("\n").some((line) => line.startsWith("</body>")),
          },
        ],
      },
      {
        id: "html-l1",
        name: "Cabeçalho e Parágrafo",
        objective:
          "Crie seu primeiro título principal h1 e um parágrafo p com texto descritivo.",
        whatIs:
          "HTML funciona como os ossos do corpo. <h1> define o título mais importante e <p> define blocos de texto comuns.",
        analogy:
          "Imagine um jornal físico: o <h1> é a manchete gigante da capa, e o <p> é o texto da matéria logo abaixo.",
        minCode: "<h1>Meu Título</h1>\n<p>Meu parágrafo descritivo.</p>",
        defaultHtml: "<!-- Escreva seu h1 e p abaixo -->\n",
        defaultCss:
          "body {\n  font-family: sans-serif;\n  background-color: #0f172a;\n  color: #f8fafc;\n  padding: 30px;\n}",
        defaultJs: '// Console pronto!\nconsole.log("Laboratório Iniciado!");',
        specs: [
          {
            text: "Conter uma tag de abertura e fechamento para <h1>",
            check: (html) => html.includes("<h1>") && html.includes("</h1>"),
          },
          {
            text: "Conter uma tag de abertura e fechamento para <p>",
            check: (html) => html.includes("<p>") && html.includes("</p>"),
          },
          {
            text: "Possuir um conteúdo de texto visível dentro do <p>",
            check: (html) => {
              const match = html.match(/<p>([\s\S]*?)<\/p>/);
              return !!match && match[1].trim().length > 3;
            },
          },
        ],
      },
      {
        id: "html-l2",
        name: "Atributos & Imagens",
        objective:
          "Adicione uma imagem na tela usando a tag img com os atributos src (origem) e alt (texto alternativo de acessibilidade).",
        whatIs:
          'Imagens não têm tag de fechamento (são auto-fechadas) e exigem atributos informativos como "src" para localizar o arquivo e "alt" para leitores de tela.',
        analogy:
          'O "src" é o endereço de entrega do carteiro, e o "alt" é a descrição da encomenda caso o destinatário não possa enxergar.',
        minCode: '<img src="https://picsum.photos/150" alt="Foto de exemplo">',
        defaultHtml:
          "<h1>Galeria Prática</h1>\n<!-- Adicione a tag img abaixo -->\n",
        defaultCss:
          "body {\n  font-family: sans-serif;\n  background-color: #0f172a;\n  color: #f8fafc;\n  padding: 30px;\n}\nimg {\n  border: 3px solid #6366f1;\n  border-radius: 8px;\n}",
        defaultJs: "",
        specs: [
          {
            text: "Conter a tag de imagem <img ...>",
            check: (html) => html.includes("<img"),
          },
          {
            text: 'Conter o atributo essencial "src" apontando para uma URL',
            check: (html) => html.includes("src="),
          },
          {
            text: 'Conter o atributo acessível "alt" preenchido',
            check: (html) => html.includes("alt=") && !html.includes('alt=""'),
          },
        ],
      },
      {
        id: "html-l3",
        name: "Hiperlinks de Navegação",
        objective:
          "Crie uma tag de link clicável (anchor <a>) que leve ao portal da documentação oficial (MDN) em uma aba externa utilizando o atributo apropriado.",
        whatIs:
          'A tag <a> utiliza href para o destino e target="_blank" para instruir o navegador a abrir o link em uma nova janela sem fechar o portal.',
        analogy:
          'Imagine um portal mágico: o "href" aponta as coordenadas do destino e o "target" escolhe se você abre uma nova porta ou reforma a sala atual.',
        minCode:
          '<a href="https://developer.mozilla.org" target="_blank">Clique Aqui</a>',
        defaultHtml:
          "<h1>Links Importantes</h1>\n<!-- Crie o link abaixo -->\n",
        defaultCss:
          "body {\n  font-family: sans-serif;\n  background-color: #0f172a;\n  color: #f8fafc;\n  padding: 30px;\n}\na {\n  color: #38bdf8;\n  text-decoration: none;\n  font-weight: bold;\n}",
        defaultJs: "",
        specs: [
          {
            text: "Conter uma tag de link <a>",
            check: (html) => html.includes("<a") && html.includes("</a>"),
          },
          {
            text: 'Conter o atributo "href" apontando para o site da MDN',
            check: (html) =>
              html.includes('href="https://developer.mozilla.org"') ||
              html.includes("href='https://developer.mozilla.org'"),
          },
          {
            text: 'Conter target="_blank" para abrir em outra aba',
            check: (html) => html.includes('target="_blank"'),
          },
        ],
      },
      {
        id: "html-l4",
        name: "Listas e Coleções",
        objective:
          "Desenvolva uma lista não-ordenada (ul) contendo no mínimo 3 itens (li) com materiais de estudo.",
        whatIs:
          "<ul> define a lista com bolinhas (não numerada), enquanto cada item obrigatório dentro dela deve ser englobado por <li>.",
        analogy:
          "A lista de compras: o pedaço de papel inteiro é a tag <ul>, e cada linha com um produto escrito é um <li>.",
        minCode:
          "<ul>\n  <li>Caderno</li>\n  <li>Caneta</li>\n  <li>Notebook</li>\n</ul>",
        defaultHtml:
          "<h2>Meus Materiais de Estudo</h2>\n<!-- Insira sua lista abaixo -->\n",
        defaultCss:
          "body {\n  font-family: sans-serif;\n  background-color: #0f172a;\n  color: #f8fafc;\n  padding: 30px;\n}\nli {\n  color: #a78bfa;\n  line-height: 1.8;\n}",
        defaultJs: "",
        specs: [
          {
            text: "Conter a tag de lista <ul> de abertura e fechamento",
            check: (html) => html.includes("<ul>") && html.includes("</ul>"),
          },
          {
            text: "Conter no mínimo 3 elementos de item <li>",
            check: (html) => {
              const matches = html.match(/<li[\s>]/g);
              const closes = html.match(/<\/li>/g);
              return (
                !!matches &&
                !!closes &&
                matches.length >= 3 &&
                closes.length >= 3
              );
            },
          },
        ],
      },
      {
        id: "html-bug-challenge",
        name: "Desafio do Bug: A Tag Órfã",
        isBugChallenge: true,
        objective:
          "O programador da madrugada esqueceu de fechar a tag de título principal, fazendo com que o parágrafo de baixo ficasse grande e vermelho! Feche o <h1> corretamente para isolar o estilo.",
        whatIs:
          "Uma tag sem fechamento é chamada de tag órfã. Ela aplica seu estilo a absolutamente todo o conteúdo que vier depois dela na página.",
        analogy:
          "É como abrir a torneira do banheiro e sair de casa: a água vai inundar o corredor inteiro de forma indesejada se não for fechada!",
        minCode: "</h1> <!-- Feche o h1 que está quebrado -->",
        defaultHtml:
          '<h1 style="color: #ef4444">Meu Tópico Favorito\n\n<p>Esse parágrafo deve ser pequeno e cinza, mas por falta de fechamento do h1 acima ele acabou herdando o estilo gigante!</p>',
        defaultCss:
          "body {\n  font-family: sans-serif;\n  background-color: #0f172a;\n  color: #94a3b8;\n  padding: 30px;\n}",
        defaultJs: 'console.log("Bug carregado!");',
        specs: [
          {
            text: "HTML deve conter a tag de fechamento para o título principal (</h1>)",
            check: (html) => html.replace(/\s/g, "").includes("</h1>"),
          },
          {
            text: 'O h1 com style="color: #ef4444" precisa manter o texto "Meu Tópico Favorito"',
            check: (html) => html.includes("Meu Tópico Favorito"),
          },
        ],
      },
    ],
  },
  {
    id: "css-visual",
    name: "CSS Visual & Estilo",
    icon: "🎨",
    color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    lessons: [
      {
        id: "css-l1",
        name: "Plano de Fundo Escuro",
        objective:
          "Substitua a cor de fundo do seu documento aplicando a regra background-color no body.",
        whatIs:
          'CSS gerencia o visual e design. O seletor "body" altera a página completa, e a propriedade background-color dita a cor do fundo.',
        analogy:
          "Funciona como pintar a parede de uma sala de estar vazia antes de escolher os móveis.",
        minCode: "body {\n  background-color: #090d16;\n}",
        defaultHtml:
          "<h1>Título de Teste</h1>\n<p>Veja como o fundo escuro melhora a leitura de madrugada.</p>",
        defaultCss:
          "/* Altere o background-color do body abaixo */\nbody {\n  background-color: white;\n  color: #333;\n}",
        defaultJs: "",
        specs: [
          {
            text: "body no CSS configurado com um fundo escuro (ex: #090d16, #0f172a, #1e1e2e)",
            check: (_, css) => {
              const dryCSS = css.replace(/\s/g, "").toLowerCase();
              return (
                dryCSS.includes("body{") &&
                (dryCSS.includes("background-color:#090d16") ||
                  dryCSS.includes("background-color:#0f172a") ||
                  dryCSS.includes("background-color:#1e1e2e") ||
                  dryCSS.includes("background-color:black") ||
                  dryCSS.includes("background:#") ||
                  dryCSS.includes("background-color:#"))
              );
            },
          },
        ],
      },
      {
        id: "css-l2",
        name: "Cabeçalhos Coloridos",
        objective:
          "Adicione uma cor marcante exclusiva para as tags h1 na folha de CSS.",
        whatIs:
          "O seletor direto escreve propriedades específicas apenas em elementos correspondentes, substituindo estilos genéricos.",
        analogy:
          "É como pintar somente as portas de madeira da casa de azul bebê para se destacarem do resto da parede.",
        minCode: "h1 {\n  color: #22c55e;\n}",
        defaultHtml: "<h1>Menu Principal</h1>\n<p>Texto comum do sistema.</p>",
        defaultCss:
          "body {\n  background-color: #0c0f17;\n  color: #f1f5f9;\n  font-family: sans-serif;\n}\n/* Adicione o seletor h1 abaixo */\n",
        defaultJs: "",
        specs: [
          {
            text: "Conter seletor h1 { ... } no estilo",
            check: (_, css) =>
              css.replace(/\s/g, "").toLowerCase().includes("h1{"),
          },
          {
            text: "Atribuir a propriedade color para uma tonalidade diferente",
            check: (_, css) => {
              const dry = css.replace(/\s/g, "").toLowerCase();
              return dry.includes("h1{") && dry.includes("color:");
            },
          },
        ],
      },
      {
        id: "css-l3",
        name: "Contornos & Bordas",
        objective:
          "Deixe as bordas e cantos do seu cartão com visual arredondado aplicando as propriedades border-radius e padding.",
        whatIs:
          "border-radius suaviza os cantos retos de caixas HTML, e padding empurra o conteúdo para dentro com excelente margem interna.",
        analogy:
          "É como colocar um estofado fofinho dentro de uma caixa de papelão dura e arredondar suas quinas cortantes.",
        minCode: ".cartao {\n  border-radius: 12px;\n  padding: 20px;\n}",
        defaultHtml:
          '<div class="cartao">\n  <h3>Informações Rápidas</h3>\n  <p>Conteúdo estrito da trilha prática de programação universal.</p>\n</div>',
        defaultCss:
          ".cartao {\n  background-color: #1e293b;\n  color: #f8fafc;\n  /* Arredonde os cantos e crie padding interno */\n}",
        defaultJs: "",
        specs: [
          {
            text: "Definir a propriedade border-radius para suavizar os cantos",
            check: (_, css) => css.includes("border-radius"),
          },
          {
            text: "Definir a propriedade padding para criar margem de respiração",
            check: (_, css) => css.includes("padding"),
          },
        ],
      },
      {
        id: "css-bug-challenge",
        name: "Desafio do Bug: O Botão Invisível",
        isBugChallenge: true,
        objective:
          'O botão de submissão sumiu da tela! O background-color da classe ".btn-invisivel" está idêntico ao background do body (#090d16) e o texto é da mesma cor. Altere o estilo do botão para que ele reapareça de forma nítida!',
        whatIs:
          "Garantir contraste visual entre elementos e fundos é uma das diretrizes essenciais de acessibilidade (WCAG). Se o texto e fundo forem iguais, o elemento se torna invisível.",
        analogy:
          "Escrever uma carta usando caneta preta sobre um papel preto te impede de ler e assinar o documento!",
        minCode:
          ".btn-invisivel {\n  background-color: #ca8a04;\n  color: #ffffff;\n}",
        defaultHtml:
          '<h2>Formulário Prático</h2>\n<button class="btn-invisivel">Enviar Resposta</button>',
        defaultCss:
          "body {\n  font-family: sans-serif;\n  background-color: #090d16;\n  color: #fff;\n  padding: 30px;\n}\n.btn-invisivel {\n  background-color: #090d16; /* Mude esta cor para verde, ouro ou indigo */\n  color: #090d16; /* Mude esta cor para uma legível, como white */\n  border: 1px solid #334155;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n}",
        defaultJs: 'console.log("Bug visual carregado!");',
        specs: [
          {
            text: "Modificar background-color da classe .btn-invisivel no CSS para algo diferente de #090d16",
            check: (_, css) => {
              const dry = css.replace(/\s/g, "").toLowerCase();
              return (
                dry.includes(".btn-invisivel{") &&
                !dry.includes("background-color:#090d16;") &&
                !dry.includes("background:#090d16;")
              );
            },
          },
          {
            text: "Modificar a propriedade color da classe .btn-invisivel no CSS para se destacar do fundo",
            check: (_, css) => {
              const dry = css.replace(/\s/g, "").toLowerCase();
              return (
                dry.includes(".btn-invisivel{") &&
                !dry.includes("color:#090d16;")
              );
            },
          },
        ],
      },
    ],
  },
  {
    id: "js-interativo",
    name: "JS Comportamental",
    icon: "⚡",
    color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    lessons: [
      {
        id: "js-l1",
        name: "Controlando o DOM",
        objective:
          "Mude de forma automática o conteúdo exibido de um título buscando-o pelo ID utilizando JavaScript.",
        whatIs:
          "O JS acessa a página através do DOM (Document Object Model). document.getElementById encontra o alvo e .textContent substitui o texto escrito.",
        analogy:
          'Imagine um interruptor em casa: com o ID "sala", você localiza a lâmpada correta do teto e muda seu estado.',
        minCode:
          'const elem = document.getElementById("titulo");\nelem.textContent = "Modificado!";',
        defaultHtml: '<h1 id="titulo">Título Original</h1>',
        defaultCss:
          "body { font-family: sans-serif; background: #0f172a; color: #fff; padding: 30px; }",
        defaultJs:
          "// Use document.getElementById para alterar o textContent abaixo\n",
        specs: [
          {
            text: 'Chamar document.getElementById("titulo") ou equivalente',
            check: (_, __, js) =>
              js.includes("document.getElementById") &&
              (js.includes("titulo") || js.includes("titulo")),
          },
          {
            text: "Modificar o conteúdo do texto por atribuição de textContent",
            check: (_, __, js) => js.includes(".textContent"),
          },
        ],
      },
      {
        id: "js-l2",
        name: "Escuta Automática de Cliques",
        objective:
          "Engaje um escutador de eventos addEventListener para alertar ou modificar a interface ao ser pressionado.",
        whatIs:
          'addEventListener aguarda um disparo físico do mouse, como "click", e executa em sequência uma função/procedimento de reflexo.',
        analogy:
          "É o sensor de presença do portão automático: sempre que algo passa (evento), o motor abre a grade (ação).",
        minCode:
          'const botao = document.getElementById("meu-botao");\nbotao.addEventListener("click", () => {\n  console.log("Clicado!");\n});',
        defaultHtml:
          '<button id="meu-botao">Aperte Aqui</button>\n<p id="feedback"></p>',
        defaultCss:
          "body { font-family: sans-serif; background: #0c0f17; color: #fff; text-align: center; padding: 40px; }\nbutton { background: #6366f1; border: none; color: white; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; }",
        defaultJs: "// Capture o botão e configure o clique\n",
        specs: [
          {
            text: "Encontrar o botão usando getElementById",
            check: (_, __, js) => js.includes("getElementById"),
          },
          {
            text: "Adicionar a escuta addeventlistener para o clique",
            check: (_, __, js) =>
              js.toLowerCase().includes("addeventlistener") &&
              js.toLowerCase().includes("click"),
          },
        ],
      },
      {
        id: "js-bug-challenge",
        name: "Desafio do Bug: Evento Fantasma",
        isBugChallenge: true,
        objective:
          "O botão de feedback parou de responder a cliques do mouse! Há um evidente erro de ortografia no nome do evento registrado pelo programador no addEventListener. Resolva a string de escuta!",
        whatIs:
          'O navegador só reconhece strings de eventos padronizadas do sistema, tais como "click", "keydown", "submit". Chamar "clik" faz o navegador ignorar silenciosamente o listener.',
        analogy:
          "Se você chamar o elevador assobiando em vez de apertar o botão físico de metal, a máquina nunca vai descer buscar você no térreo!",
        minCode: 'botao.addEventListener("click", () => { ... })',
        defaultHtml:
          '<button id="btn-click">Desparar Missão</button>\n<p id="feedback">Aguardando...</p>',
        defaultCss:
          "body { font-family: sans-serif; text-align: center; background-color: #07090e; color: #f1f5f9; padding: 40px; }\nbutton { background-color: #c084fc; border: none; color: #000; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; }",
        defaultJs:
          'const botao = document.getElementById("btn-click");\nconst resultado = document.getElementById("feedback");\n// O erro de digitação está na string "clik"\nbotao.addEventListener("clik", () => {\n  resultado.textContent = "Parabéns! Sistema de Depuração Concluído com Sucesso! 🥇";\n});',
        specs: [
          {
            text: 'Corrigir o ouvinte para usar o evento padrão e estrito de clique ("click")',
            check: (_, __, js) => {
              const cleaned = js.replace(/\s/g, "").toLowerCase();
              return (
                cleaned.includes('addeventlistener("click"') ||
                cleaned.includes("addeventlistener('click'") ||
                cleaned.includes("addeventlistener(`click`")
              );
            },
          },
          {
            text: "Configurar a mensagem de retorno com sucesso no clique",
            check: (_, __, js) => js.includes("textContent"),
          },
        ],
      },
    ],
  },
];

export default function CodeSandbox({
  onSendToMentor,
  isNightMode,
  isAutoFormatEnabled,
  onSolvedBug,
}: CodeSandboxProps) {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);

  const activeTrack = TRACKS[activeTrackIdx];
  const activeLesson = activeTrack.lessons[activeLessonIdx];

  // Code state derived from lesson selection
  const [htmlCode, setHtmlCode] = useState(activeLesson.defaultHtml);
  const [cssCode, setCssCode] = useState(activeLesson.defaultCss);
  const [jsCode, setJsCode] = useState(activeLesson.defaultJs);

  const [copied, setCopied] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [validationState, setValidationState] = useState<
    "idle" | "success" | "error"
  >("idle");

  const [isGuideMode, setIsGuideMode] = useState(false);
  const [isZenMode, setIsZenMode] = useState(true);
  const [showTeoria, setShowTeoria] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(() => {
    try {
      return localStorage.getItem("lab_sound_muted") === "true";
    } catch {
      return false;
    }
  });

  const playSound = (type: 'success' | 'error' | 'click') => {
    if (isSoundMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioCtx) return;

      if (type === 'click') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (type === 'success') {
        const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C retro level up!
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.08, audioCtx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.1 + 0.25);
          osc.start(audioCtx.currentTime + idx * 0.1);
          osc.stop(audioCtx.currentTime + idx * 0.1 + 0.3);
        });
      } else if (type === 'error') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch (err) {
      console.warn("Som indisponível:", err);
    }
  };

  const toggleMuteSound = () => {
    setIsSoundMuted((prev) => {
      const newVal = !prev;
      try {
        localStorage.setItem("lab_sound_muted", String(newVal));
      } catch {}
      return newVal;
    });
  };
  
  const formatCode = () => {
     if (activeTab === 'html') {
        let formatted = '';
        let indentLevel = 0;
        const tokens = htmlCode.replace(/>\s*</g, '>\n<').split('\n');
        tokens.forEach(line => {
          line = line.trim();
          if (!line) return;
          if (line.match(/^<\/[a-zA-Z0-9]+>/)) indentLevel = Math.max(0, indentLevel - 1);
          formatted += '  '.repeat(indentLevel) + line + '\n';
          if (line.match(/^<[a-zA-Z0-9]+/) && !line.match(/<\/[a-zA-Z0-9]+>/) && !line.match(/\/>$/) && !line.match(/^<(img|hr|br|meta|link|input)/i)) {
             indentLevel++;
          }
        });
        setHtmlCode(formatted.trim());
     }
     // Optional: simple CSS formatting
     if (activeTab === 'css') {
        let formatted = cssCode.replace(/\{\s*/g, ' {\n  ').replace(/;\s*/g, ';\n  ').replace(/\n\s*\}/g, '\n}').replace(/\}\s*/g, '}\n\n');
        setCssCode(formatted.trim());
     }
  };

  const toggleGuideMode = () => {
     if (!isGuideMode) {
        if (activeTab === 'html') {
           setHtmlCode(`<!-- O <!DOCTYPE html> avisa o navegador que usamos HTML5 -->\n<!DOCTYPE html>\n<html lang="pt-br">\n  <head>\n    <!-- <meta charset="UTF-8"> permite acentos e cecedilha (ç, á) -->\n    <meta charset="UTF-8">\n    <!-- <title> é o nome na aba do navegador -->\n    <title>Minha Página</title>\n  </head>\n  <body>\n    <!-- <h1> é o título principal, use apenas UM por página -->\n    <h1>Guia de Estrutura</h1>\n\n    <!-- <p> define um parágrafo normal de texto -->\n    <p>O Modo Guia está ativado! Observe como cada tag "filha" tem espaços (indentação) na lateral esquerda.</p>\n  </body>\n</html>`);
        } else if (activeTab === 'css') {
           setCssCode(`/* O CSS altera o visual da página! */\n\n/* Seleciona todo o "corpo" da página */\nbody {\n  /* Escolhe a fonte usada */\n  font-family: sans-serif;\n  /* Ajusta a cor de fundo */\n  background-color: #171717;\n  /* Ajusta a cor do texto */\n  color: #a3a3a3;\n  /* Adiciona espaçamento nas bordas internas */\n  padding: 20px;\n}\n\n/* Modifica apenas o título principal h1 */\nh1 {\n  color: #818cf8;\n}\n`);
        } else if (activeTab === 'js') {
           setJsCode(`// O JavaScript dá "vida" (interatividade) para a página!\n\n// console.log escreve uma mensagem invisível (só aparece para os programadores)\nconsole.log("Olá do Mentor TDAH da Madrugada!");\n\n// Você pode criar uma função (uma ordem pré-programada)\nfunction mostrarAlerta() {\n  // alert cria aquela "janelinha" irritante no navegador\n  alert("Você ativou o Modo Guia!");\n}\n\n// E depois, nós podemos pedir para rodar a função:\n// mostrarAlerta();`);
        }
     } else {
        // Restore default or keep it? Keep it so user can edit. Just disable the highlights.
     }
     setIsGuideMode(!isGuideMode);
  };

  // Sync state on lesson change
  useEffect(() => {
    setHtmlCode(activeLesson.defaultHtml);
    setCssCode(activeLesson.defaultCss);
    setJsCode(activeLesson.defaultJs);
    setLessonFinished(false);
    setValidationState("idle");
    setPreviewKey((prev) => prev + 1);
  }, [activeTrackIdx, activeLessonIdx]);

  // Play click sound on interactive navigation changes
  useEffect(() => {
    playSound('click');
  }, [activeTab, activeTrackIdx, activeLessonIdx]);

  // Compute test specifications in real time
  const specsChecked = useMemo(() => {
    return activeLesson.specs.map((spec) => ({
      text: spec.text,
      passed: spec.check(htmlCode, cssCode, jsCode),
    }));
  }, [htmlCode, cssCode, jsCode, activeLesson]);

  // Check if all automated specs passed
  const allSpecsPassed = useMemo(() => {
    return specsChecked.length > 0 && specsChecked.every((s) => s.passed);
  }, [specsChecked]);

  const handleVerifyCode = () => {
    if (allSpecsPassed) {
      setValidationState("success");
      setLessonFinished(true);
      playSound("success");

      if (onSolvedBug) {
        const lessonName = (activeLesson?.name || "").toLowerCase();
        let category = "Sintaxe JS";
        if (lessonName.includes("indent") || lessonName.includes("formatar") || lessonName.includes("clean") || lessonName.includes("espaç")) {
          category = "Indentação";
        } else if (lessonName.includes("tag") || lessonName.includes("órfã") || lessonName.includes("fecham") || lessonName.includes("abert") || lessonName.includes("h1") || lessonName.includes("p") || lessonName.includes("estrut")) {
          category = "Tags Órfãs";
        } else if (lessonName.includes("css") || lessonName.includes("estilo") || lessonName.includes("font") || lessonName.includes("cor") || lessonName.includes("background") || lessonName.includes("box") || lessonName.includes("grid") || lessonName.includes("flex")) {
          category = "Tipografia CSS";
        }
        onSolvedBug(category);
      }
    } else {
      setValidationState("error");
      playSound("error");
    }
  };

  // Global keyboard shortcuts for reduced clicks & extreme usability
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      // 1. Check for Command/Control + Enter to verify code
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleVerifyCode();
        return;
      }

      // Check Alt combinations
      if (e.altKey) {
        const key = e.key.toLowerCase();
        
        switch (key) {
          case "1":
          case "h":
            e.preventDefault();
            setActiveTab("html");
            break;
          case "2":
          case "c":
            e.preventDefault();
            setActiveTab("css");
            break;
          case "3":
          case "j":
            e.preventDefault();
            setActiveTab("js");
            break;
          case "v":
            e.preventDefault();
            handleVerifyCode();
            break;
          case "i":
          case "g":
            e.preventDefault();
            toggleGuideMode();
            break;
          case "n":
            e.preventDefault();
            if (lessonFinished) {
              handleNextLevel();
            } else if (activeLessonIdx < activeTrack.lessons.length - 1) {
              setActiveLessonIdx(prev => prev + 1);
            }
            break;
          case "p":
            e.preventDefault();
            if (activeLessonIdx > 0) {
              setActiveLessonIdx(prev => prev - 1);
            }
            break;
          case "r":
            e.preventDefault();
            restoreDefault();
            break;
          case "f":
            e.preventDefault();
            formatCode();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [
    activeLessonIdx,
    activeTrack.lessons.length,
    activeTrackIdx,
    allSpecsPassed,
    lessonFinished,
    activeTab,
    htmlCode,
    cssCode,
    jsCode
  ]);

  const combinedSrcDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <style>
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
        <script>
          try {
            ${jsCode}
          } catch(err) {
            console.error("Erro no script:", err.message);
          }
        </script>
      </body>
      </html>
    `;
  }, [htmlCode, cssCode, jsCode]);

  const copyCode = () => {
    let textToCopy = htmlCode;
    if (activeTab === "css") textToCopy = cssCode;
    if (activeTab === "js") textToCopy = jsCode;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextLevel = () => {
    if (activeLessonIdx < activeTrack.lessons.length - 1) {
      setActiveLessonIdx((prev) => prev + 1);
    } else if (activeTrackIdx < TRACKS.length - 1) {
      setActiveTrackIdx((prev) => prev + 1);
      setActiveLessonIdx(0);
    }
  };

  const handleAskMentor = () => {
    const payload = `🚨 [CÓDIGO DO LABORATÓRIO PRÁTICO PROGRESSIVO] 🚨

**TRILHA:** ${activeTrack.name}
**ATIVIDADE:** ${activeLesson.name}
**ESTADO ATUAL:** ${allSpecsPassed ? "Aprovado nos testes automáticos! 🎉" : "Tentando resolver os testes."}

------------------
**HTML (index.html):**
\`\`\`html
${htmlCode}
\`\`\`

**CSS (style.css):**
\`\`\`css
${cssCode}
\`\`\`

**Javascript (script.js):**
\`\`\`javascript
${jsCode}
\`\`\`

**OBJETIVO DA LIÇÃO:**
- ${activeLesson.objective}

**COMENTÁRIOS / DÚVIDA DO ESTUDANTE:**
Estou exercitando o laboratório prático web. Avalie meu progresso, dê dicas socráticas e apresente o próximo passo para manter o meu foco de estudo da madrugada ativo!`;

    onSendToMentor(payload);
  };

  const currentEditorCode = () => {
    if (activeTab === "css") return cssCode;
    if (activeTab === "js") return jsCode;
    return htmlCode;
  };

  const handleTextareaChange = (val: string) => {
    setValidationState("idle");
    if (activeTab === "css") setCssCode(val);
    else if (activeTab === "js") setJsCode(val);
    else setHtmlCode(val);
  };

  // Proactive Code Check-up
  const activeSyntaxHints = useMemo(() => {
    const hints: string[] = [];

    if (activeTab === "html") {
      const openTags = (
        htmlCode.match(/<([a-zA-Z1-6]+)(?![^>]*\/>)[^>]*>/g) || []
      )
        .map((t) => {
          const match = t.match(/<([a-zA-Z1-6]+)/);
          return match ? match[1].toLowerCase() : "";
        })
        .filter(
          (t) => !["img", "br", "hr", "input", "meta", "link"].includes(t),
        );

      const closeTags = (htmlCode.match(/<\/([a-zA-Z1-6]+)>/g) || []).map(
        (t) => {
          const match = t.match(/<\/([a-zA-Z1-6]+)>/);
          return match ? match[1].toLowerCase() : "";
        },
      );

      const openTagCounts: Record<string, number> = {};
      openTags.forEach((t) => (openTagCounts[t] = (openTagCounts[t] || 0) + 1));
      closeTags.forEach(
        (t) => (openTagCounts[t] = (openTagCounts[t] || 0) - 1),
      );

      Object.entries(openTagCounts).forEach(([tag, count]) => {
        if (count > 0 && count < 10) {
          hints.push(
            `Parece que há uma tag <${tag}> sem fechamento correspondente no HTML.`,
          );
        } else if (count < 0 && count > -10) {
          hints.push(
            `Parece haver uma tag de fechamento </${tag}> extra no HTML.`,
          );
        }
      });
    }

    if (activeTab === "css") {
      const openBraces = (cssCode.match(/\{/g) || []).length;
      const closeBraces = (cssCode.match(/\}/g) || []).length;
      if (openBraces > closeBraces) {
        hints.push("Falta fechar chaves '}' no seu código CSS.");
      } else if (closeBraces > openBraces) {
        hints.push("Há chaves '}' sobrando no seu CSS.");
      }

      const lines = cssCode.split("\n");
      let missingSemicolonCount = 0;
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (
          trimmed.includes(":") &&
          !trimmed.endsWith(";") &&
          !trimmed.endsWith("{") &&
          !trimmed.endsWith("}") &&
          !trimmed.startsWith("/*")
        ) {
          missingSemicolonCount++;
        }
      });
      if (missingSemicolonCount > 0 && closeBraces > 0) {
        hints.push(
          "Algumas propriedades CSS podem estar sem ponto e vírgula ';' no final da linha.",
        );
      }
    }

    if (activeTab === "js") {
      const openParen = (jsCode.match(/\(/g) || []).length;
      const closeParen = (jsCode.match(/\)/g) || []).length;
      if (openParen !== closeParen) {
        hints.push(
          "O número de parênteses abertos e fechados não bate no JavaScript.",
        );
      }

      const openBrace = (jsCode.match(/\{/g) || []).length;
      const closeBrace = (jsCode.match(/\}/g) || []).length;
      if (openBrace !== closeBrace) {
        hints.push(
          "O número de chaves abertas e fechadas não bate no JavaScript.",
        );
      }
    }

    return hints.slice(0, 3);
  }, [htmlCode, cssCode, jsCode, activeTab]);

  const injectSnippet = (snippetType: string) => {
    playSound('click');
    if (activeTab === "html") {
      let inlineSnippet = "";
      switch (snippetType) {
        case "button":
          inlineSnippet = '\n<button id="meu-novo-botao">Clique Aqui</button>';
          break;
        case "p":
          inlineSnippet = "\n<p>Adicionei um novo parágrafo explicativo!</p>";
          break;
        case "img":
          inlineSnippet = '\n<img src="https://picsum.photos/250/150" alt="Imagem de Teste" />';
          break;
        case "input":
          inlineSnippet = '\n<input type="text" placeholder="Escreva algo prático..." />';
          break;
        case "div":
          inlineSnippet = '\n<div style="padding: 10px; border: 1px dashed #6366f1;">\n  <h3>Nova Seção</h3>\n</div>';
          break;
        case "list":
          inlineSnippet = '\n<ul>\n  <li>Primeiro Item</li>\n  <li>Segundo Item</li>\n</ul>';
          break;
        case "form":
          inlineSnippet = '\n<form id="meu-formulario">\n  <label>Nome:</label>\n  <input type="text" />\n  <button type="submit">Enviar</button>\n</form>';
          break;
        default:
          break;
      }
      setHtmlCode((prev) => prev + inlineSnippet);
    } else if (activeTab === "css") {
      let inlineSnippet = "";
      switch (snippetType) {
        case "flex":
          inlineSnippet = '\n/* Layout Centralizado Flexbox */\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 10px;\n}';
          break;
        case "rounded":
          inlineSnippet = '\n/* Botão Minimalista Moderno */\n.btn {\n  border-radius: 8px;\n  padding: 10px 20px;\n  border: none;\n  cursor: pointer;\n}';
          break;
        case "glow":
          inlineSnippet = '\n/* Brilho Neon TDAH */\n.neon-glow {\n  box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);\n  border: 1.5px solid #6366f1;\n}';
          break;
        case "gradient":
          inlineSnippet = '\n/* Texto Gradiente */\n.texto-gradiente {\n  background: linear-gradient(135deg, #6366f1, #ec4899);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}';
          break;
        case "transition":
          inlineSnippet = '\n/* Efeito Suave ao Passar Mouse */\n.suave {\n  transition: all 0.25s ease-in-out;\n}\n.suave:hover {\n  transform: scale(1.05);\n}';
          break;
        default:
          break;
      }
      setCssCode((prev) => prev + inlineSnippet);
    } else if (activeTab === "js") {
      let inlineSnippet = "";
      switch (snippetType) {
        case "log":
          inlineSnippet = '\nconsole.log("Laboratório madrugador! Valor:", );';
          break;
        case "click":
          inlineSnippet = '\nconst btn = document.getElementById("btn-click");\nbtn.addEventListener("click", () => {\n  console.log("Botão clicado pelo aluno!");\n});';
          break;
        case "selector":
          inlineSnippet = '\nconst elemento = document.querySelector("#titulo");';
          break;
        case "text":
          inlineSnippet = '\nelemento.textContent = "Excelente progresso!";';
          break;
        case "style":
          inlineSnippet = '\nelemento.style.color = "#818cf8";';
          break;
          case "timeout":
          inlineSnippet = '\nsetTimeout(() => {\n  console.log("1 segundo se passou!");\n}, 1000);';
          break;
        default:
          break;
      }
      setJsCode((prev) => prev + inlineSnippet);
    }
  };

  const restoreDefault = () => {
    if (confirm("Deseja redefinir este exercício de volta ao código padrão?")) {
      setHtmlCode(activeLesson.defaultHtml);
      setCssCode(activeLesson.defaultCss);
      setJsCode(activeLesson.defaultJs);
      setPreviewKey((prev) => prev + 1);
    }
  };

  const content = (
    <div
      className={cn(
        "transition-colors",
        isFullscreen ? "fixed inset-0 z-[100] w-screen h-[100dvh] overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col" : "p-4 sm:p-5 rounded-2xl border",
        isFullscreen ? (isNightMode ? "bg-[#0a0a0a]" : "bg-[#111111]") : (isNightMode ? "bg-neutral-900/50 border-neutral-800" : "bg-neutral-900 border-neutral-800")
      )}
    >
      {/* Track Selector Header */}
      <div className={cn("flex flex-wrap items-center justify-between gap-3 mb-4", isFullscreen && "sticky top-0 z-10 pb-4 border-b border-neutral-800 bg-inherit")}>
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-white flex items-center gap-2">
            Laboratório Interativo Real-Time
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors ml-2"
              title={isFullscreen ? "Minimizar Laboratório" : "Foco Total no Laboratório (Tela Cheia)"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            <button 
              onClick={toggleMuteSound}
              className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors"
              title={isSoundMuted ? "Ativar Sons de Dopamina 🔊" : "Silenciar Laboratório 🔇"}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => { playSound('click'); setIsZenMode(!isZenMode); }}
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all flex items-center gap-1",
                isZenMode 
                  ? "bg-indigo-500/25 border-indigo-500/40 text-indigo-200 shadow-sm" 
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
              )}
              title={isZenMode ? "Desativar modo minimalista para ler analogia e teoria" : "Ativar modo minimalista (ocultar barras e teoria duplicada)"}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>{isZenMode ? "Modo Zen Ativo" : "Reduzir Carga (Zen)"}</span>
            </button>
          </h3>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {TRACKS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTrackIdx(idx);
                setActiveLessonIdx(0);
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center shrink-0 gap-1 ${activeTrackIdx === idx ? "bg-indigo-500 text-white" : "bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800"}`}
            >
              <span>{t.icon}</span>
              <span className="hidden xs:inline">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-neutral-400 mb-2 leading-relaxed">
        Não precisa alternar para o VS Code agora! Selecione as missões abaixo
        para escrever seu código com testes automatizados em tempo real.
      </p>

      {/* Sleek Gamified Progress Bar */}
      {!isZenMode && (() => {
        const completedLessons = activeLessonIdx;
        const totalLessons = activeTrack.lessons.length;
        const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
        return (
          <div className="mb-4 bg-neutral-950/50 p-2.5 rounded-xl border border-neutral-800/40">
            <div className="flex justify-between items-center mb-1.5 text-[10px]">
              <span className="font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-400" /> Progresso na Trilha: {activeTrack.name}
              </span>
              <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded">
                {activeLessonIdx} / {totalLessons} Missões ({progressPercentage}%)
              </span>
            </div>
            <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-neutral-800/60">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        );
      })()}

      {/* Level Roadmap Map Inside Current Track */}
      {!isZenMode && (
        <div className="bg-neutral-950/80 p-3 rounded-xl mb-4 border border-neutral-800/80 flex items-center gap-3 overflow-x-auto scrollbar-thin">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider shrink-0">
            Etapas:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto flex-nowrap scrollbar-none py-0.5">
            {activeTrack.lessons.map((les, idx) => {
              const isSelected = activeLessonIdx === idx;
              const isBug = les.isBugChallenge;
              return (
                <button
                  key={les.id}
                  onClick={() => setActiveLessonIdx(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? isBug
                        ? "bg-rose-500/10 border-rose-500 text-rose-300 animate-pulse"
                        : "bg-indigo-500/10 border-indigo-500 text-indigo-300"
                      : isBug
                        ? "bg-rose-950/30 hover:bg-rose-950/50 text-rose-400 border-rose-900/30"
                        : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800/80"
                  }`}
                >
                  {isBug ? (
                    <span className="flex items-center gap-1">🐛 Bug Master</span>
                  ) : (
                    <span>Nível {idx + 1}</span>
                  )}
                  <span className="hidden sm:inline font-normal opacity-90">
                    - {les.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Lesson Details & Instructions - Redesigned focusing on TDAH principles */}
      <div
        className={`p-4 rounded-xl mb-4 border space-y-3 transition-colors ${
          activeLesson.isBugChallenge
            ? "bg-rose-950/10 border-rose-500/20"
            : "bg-indigo-500/5 border-indigo-500/10"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider ${
              activeLesson.isBugChallenge ? "text-rose-400" : "text-indigo-400"
            }`}
          >
            {activeLesson.isBugChallenge ? (
              <Bug className="w-3.5 h-3.5 animate-bounce" />
            ) : (
              <Lightbulb className="w-3.5 h-3.5" />
            )}
            {activeLesson.isBugChallenge
              ? "DESAFIO DO BUG DO PROFESSOR"
              : `Missão ${activeLessonIdx + 1}: ${activeLesson.name}`}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">
            Regra dos 5 Minutos ⏱️
          </span>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white mb-1">
            O Objetivo Prático
          </h4>
          <p className="text-xs text-neutral-300 leading-relaxed font-semibold">
            {activeLesson.objective}
          </p>
        </div>

        {(!isZenMode || showTeoria) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-indigo-500/10 text-[11px] leading-relaxed text-neutral-400">
            <div>
              <span className="font-bold text-indigo-300">💡 O que é:</span>{" "}
              {activeLesson.whatIs}
            </div>
            <div>
              <span className="font-bold text-indigo-300">
                ✨ Analogia do Mundo Real:
              </span>{" "}
              {activeLesson.analogy}
            </div>
          </div>
        )}

        {(!isZenMode || showTeoria) && (
          <div className="p-2.5 rounded-lg bg-neutral-950 text-[11px] font-mono border border-neutral-800/80">
            <div className="flex items-center justify-between mb-1 text-[10px] text-neutral-500">
              <span>Código Mínimo Recomendado</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(activeLesson.minCode)
                }
                className="text-neutral-400 hover:text-white text-[9px] flex items-center gap-0.5"
              >
                <Copy className="w-2.5 h-2.5" /> Copiar Exemplo
              </button>
            </div>
            <pre className="text-indigo-300 whitespace-pre scrollbar-none overflow-x-auto">
              {activeLesson.minCode}
            </pre>
          </div>
        )}

        {isZenMode && (
          <div className="pt-2 flex items-center justify-between border-t border-neutral-850/60">
            <button
              onClick={() => { playSound('click'); setShowTeoria(!showTeoria); }}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showTeoria ? "Ocultar Ajuda Teórica & Exemplo 🧠" : "Expandir Teoria, Analogia & Código Mínimo 💡"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Specifications / Automated Tests checklist */}
      <div className="p-3 bg-neutral-950 rounded-xl mb-4 border border-neutral-800/80">
        <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Testes de Validação
          Automáticos:
        </h4>
        <div className="space-y-2 mb-3">
          {specsChecked.map((spec, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <div className="mt-0.5 shrink-0">
                {validationState !== "idle" ? (
                  spec.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/5" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-rose-500/80 flex items-center justify-center text-[10px] bg-rose-500/10">
                      <X className="w-2.5 h-2.5 text-rose-500" />
                    </div>
                  )
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-neutral-700/80 flex items-center justify-center text-[10px]" />
                )}
              </div>
              <span
                className={
                  validationState !== "idle" && spec.passed
                    ? "text-neutral-500 line-through"
                    : "text-neutral-300"
                }
              >
                {spec.text}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {!lessonFinished && (
            <button
              onClick={handleVerifyCode}
              className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-lg transition-colors border border-indigo-400/20"
            >
              <CheckCircle className="w-4 h-4" /> Verificar Código
            </button>
          )}

          {validationState === "error" && (
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-[11px] font-semibold text-center animate-pulse">
              Ainda há testes falhando. Revise seu código, observe a cor dos
              ícones acima e tente novamente!
            </div>
          )}
        </div>

        {lessonFinished && (
          <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-400 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold leading-tight">
                Incrível! Você acabou de passar em todos os testes desta missão!
                🎉
              </span>
            </div>
            <button
              onClick={handleNextLevel}
              className="bg-emerald-500 text-neutral-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded hover:bg-emerald-400 transition-colors w-full sm:w-auto text-center"
            >
              Avançar Próxima fase
            </button>
          </div>
        )}

        {/* Quick Level Navigation to avoid scrolling up */}
        <div className="mt-3.5 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between gap-2 text-[11px] text-neutral-400">
          <button
            onClick={() => {
              if (activeLessonIdx > 0) {
                playSound('click');
                setActiveLessonIdx(prev => prev - 1);
              }
            }}
            disabled={activeLessonIdx === 0}
            className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-40 disabled:hover:text-neutral-400"
            title="Voltar ao Nível Anterior (Alt + P)"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Anterior <kbd className="text-[9px] px-1 bg-neutral-900 border border-neutral-800 rounded font-mono">Alt+P</kbd>
          </button>
          
          <span className="text-[10px] text-neutral-500 font-bold">
            Missão {activeLessonIdx + 1} de {activeTrack.lessons.length}
          </span>

          <button
            onClick={() => {
              if (activeLessonIdx < activeTrack.lessons.length - 1) {
                playSound('click');
                setActiveLessonIdx(prev => prev + 1);
              }
            }}
            disabled={activeLessonIdx === activeTrack.lessons.length - 1}
            className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-40 disabled:hover:text-neutral-400"
            title="Avançar ao Próximo Nível (Alt + N)"
          >
            Próximo <kbd className="text-[9px] px-1 bg-neutral-900 border border-neutral-800 rounded font-mono">Alt+N</kbd> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor File Selector Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { playSound('click'); setActiveTab("html"); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === "html" ? "bg-neutral-800 text-white border border-neutral-700/80" : "text-neutral-500 hover:text-neutral-300"}`}
            title="Aba HTML (Alt + 1 ou Alt + H)"
          >
            index.html
            <kbd className="text-[8px] opacity-75 font-mono px-1 py-0.2 bg-neutral-900 rounded border border-neutral-700">Alt+1</kbd>
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab("css"); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === "css" ? "bg-neutral-800 text-white border border-neutral-700/80" : "text-neutral-500 hover:text-neutral-300"}`}
            title="Aba CSS (Alt + 2 ou Alt + C)"
          >
            style.css
            <kbd className="text-[8px] opacity-75 font-mono px-1 py-0.2 bg-neutral-900 rounded border border-neutral-700">Alt+2</kbd>
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab("js"); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === "js" ? "bg-neutral-800 text-white border border-neutral-700/80" : "text-neutral-500 hover:text-neutral-300"}`}
            title="Aba Javascript (Alt + 3 ou Alt + J)"
          >
            script.js
            <kbd className="text-[8px] opacity-75 font-mono px-1 py-0.2 bg-neutral-900 rounded border border-neutral-700">Alt+3</kbd>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleGuideMode}
            className={cn("transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border", isGuideMode ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "text-neutral-400 hover:text-white border-transparent hover:bg-neutral-800")}
          >
            <Info className="w-2.5 h-2.5" /> Guia
          </button>
          
          <button
            onClick={formatCode}
            className="text-neutral-400 hover:text-white transition-colors flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-neutral-800 border-transparent text-[10px]"
          >
            <Wand2 className="w-2.5 h-2.5 text-purple-400" /> Formatar
          </button>

          <span className="text-neutral-700 font-mono hidden sm:inline">|</span>

          <button
            onClick={restoreDefault}
            className="text-neutral-500 hover:text-white transition-colors flex items-center gap-0.5 text-[10px]"
          >
            <RotateCcw className="w-2.5 h-2.5" /> Resetar
          </button>
          <span className="text-neutral-700 font-mono">|</span>
          <button
            onClick={copyCode}
            className="text-neutral-500 hover:text-white transition-colors flex items-center gap-1 text-[10px]"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copiar Aba
              </>
            )}
          </button>
        </div>
      </div>

      {/* Helper Element Injections for Active Tab (HTML, CSS or JS) */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2.5 border-b border-neutral-800/60 mb-3 animate-in fade-in duration-200">
        <span className="text-[10px] font-bold text-neutral-400 mr-1.5 uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" /> Inserção Automática ({activeTab.toUpperCase()}):
        </span>
        {activeTab === "html" && (
          <>
            <button
              onClick={() => injectSnippet("button")}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-[10px] font-mono border border-indigo-500/20 transition-all"
              title="Cria um botão simples com ID"
            >
              &lt;button&gt;
            </button>
            <button
              onClick={() => injectSnippet("p")}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-[10px] font-mono border border-indigo-500/20 transition-all"
              title="Cria um parágrafo de texto descritivo"
            >
              &lt;p&gt;
            </button>
            <button
              onClick={() => injectSnippet("img")}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-[10px] font-mono border border-indigo-500/20 transition-all"
              title="Cria uma tag de imagem com src e alt"
            >
              &lt;img&gt;
            </button>
            <button
              onClick={() => injectSnippet("input")}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-[10px] font-mono border border-indigo-500/20 transition-all"
              title="Cria uma caixa de entrada de texto"
            >
              &lt;input&gt;
            </button>
            <button
              onClick={() => injectSnippet("div")}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-[10px] font-mono border border-indigo-500/20 transition-all"
              title="Cria uma caixa divisória estilizada"
            >
              &lt;div&gt;
            </button>
            <button
              onClick={() => injectSnippet("list")}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-[10px] font-mono border border-indigo-500/20 transition-all"
              title="Cria uma lista não ordenada com itens"
            >
              &lt;ul&gt; &lt;li&gt;
            </button>
            <button
              onClick={() => injectSnippet("form")}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-[10px] font-mono border border-indigo-500/20 transition-all"
              title="Cria uma estrutura de formulário"
            >
              &lt;form&gt;
            </button>
          </>
        )}
        {activeTab === "css" && (
          <>
            <button
              onClick={() => injectSnippet("flex")}
              className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 px-2 py-1 rounded text-[10px] font-mono border border-teal-500/20 transition-all"
              title="Escreve propriedades flexbox para centralização"
            >
              Centralizar Div
            </button>
            <button
              onClick={() => injectSnippet("rounded")}
              className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 px-2 py-1 rounded text-[10px] font-mono border border-teal-500/20 transition-all"
              title="Escreve design moderno de botão com cantos arredondados"
            >
              Botão Moderno
            </button>
            <button
              onClick={() => injectSnippet("glow")}
              className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 px-2 py-1 rounded text-[10px] font-mono border border-teal-500/20 transition-all"
              title="Escreve um brilho neon violeta"
            >
              Brilho Neon
            </button>
            <button
              onClick={() => injectSnippet("gradient")}
              className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 px-2 py-1 rounded text-[10px] font-mono border border-teal-500/20 transition-all"
              title="Escreve um efeito de texto em degradê"
            >
              Texto Gradiente
            </button>
            <button
              onClick={() => injectSnippet("transition")}
              className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 px-2 py-1 rounded text-[10px] font-mono border border-teal-500/20 transition-all"
              title="Escreve efeito hover com escala e transição suave"
            >
              Efeito Suave
            </button>
          </>
        )}
        {activeTab === "js" && (
          <>
            <button
              onClick={() => injectSnippet("log")}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-[10px] font-mono border border-amber-500/20 transition-all"
              title="Escreve um debug no console"
            >
              console.log
            </button>
            <button
              onClick={() => injectSnippet("click")}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-[10px] font-mono border border-amber-500/20 transition-all"
              title="Escreve um escutador de clique"
            >
              Escutar Clique
            </button>
            <button
              onClick={() => injectSnippet("selector")}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-[10px] font-mono border border-amber-500/20 transition-all"
              title="Seleciona elemento pela ID ou classe"
            >
              document.querySelector
            </button>
            <button
              onClick={() => injectSnippet("text")}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-[10px] font-mono border border-amber-500/20 transition-all"
              title="Muda o texto interno de um elemento"
            >
              Mudar Texto
            </button>
            <button
              onClick={() => injectSnippet("style")}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-[10px] font-mono border border-amber-500/20 transition-all"
              title="Muda a cor de estilo inline"
            >
              Mudar Cor inline
            </button>
            <button
              onClick={() => injectSnippet("timeout")}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-[10px] font-mono border border-amber-500/20 transition-all"
              title="Executa ação após delay de tempo"
            >
              Delay (setTimeout)
            </button>
          </>
        )}
      </div>

      {/* Code Editor */}
      <div className="relative flex-1 flex flex-col min-h-[176px]">
        <textarea
          value={currentEditorCode()}
          onChange={(e) => handleTextareaChange(e.target.value)}
          onBlur={() => {
             if (isAutoFormatEnabled && !isGuideMode) {
               formatCode();
             }
          }}
          className={cn(
            "w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 font-mono text-xs text-indigo-300 focus:outline-none focus:border-indigo-500/50 resize-none leading-relaxed",
            isFullscreen ? "flex-1 min-h-[30vh]" : "h-44"
          )}
          placeholder={`Escreva seu código ${activeTab.toUpperCase()} aqui...`}
        />

        {activeSyntaxHints.length > 0 && (
          <div className="absolute bottom-2 right-2 left-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-2 flex items-start gap-2 backdrop-blur-sm pointer-events-none">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                {activeSyntaxHints.map((hint, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-amber-300/90 leading-tight"
                  >
                    {hint}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Preview Area */}
      <div className={cn("mt-4 flex flex-col", isFullscreen && "flex-1 min-h-[35vh]")}>
        <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-950 border border-neutral-800 border-b-0 rounded-t-lg text-xs text-neutral-500 shrink-0">
          <span className="flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5" /> Visualização do Navegador
          </span>
          <button
            onClick={() => setPreviewKey((prev) => prev + 1)}
            className="hover:text-white transition-colors text-[10px] flex items-center gap-1"
          >
            <RefreshCw className="w-3" /> Atualizar
          </button>
        </div>
        <div className={cn("bg-white rounded-b-lg border border-neutral-800 overflow-hidden", isFullscreen ? "flex-1 flex" : "h-32")}>
          <iframe
            key={previewKey}
            title="Preview"
            srcDoc={combinedSrcDoc}
            className="w-full h-full bg-white flex-1"
            sandbox="allow-scripts"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleAskMentor}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" /> Enviar para Análise do Mentor
        </button>
      </div>

      {/* VS Code Help Advice conforming to rules */}
      <div className="mt-4 p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/80 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-[10px] text-neutral-500 leading-relaxed">
          <span className="font-semibold text-neutral-300">
            Como testar no VS Code real:
          </span>{" "}
          Crie um arquivo no computador chamado{" "}
          <code className="text-indigo-400 bg-neutral-900 px-1 rounded">
            index.html
          </code>
          , cole toda a sua estrutura de código, clique com o botão direito nele
          no VS Code e selecione{" "}
          <span className="text-neutral-300">"Open with Live Server"</span> para
          ver no seu navegador padrão!
        </div>
      </div>

      {/* Professor Visual & Productivity Extensions Setup */}
      <div className="mt-2.5 p-3.5 rounded-xl border border-indigo-500/10 bg-indigo-950/10">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Setup Visual Recomendado do Professor
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="p-2 rounded bg-neutral-950/60 border border-neutral-800/50">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-bold text-indigo-300">
                🧛‍♂️ Dracula Theme / Dracula Soft
              </span>
              <span className="text-[9px] bg-purple-500/15 text-purple-300 font-bold px-1.5 py-0.5 rounded uppercase font-sans">
                Cores & Olhos
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-normal">
              Facilita identificar tags abertas, tags órfãs (não fechadas) e
              classes CSS através de cores vibrantes e limpas. Protege muito sua
              vista no cansaço da madrugada.
            </p>
          </div>
          <div className="p-2 rounded bg-neutral-950/60 border border-neutral-800/50">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-bold text-indigo-300">
                ✨ Prettier - Code Formatter
              </span>
              <span className="text-[9px] bg-indigo-500/15 text-indigo-300 font-bold px-1.5 py-0.5 rounded uppercase font-sans">
                Formatação
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-normal">
              Alinha e indenta tags aninhadas de forma 100% automática ao
              salvar. Evita o cansaço visual de organizar espaços e traços
              manualmente.
            </p>
          </div>
          <div className="p-2 rounded bg-neutral-950/60 border border-neutral-800/50">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-bold text-indigo-300">
                🛸 Agente Antigravity (IA Copiloto)
              </span>
              <span className="text-[9px] bg-emerald-500/15 text-emerald-300 font-bold px-1.5 py-0.5 rounded uppercase font-sans">
                Você está usando agora!
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-normal">
              Nosso motor cognitivo integrado aqui no navegador. Ele analisa,
              explica, sugere micro-desafios práticos e treina sua mente de
              forma ativa, sem que você fique dependente de códigos prontos do
              ChatGPT.
            </p>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Helper Panel at the bottom of Sandbox */}
      <div className="mt-3.5 p-3 rounded-xl bg-neutral-950/40 border border-neutral-800/80 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Atalhos de Sobrevivência TDAH (Teclado)
          </span>
          <span className="text-[9px] text-indigo-400/90 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded font-semibold">
            Sem mouse, máxima concentração!
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mt-2.5 text-[10px] text-neutral-400 font-mono">
          <div className="flex items-center gap-1.5 bg-neutral-900/60 p-1 rounded border border-neutral-800/50">
            <kbd className="bg-neutral-950 border border-neutral-800 px-1 py-0.5 rounded text-indigo-400 text-[9px] font-bold">Ctrl + Enter</kbd>
            <span>Verificar Código</span>
          </div>
          <div className="flex items-center gap-1.5 bg-neutral-900/60 p-1 rounded border border-neutral-800/50">
            <kbd className="bg-neutral-950 border border-neutral-800 px-1 py-0.5 rounded text-indigo-400 text-[9px] font-bold">Alt + 1 / 2 / 3</kbd>
            <span>Abas index/style/script</span>
          </div>
          <div className="flex items-center gap-1.5 bg-neutral-900/60 p-1 rounded border border-neutral-800/50">
            <kbd className="bg-neutral-950 border border-neutral-800 px-1 py-0.5 rounded text-indigo-400 text-[9px] font-bold">Alt + N / P</kbd>
            <span>Nível Próximo / Anterior</span>
          </div>
          <div className="flex items-center gap-1.5 bg-neutral-900/60 p-1 rounded border border-neutral-800/50">
            <kbd className="bg-neutral-950 border border-neutral-800 px-1 py-0.5 rounded text-indigo-400 text-[9px] font-bold">Alt + Q</kbd>
            <span>Chat ⇆ Laboratório</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return createPortal(content, document.body);
  }

  return content;
}
