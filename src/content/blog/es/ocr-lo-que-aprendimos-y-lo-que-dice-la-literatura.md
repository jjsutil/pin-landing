---
title: "La falla de OCR que debería preocuparle no se ve como texto corrupto. Se ve como 98% de confianza y un párrafo faltante."
slug: "ocr-lo-que-aprendimos-y-lo-que-dice-la-literatura"
excerpt: "Construimos nuestro pipeline de OCR como una cascada enrutada por confianza, lo comparamos contra tres herramientas más nuevas de comprensión de documentos, y después le tiramos encima escaneos genuinamente sucios y vimos a la red de seguridad no atajar cuatro bugs reales. Lo que encontramos, y lo que la literatura actual realmente respalda."
publishDate: 2026-08-20
author: "Equipo fundador de pin"
tags: ["OCR", "Herramientas de IA", "Ingeniería"]
draft: false
readingMinutes: 9
---

El pipeline terminó la página con 98% de confianza. Nada aguas abajo lo marcó. A la página también le faltaba una línea completa de texto.

Ese es el hallazgo que nos hizo replantear cómo pensamos la falla de OCR. [Ya escribimos qué es el OCR y por qué importa](../como-se-lee-un-expediente-escaneado/) para un lector que necesita el concepto explicado. Este post es lo opuesto: para el lector que ya sabe qué es OCR y quiere saber qué se rompe de verdad, qué respalda la literatura actual, y qué hicimos mal construyéndolo — las afirmaciones reutilizadas enlazan a ese post en vez de reargumentarlas.

## Dónde falla el OCR de verdad, y no es donde se imagina

El texto corrupto es la falla que todo el mundo mide en un benchmark, y es la más fácil de detectar — una persona mirando por encima nota la basura de inmediato. La falla que realmente le cuesta plata es más silenciosa.

Corremos un motor de OCR de propósito general, de primera generación, sobre escaneos reales, y falla con confianza y en silencio de maneras que un benchmark limpio nunca muestra:

- El paso de puntaje de confianza de una página descarta sus propias líneas de baja confianza *antes* de que el promedio a nivel de página llegue a verlas — así que una página que de hecho contiene una mala lectura reporta un puntaje limpio, porque la mala lectura ya fue descartada para cuando alguien lo revisó.
- Un PDF escaneado a veces trae una capa de texto OCR preexistente — estampada ahí por el escáner o la fotocopiadora que lo produjo — y lo perezoso es confiar en ella como verdad de referencia. Eso hicimos, con confianza plena, incluso cuando esa capa ajena estaba visiblemente mal ("Contestaci6n de la dernanda").
- Un timbre de numeración de folio en el margen se pega a la línea de prosa contigua, convirtiendo una cita en texto contaminado: "por delito de 0000372 Terrorismo" es un ejemplo real de un timbre de foliación fundiéndose con un cargo penal.
- Un clasificador de rotación voltea 180° una línea genuinamente derecha porque su propio puntaje de confianza apenas supera el umbral — y subir el umbral no lo arregla, solo cambia un falso positivo por otros medidos igual de altos en la misma página.

Ninguno de estos cuatro es texto corrupto. Los cuatro pasaron un chequeo de confianza ingenuo. **La lección debajo de los cuatro: un puntaje de confianza es tan confiable como todo lo que lo alimentó, y cada uno de los nuestros tenía un punto donde eso se rompía.**

## La tarde que importó más que cualquier benchmark

Ya habíamos medido nuestro pipeline contra un conjunto de verdad de referencia etiquetado a mano. El número que de verdad cambió nuestra arquitectura no salió de ese benchmark — salió de una tarde corriendo el motor contra dos documentos genuinamente sucios: escritos judiciales públicos, no confidenciales, no datos de un cliente, elegidos específicamente porque eran el tipo de material que hace que los benchmarks se vean mejor de lo que rinden en producción. Escaneos de máquina de escribir, timbres de foliación, manuscrito en el margen, páginas torcidas, cuadros de tarjado. 52 páginas.

El pipeline terminó las 52 páginas, cero caídas. Esa es la parte fácil. **El hallazgo que importó: la cascada de seguridad que habíamos construido específicamente para atajar malas lecturas no se activó ni una sola vez**, a pesar de cuatro fallas reales y distintas en esa misma corrida. No porque la cascada estuviera mal diseñada — porque cada falla encontró un hueco distinto de lo que la cascada podía ver.

Arreglar cada una nos enseñó algo más general que el bug específico:

**La señal de confianza se mentía a sí misma.** Nuestra llamada al motor de OCR clásico descartaba en silencio las líneas de baja confianza dentro de la propia llamada a la librería, antes de que nuestro propio promedio de confianza a nivel de página llegara a verlas. La red de seguridad estaba promediando solo a los sobrevivientes. Un arreglo de una línea — dejar de descartar dentro de la llamada, dejar que nuestra propia lógica decida qué confiar — pero es el tipo de bug que le enseña a preguntar, ante cualquier puntaje de confianza que usted no calculó: *¿qué descartó este número antes de llegar a mí?*

**Confiar en una respuesta "confiada" que vino de otro lado.** El arreglo acá — detectar cuándo el texto embebido de un PDF fue dibujado en modo de renderizado invisible (la marca estándar de un escáner o fotocopiadora estampando texto de OCR sobre su propia imagen) y volver a leer los píxeles sin importar qué texto ya estuviera "ahí" — tomó dos intentos. La API teóricamente correcta para el trabajo causaba una caída de bajo nivel no capturable a escala, así que el arreglo real interpreta el flujo de contenido crudo a mano. La lección general sobrevive a la anécdota específica: la confianza de un sistema aguas arriba no es su confianza, incluso cuando viene disfrazada de texto plano en vez de un puntaje.

**Un umbral no arregla lo que un umbral no puede ver.** Subir la barra de confianza del clasificador de rotación no ayudó, porque el falso positivo que encontramos y los falsos negativos que habríamos creado quedaban a ambos lados de la misma franja angosta. Lo que funcionó fue agregar una segunda pasada, condicionada por confianza, que re-examina un caso límite en vez de simplemente confiar más fuerte en un solo número.

## Qué respalda de verdad la literatura actual

Tres afirmaciones que vale la pena fundamentar, porque "la IA ya lee documentos" hace mucho trabajo no ganado en la mayoría de las conversaciones de venta.

**Los modelos transformer de extremo a extremo de verdad superan en precisión al pipeline de OCR clásico** — esto no es marketing, es un resultado medido. [Li et al. (TrOCR, AAAI 2023)](https://doi.org/10.1609/aaai.v37i11.26538) reportan que un modelo preentrenado que va de un transformer de imagen a un transformer de texto supera al estado del arte anterior en reconocimiento de texto impreso, manuscrito *y* de escena, reemplazando el pipeline más viejo de CNN-para-visión más RNN-para-texto más un modelo de lenguaje aparte por un solo modelo de extremo a extremo. Ese resultado es real, y es la razón por la que un modelo de visión y lenguaje tiene sentido en una arquitectura de OCR moderna.

**De ahí no se sigue que el modelo más nuevo gane en todo, y medir eso con honestidad es todo el trabajo.** Corrimos nuestro propio modelo de visión y lenguaje (un modelo de unos pocos miles de millones de parámetros, elegido justamente por ser lo bastante chico para correr sin un rack de GPUs) contra nuestro motor clásico sobre el mismo conjunto de verdad de referencia etiquetado a mano, en GPU, a escala completa. Reduce aproximadamente a la mitad la tasa de error del motor clásico en manuscrito. *Pierde* contra el motor clásico en texto impreso y mixto — el mismo material donde el motor clásico ya era barato y preciso. El hallazgo honesto no fue "el modelo nuevo es mejor", fue "el modelo nuevo es el especialista en manuscrito, no un reemplazo" — y ese hallazgo solo salió de medir sobre nuestro propio material, no de confiar en una tabla de posiciones de un benchmark.

**Los benchmarks entrenados sobre fuentes de documentos limpias y angostas no predicen el desempeño en el mundo real, y el campo lo sabe.** [Pfitzmann et al. (DocLayNet, KDD 2022)](https://arxiv.org/abs/2206.01062) construyeron un dataset de 80.000 páginas anotadas a mano que abarca finanzas, ciencia, patentes, licitaciones, manuales *y textos legales* específicamente porque los datasets estándar anteriores (PubLayNet, DocBank) venían enteramente de PDFs de artículos científicos limpios y "carecen severamente de variabilidad de diseño" — los modelos entrenados sobre ellos no generalizan a la diversidad de diseño que un pipeline de documentos real de verdad encuentra. Es la misma lección que nos enseñó nuestra tarde de escaneos sucios a nivel del error de OCR: un benchmark construido desde una fuente angosta mide qué tan bien le va sobre esa fuente, no sobre lo que de verdad va a ver.

Esa brecha tiene un costo aguas abajo medido. [Zhang et al. (OHRBench, ICCV 2025)](https://arxiv.org/abs/2412.02592) evaluaron soluciones de OCR actuales específicamente por cómo sus errores se propagan hacia sistemas de generación aumentada por recuperación, y encontraron que ninguno de los enfoques de OCR que probaron era suficiente por sí solo para construir una base de conocimiento de buena calidad para un sistema RAG — el ruido de OCR degrada de forma medible la precisión de todo lo que se construye encima, no solo la transcripción misma. [Un survey de 2025 sobre pregunta-respuesta en documentos visualmente ricos](https://arxiv.org/abs/2501.02235) cubre el estado del arte de todo este espacio, y vale la pena leerlo solo por la sección honesta de limitaciones, no solo la de capacidades.

## Por qué no cambiamos de motor cuando una herramienta nueva se veía bien en el papel

Una vez que sabe que existen herramientas más nuevas de comprensión de documentos, el movimiento obvio es medirlas y cambiar si una gana. Medimos. No cambiamos, y la razón es la parte que no aparece en la mayoría de los posts de comparación.

Corrimos tres herramientas de comprensión de documentos de código abierto, más nuevas, por el mismo arnés de evaluación que nuestro motor de producción. Una perdió en todos los frentes con su configuración por defecto — se rompía con el español acentuado y devolvía salida vacía en algunas páginas, lo cual para un producto legal español-primero la descalifica sin importar cómo se vea su número en benchmarks en inglés. Las otras dos produjeron transcripciones que se veían genuinamente excelentes en una revisión cualitativa rápida — pero venían con conflictos de dependencias que no pudimos resolver dentro de nuestro entorno existente, y licencias que incluían código copyleft y una cláusula de techo de ingresos sobre los pesos del modelo. Una herramienta que lee hermoso y que usted no tiene licencia para correr en producción a escala no es un candidato; es una nota de investigación para el día en que la licencia o el conflicto de dependencias cambien. Guardamos ambas, versionadas y re-corribles, para exactamente ese día.

**La lección: "qué herramienta tiene la mejor precisión" y "qué herramienta puede realmente enviarse a producción" son preguntas distintas, y una comparación justa tiene que responder las dos antes de significar algo.**

## Qué le diríamos que haga de verdad

Si está construyendo o comprando algo que lee documentos a volumen, esto es lo que se ganó su lugar en nuestro proceso por las malas:

**Construya su conjunto de evaluación desde su propio material más difícil, no desde un benchmark público.** Un benchmark le dice qué tan bien le va a un modelo sobre los documentos con los que se construyó. DocLayNet existe porque la generación anterior de datasets no hizo esto, y se notó. Etiquete a mano una verdad de referencia desde los documentos reales más feos que tenga — torcidos, timbrados, con manuscrito en el margen, con capas de OCR ajenas ya incrustadas — porque ese es el material que de verdad va a llegar a producción, y es exactamente el material que los benchmarks limpios subrepresentan sistemáticamente.

**Mida más allá del nivel de carácter.** La tasa de error de caracteres es necesaria y no suficiente. El hallazgo de OHRBench — que el ruido de OCR degrada las *respuestas* de un sistema aguas abajo, no solo su transcripción — significa que el número que de verdad le importa es a nivel de tarea: si la extracción de campos, la búsqueda de citas, el parseo de fechas sobreviven al paso de OCR, no solo si el texto se ve más o menos bien.

**Interrogue cada puntaje de confianza antes de enrutar sobre él**, incluidos los que usted no calculó, incluidos los que vienen incrustados en un archivo en el que ya confía como ya-leído. Pregunte qué se descartó antes de que el número le llegara.

**Un modelo más grande no es automáticamente el arreglo**, y saber dónde de verdad ayuda contra dónde pierde en silencio contra algo más barato es una medición que hay que correr, no una suposición que se pueda dar por hecha. El nuestro ayuda específicamente en manuscrito y pierde específicamente en impreso — un hecho que solo sabemos porque lo medimos sobre nuestro propio material a escala completa, no porque un paper nos lo dijera en general.

Sacamos cuatro bugs reales de una tarde tirándole documentos sucios a un sistema que ya habíamos medido limpio. **El benchmark nos dijo que éramos precisos. Los documentos sucios nos dijeron dónde estábamos equivocados.** Los dos números eran verdad; solo uno era útil.
