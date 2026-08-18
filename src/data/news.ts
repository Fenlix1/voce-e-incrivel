export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  image: string;
  author?: string;
}

export const defaultNews: NewsItem[] = [
  {
    id: "projeto-chega-belford-roxo",
    title: "Projeto 'Você é Incrível' Chega a Belford Roxo com Aulas Gratuitas",
    summary:
      "Nova iniciativa oferece oito modalidades esportivas gratuitas para todas as idades no Barro Vermelho.",
    content: `Com grande entusiasmo, anunciamos a chegada do projeto social "Você é Incrível" ao bairro Barro Vermelho, em Belford Roxo. A iniciativa nasce com a missão de transformar vidas através do esporte, oferecendo oito modalidades gratuitas para crianças, adolescentes, adultos e idosos.

O projeto conta com o apoio do Deputado Federal Dr. Luizinho e de lideranças comunitárias comprometidas com o desenvolvimento social da região.

"Queremos criar um espaço onde cada pessoa se sinta acolhida e motivada a buscar o melhor de si através do esporte", afirma a coordenação do projeto.`,
    date: "2026-07-10",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    author: "Equipe Você é Incrível",
  },
  {
    id: "inauguracao-preparativos",
    title: "Preparativos para a Grande Inauguração estão a Todo Vapor",
    summary:
      "Estrutura está sendo finalizada para receber a comunidade no dia 18 de julho com programação especial.",
    content: `A contagem regressiva já começou! A equipe do projeto "Você é Incrível" trabalha intensamente nos preparativos para a inauguração oficial, que acontecerá no dia 18 de julho de 2026.

O espaço está recebendo os últimos ajustes para oferecer a melhor experiência aos participantes. A programação do dia da inauguração inclui apresentações das modalidades, presença de autoridades locais e um café da manhã especial para toda a comunidade.

Não perca! A entrada é gratuita e todos são bem-vindos.`,
    date: "2026-07-12",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    author: "Equipe Você é Incrível",
  },
  {
    id: "beneficios-atividade-fisica",
    title: "Especialistas Destacam os Benefícios da Atividade Física para Todas as Idades",
    summary:
      "Nutricionista e profissionais da saúde explicam como o exercício regular transforma a qualidade de vida.",
    content: `A atividade física regular é um dos pilares fundamentais para uma vida saudável. No projeto "Você é Incrível", contamos com profissionais da saúde e nutricionista esportiva para orientar todos os participantes sobre a importância de aliar exercício e alimentação equilibrada.

"O esporte não apenas fortalece o corpo, mas também a mente. Cada pessoa que se exercita descobre uma nova versão de si mesma", destaca a equipe de saúde do projeto.

As aulas são adaptadas para cada faixa etária, garantindo segurança e efetividade para crianças, adultos e idosos.`,
    date: "2026-07-05",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    author: "Equipe Você é Incrível",
  },
];

export function getNews(): NewsItem[] {
  if (typeof window === "undefined") return defaultNews;
  try {
    const stored = localStorage.getItem("news");
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultNews;
}

export function setNews(news: NewsItem[]) {
  localStorage.setItem("news", JSON.stringify(news));
}
