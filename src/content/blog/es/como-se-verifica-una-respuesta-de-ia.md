---
title: "La herramienta no se mide por lo que acierta. Se mide por lo que cuesta comprobarla."
slug: "como-se-verifica-una-respuesta-de-ia"
excerpt: "El deber de verificar ya está escrito y ya se sanciona. Lo que nadie le explica es cómo se cumple sin perder el tiempo que la herramienta prometió ahorrarle. Ese costo no lo fija su disciplina: lo fija la arquitectura."
publishDate: 2026-08-06
author: "Equipo fundador de pin"
tags: ["Verificabilidad", "Criterio profesional", "Herramientas de IA"]
draft: false
readingMinutes: 7
---

El [artículo anterior de esta serie](../es-legal-usar-ia-para-trabajar/) terminó donde terminan todas las reglas que se están escribiendo sobre esto: puede usar inteligencia artificial, no puede delegarle el juicio, y responde usted por lo que firma. La [guía del Colegio de Abogados](https://colegioabogados.cl/guia-sobre-uso-de-sistemas-de-ia-por-abogados-julio-2026-002/) lo llama deber de verificación, y la Corte Suprema ya suspendió a una abogada [por no cumplirlo](https://www.pjud.cl/prensa-y-comunicaciones/noticias-del-poder-judicial/145652).

Queda la pregunta que ningún regulador contesta, porque no es jurídica sino operativa: ¿cómo, exactamente, se verifica una respuesta de inteligencia artificial? ¿Y cuánto cuesta hacerlo?

La segunda pregunta importa más que la primera, y casi nadie la hace. Porque el deber de verificar es suyo, indelegable y ya está resuelto. **El costo de cumplirlo, en cambio, no lo fija su disciplina. Lo fija la herramienta que usted eligió.** Ese costo es la única cifra que decide si la tecnología le está ahorrando trabajo o solo se lo está cambiando de lugar.

## Tres cosas que parecen verificación y no lo son

Conviene despejarlas primero, porque las tres se venden como tal.

**Preguntarle al sistema si está seguro.** «¿Estás seguro de esa cita?» produce una respuesta segura, porque producir respuestas seguras es lo que el sistema hace. Si leyó el [primer artículo de esta serie](../que-es-machine-learning/) tiene el vocabulario: toda respuesta es una inferencia, una predicción de qué texto corresponde a continuación. Preguntarle al modelo por su propia exactitud le pide una predicción sobre otra predicción. No agrega un hecho a la conversación; agrega otro párrafo plausible.

**Ponerle un segundo modelo al primero.** Es la misma operación con más presupuesto. Dos sistemas del mismo tipo, entrenados sobre material parecido, coincidiendo en un texto plausible, producen exactamente eso: coincidencia, no comprobación. La guía del Colegio lo excluyó en una sola línea —no sirve la verificación que efectúa el mismo sistema u otro similar—, y esa línea, que parece técnica, es la más importante del documento.

**El puntaje de confianza.** Un número entre cero y uno junto a cada afirmación se ve como rigor. Pero mire quién lo emite: el mismo sistema que emitió la afirmación. Es el proveedor calificándose su propia prueba. Puede ser un dato útil para ordenar el trabajo; no es, en ningún sentido que le sirva ante un tribunal, una verificación.

Lo que las tres tienen en común: todo ocurre dentro del sistema. Y la verificación es, por definición, un acto externo. Exige un objeto que no sea texto generado. En un expediente ese objeto existe, tiene numeración con valor procesal y usted lo conoce desde su primer día de oficio: la página.

## El método cabe en cuatro pasos

No hay más misterio que este, y conviene escribirlo una vez para no volver a discutirlo.

**Uno: descomponer.** Una respuesta de inteligencia artificial no se verifica como bloque; se verifica afirmación por afirmación. «El testigo declaró el 12 de marzo» es una afirmación. «Esa declaración contradice lo dicho a fojas 2.044» son dos.

**Dos: exigirle la fuente a cada una.** Cada afirmación debe llegar apuntando al lugar del que salió: qué documento, qué página, idealmente qué lugar dentro de la página. Y aquí la regla dura, la que ordena todo lo demás: **una afirmación que llega sin fuente no se verifica. Se descarta**, o se degrada a hipótesis que usted investigará por su cuenta, por otro camino. Salir a buscarle respaldo a una frase que el sistema no respaldó es hacer el trabajo del sistema, con su tiempo.

**Tres: abrir.** No la transcripción: la página. La imagen real, con la tinta, el timbre y el margen. Se lee el pasaje, se confirma que dice lo que la respuesta afirma que dice, en el contexto en que lo dice.

**Cuatro: decidir.** Y este paso es suyo por completo, porque aquí la máquina ya no tiene nada que aportar. Que la cita exista y diga lo que se afirma es una cosa; qué significa para su teoría del caso, si la favorece o la debilita, si se invoca o se guarda, es otra. **La máquina puede garantizar la procedencia. No puede garantizar la pertinencia.** Son dos controles distintos, y solo el primero es automatizable. El segundo tiene otro nombre: es su oficio.

Léalo de nuevo y notará qué desapareció del método: releer el expediente. Verificar no es volver a leer las diez mil fojas. Es abrir las páginas exactas de las que la respuesta afirma haber salido. Esa diferencia —entre releer y abrir— es toda la economía del asunto.

## La aritmética que decide si la herramienta le sirvió

Ahora los números, porque están medidos y porque son los que un socio debería mirar antes de firmar cualquier suscripción.

Las herramientas legales de investigación con IA —las serias, las que se venden como confiables— alucinan entre el [17% y el 33% de las veces](https://onlinelibrary.wiley.com/doi/full/10.1111/jels.12413) según cuál. El artículo anterior ya extrajo la consecuencia: una tasa de error así no es un margen tolerable, es una obligación de revisar el 100% de lo que el sistema produce. No hay atajo muestral: usted no sabe en cuál 17% le tocó el error.

Si la revisión es del 100%, el ahorro real de la herramienta se reduce a una sola resta: lo que le costaría hacer el trabajo usted, menos lo que le cuesta verificar todo lo que la herramienta hizo. Y esa resta cambia de signo según un único factor: **cuánto cuesta verificar una afirmación**.

Con la fuente apuntada, verificar una afirmación son segundos: un clic, la página abierta, el pasaje a la vista, confirmado o descartado. Cien afirmaciones verificadas caben en una mañana, y el [ahorro de tiempo que sí está medido](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4626276) —entre 12% y 32% en trabajo jurídico real— queda en su bolsillo.

Sin la fuente apuntada, verificar una afirmación es buscarla. Y buscar una frase en un expediente de decenas de miles de fojas es, en la práctica, releer: las mismas [quinientas a mil cien horas](../que-es-machine-learning/) de las que la herramienta prometía salvarlo, ahora gastadas en auditar a la herramienta. **Una respuesta correcta sin fuente le cuesta más verificarla que una respuesta con fuente que resultó incorrecta.** El error apuntado se descarta en segundos; el acierto sin apuntar se paga en horas.

Ahí está la tesis completa de este artículo, y es una tesis de compra: la herramienta no se mide por su tasa de acierto, que usted no puede auditar, sino por su costo de comprobación, que usted puede medir en la primera demostración, con cronómetro.

## Por qué esto no se arregla con buena voluntad

Un lector razonable objetará: ¿y no puede la herramienta simplemente agregar las citas al final? La respuesta es no, y la razón es arquitectónica, no comercial.

El [segundo artículo de esta serie](../por-que-ninguna-herramienta-le-sirvio/) lo explicó desde el otro lado: una herramienta de conversación empuja el material por la ventana de contexto, lo trunca y lo comprime, y cuando usted pide la cita, el modelo hace lo único que sabe hacer: escribirla. Una cita escrita por un modelo es una predicción más —plausible, bien formateada y sin ninguna relación garantizada con el papel—. La procedencia no se puede reconstruir al final con buena redacción. **O se guardó en el momento de leer —este fragmento salió de este documento, de esta página, de este lugar de la página— o no existe.** Todo lo demás es una cita con formato de cita.

Por eso el costo de verificación no es una función del esfuerzo del proveedor sino de su diseño. Y por eso se detecta antes de pagar, con la pregunta de siempre y un agregado: ¿puedo abrir la página de la que salió esta respuesta? — y ¿cuántos segundos me toma?

## Lo que queda de su lado

Nada de esto reduce su responsabilidad; la ordena. El deber de verificación es suyo, personal e indelegable, y ningún proveedor —incluido el que construye lo que usted está leyendo— puede asumirlo por usted. Lo que sí se puede exigir, y conviene exigir por escrito, es que la herramienta deje el deber en el precio de un clic: cada afirmación con su página, cada página con su imagen, cada verificación en segundos.

Porque al final la cuenta es una sola. El estándar que ya rige —el del Colegio, el de la Corte, el de todas las reglas que el mundo lleva tres años escribiendo— no le pide que desconfíe de la tecnología. Le pide algo más simple y más viejo: que no firme lo que no comprobó. La única pregunta abierta es cuánto le va a costar comprobar. Y esa, por primera vez en esta serie, no es una pregunta para usted. Es una pregunta para su proveedor.
