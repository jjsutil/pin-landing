// Cross-language slug map for the blog (I-011). Both directions derived from
// one literal table so ES and EN can never drift out of sync with each other.
export const ES_TO_EN: Record<string, string> = {
  'como-funciona-rag-de-verdad-y-donde-falla-en-silencio': 'how-rag-actually-works-and-where-it-silently-fails',
  'como-funcionan-de-verdad-la-inferencia-y-la-interpretabilidad': 'how-inference-and-interpretability-actually-work',
  'como-se-lee-un-expediente-escaneado': 'how-a-scanned-case-file-is-read',
  'como-se-verifica-una-respuesta-de-ia': 'how-an-ai-answer-is-verified',
  'es-legal-usar-ia-para-trabajar': 'is-it-legal-to-use-ai-for-work',
  'ocr-lo-que-aprendimos-y-lo-que-dice-la-literatura': 'ocr-what-we-learned-and-what-the-literature-says',
  'por-que-empece-pin': 'why-i-started-pin',
  'por-que-ninguna-herramienta-le-sirvio': 'why-no-tool-has-worked-for-you',
  'que-es-machine-learning': 'what-machine-learning-actually-is',
  'que-pasa-con-su-expediente-cuando-lo-sube': 'what-happens-to-your-case-file-when-you-upload-it',
};

export const EN_TO_ES: Record<string, string> = Object.fromEntries(
  Object.entries(ES_TO_EN).map(([es, en]) => [en, es]),
);
