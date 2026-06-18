import { useState, useEffect } from 'react';

export interface ArchitectureTip {
  id: string;
  title: string;
  category: 'Arquitetura' | 'JavaScript' | 'TypeScript' | 'Python';
  content: string;
  duration: number; // e.g., 30 for 30s
}

export const ARCHITECTURE_TIPS: ArchitectureTip[] = [
  {
    id: 'solid-single-responsibility',
    title: 'Princípio de Responsabilidade Única (SRP)',
    category: 'Arquitetura',
    content: 'Uma classe ou função deve ter apenas um motivo para mudar. Se um componente React faz buscas HTTP, formata datas e renderiza a UI, divida-o em hooks customizados e componentes puros de apresentação.',
    duration: 30
  },
  {
    id: 'ts-satisfies-operator',
    title: 'O Operador "satisfies" no TypeScript',
    category: 'TypeScript',
    content: 'Use "satisfies" para validar que uma expressão corresponde a um tipo, mas mantendo o tipo mais específico inferido. Isso evita perda de autocompletação em objetos com propriedades dinâmicas estruturadas.',
    duration: 30
  },
  {
    id: 'js-memory-leaks',
    title: 'Evitando Memory Leaks com useEffect',
    category: 'JavaScript',
    content: 'Sempre limpe seus listeners, timeouts ou subscrições na função de retorno do seu useEffect. Se você usar EventListeners no window ou setInterval, um return () => clearInterval(id) é obrigatório!',
    duration: 30
  },
  {
    id: 'clean-arch-separation',
    title: 'Separação de Preocupações (SoC)',
    category: 'Arquitetura',
    content: 'Mantenha regras de negócio de madrugada desacopladas do framework (React/Express). Sua lógica pura de cálculo ou validação de dados deve rodar no Node ou no navegador sem depender de APIs específicas da UI.',
    duration: 30
  },
  {
    id: 'python-generators',
    title: 'Python Generators para economia de Memória',
    category: 'Python',
    content: 'Use geradores (com yield) ou generator expressions ao processar grandes conjuntos de dados. Diferente de listas completas na memória, geradores avaliam os itens sob demanda, reduzindo drasticamente o consumo de RAM.',
    duration: 30
  },
  {
    id: 'node-event-loop',
    title: 'Não bloqueie o Event Loop do Node.js',
    category: 'JavaScript',
    content: 'Evite CPU-bound tasks síncronas pesadas (como criptografia pesada ou parse de arquivos gigantes). Use Worker Threads ou mude para processamento assíncrono para permitir que o Node trate novas conexões de rede.',
    duration: 30
  },
  {
    id: 'react-server-components',
    title: 'React Server Components (RSC)',
    category: 'Arquitetura',
    content: 'RSCs renderizam direto no servidor, reduzindo o tamanho do bundle de JavaScript enviado ao cliente. Use Server Components por padrão para busca de dados rápidos e Client Components ("use client") apenas para interações.',
    duration: 30
  },
  {
    id: 'py-type-hinting',
    title: 'Python Type Hinting com Pydantic',
    category: 'Python',
    content: 'Use Type Hints no Python moderno combinados com o Pydantic para validação robusta de dados em tempo de execução. Isso cria endpoints seguros de APIs no FastAPI que já validam as entradas automaticamente.',
    duration: 30
  },
  {
    id: 'dry-overengineering',
    title: 'Cuidado com DRY prematuro (Overengineering)',
    category: 'Arquitetura',
    content: '"Duplicação é muito mais barata do que a abstração errada". Se dois trechos de código parecem iguais mas vão evoluir em direções diferentes, prefira mantê-los separados para evitar acoplamento nocivo.',
    duration: 30
  },
  {
    id: 'ts-utility-types',
    title: 'Aproveite Omit e Pick no TypeScript',
    category: 'TypeScript',
    content: 'Evite recriar interfaces parecidas. Se você precisa de um subconjunto de propriedades de um Usuário para criação, use Pick<User, "name" | "email"> ou Omit<User, "id"> para manter seu código limpo e tipado sintonizado.',
    duration: 30
  },
  {
    id: 'node-native-env',
    title: 'Variáveis de Ambiente Nativas no Node 20+',
    category: 'JavaScript',
    content: 'No Node.js moderno, você não precisa mais da biblioteca extra "dotenv". Use a flag nativa "node --env-file=.env server.js" para gerenciar credenciais, limpando dependências desnecessárias do arquivo package.json.',
    duration: 30
  },
  {
    id: 'immutability-benefits',
    title: 'Benefícios de Estruturas Imutáveis',
    category: 'Arquitetura',
    content: 'Trabalhar com dados imutáveis reduz bugs difíceis de rastrear. Em React, nunca altere o estado diretamente: use spreads como [...antigos, novo] para que o React detecte a mudança por referência e atualize a tela de forma limpa.',
    duration: 30
  }
];

export function useArchitectureTips(isActive: boolean) {
  const [activeTip, setActiveTip] = useState<ArchitectureTip | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Trigger every 20 minutes (20 * 60 = 1200 seconds)
    const INTERVAL_SECONDS = 1200; 
    let elapsedActiveSeconds = 0;

    const timer = setInterval(() => {
      elapsedActiveSeconds += 1;
      if (elapsedActiveSeconds >= INTERVAL_SECONDS) {
        elapsedActiveSeconds = 0;
        // Pick a random tip
        const randomTip = ARCHITECTURE_TIPS[Math.floor(Math.random() * ARCHITECTURE_TIPS.length)];
        setActiveTip(randomTip);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isActive]);

  const dismissTip = () => {
    setActiveTip(null);
  };

  const triggerRandomTipManual = () => {
    const randomTip = ARCHITECTURE_TIPS[Math.floor(Math.random() * ARCHITECTURE_TIPS.length)];
    setActiveTip(randomTip);
  };

  return { activeTip, dismissTip, triggerRandomTipManual, setActiveTip };
}
