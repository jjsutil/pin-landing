---
title: "Ninguna respuesta es mejor que la lectura de la que salió."
slug: "como-se-lee-un-expediente-escaneado"
excerpt: "Antes de que un sistema pueda responder sobre su expediente, alguien tiene que convertir el papel en texto. Ese paso se llama OCR, no aparece en ninguna demostración, y decide la calidad de todo lo que viene después."
publishDate: 2026-08-06
author: "Equipo fundador de pin"
tags: ["OCR", "Fundamentos", "Herramientas de IA"]
draft: false
readingMinutes: 9
---

Abra cualquier tomo de una carpeta investigativa real y mire lo que hay: un parte policial escaneado torcido, un timbre estampado encima de la fecha, una fotocopia de una fotocopia donde la tinta ya es gris, un oficio con anotaciones a mano en el margen, y de vez en cuando una foja entera dada vuelta. Ahora intente Ctrl-F.

No encuentra nada porque no hay nada que encontrar. **Su expediente no es texto. Es papel fotografiado.** Para un computador, cada una de esas fojas es una imagen —una grilla de píxeles—, tan buscable como la foto de un asado. Antes de que cualquier sistema pueda responderle una sola pregunta sobre ese material, alguien tiene que convertir la imagen en texto. Ese paso tiene nombre, tiene cincuenta años de historia y no aparece en ninguna demostración comercial: se llama OCR, reconocimiento óptico de caracteres.

Este artículo existe porque ese paso invisible decide la calidad de todo lo que viene después, y porque casi nadie le pregunta a su proveedor cómo lo hace. Al final va a tener la pregunta exacta que hay que hacer. Antes, conviene entender qué se está preguntando.

## Cómo se mide una lectura

El OCR se mide, y la métrica principal es de una honestidad brutal: la tasa de error por carácter —CER, por su sigla en inglés—. Cuántos caracteres, de cada cien, el sistema leyó mal.

Los números para calibrar la intuición. Sobre texto impreso razonablemente limpio, un buen motor moderno se equivoca poco: el error queda en un dígito bajo. Sobre manuscrito —la anotación al margen, la declaración tomada a mano, la firma con fecha—, un motor clásico de OCR se derrumba: en nuestras mediciones sobre corpus judicial real, se acerca a equivocar **uno de cada dos caracteres**. No es que lea mal. Es que, para efectos prácticos, no lee.

Y aquí la observación que vuelve todo esto asunto suyo y no de ingenieros: no todos los caracteres valen lo mismo. Un error de carácter en la prosa de un considerando es una molestia que el contexto repara. El mismo error en un RUT es otra persona. En una fecha, es otro plazo. En un monto, es otro delito. En un número de foja, es una cita que apunta a ninguna parte. **Los datos que a usted le importan de un expediente —nombres, fechas, cédulas, montos, fojas— son exactamente los que un error de un solo carácter destruye por completo**, porque son los datos donde el contexto no ayuda a reconstruir nada.

## El error no se queda en la página

Si el daño terminara en la página mal leída, sería un problema acotado. No termina ahí, y esto ya está medido con rigor académico.

Un equipo presentó en 2025 un banco de pruebas —[OHRBench](https://arxiv.org/abs/2412.02592)— construido para responder una sola pregunta: ¿qué le pasa a un sistema de respuestas sobre documentos cuando el OCR que le preparó el material se equivocó? La conclusión fue categórica: evaluadas las soluciones de OCR disponibles, **ninguna resultó suficiente para construir una base de conocimiento de calidad**, y hasta las mejores arrastraron una pérdida de exactitud del orden del 14% en las respuestas finales. El error de lectura se propaga en cascada: contamina el índice, desvía la búsqueda, y llega a la respuesta convertido en otra cosa.

Y esa «otra cosa» es la parte peligrosa. Porque el sistema no responde peor sobre texto mal leído. **Responde igual de fluido, igual de seguro y con la misma redacción impecable** —el [primer artículo de esta serie](../que-es-machine-learning/) explicó por qué la fluidez está garantizada y la exactitud no—. Un OCR que leyó «22.06.2004» donde el papel dice «22.08.2004» no produce un mensaje de error. Produce una cronología equivocada, contada con total naturalidad, que usted solo detecta si abre la página. La basura que entra no sale como basura. Sale como prosa.

## El estándar de la industria, y sus tres defectos

Lo que la industria hace por defecto es comprensible, porque es lo más simple: se elige un motor de OCR —uno—, se le pasa todo el documento, y el texto que salga es el que hay. Cuando el volumen aprieta, se contrata el OCR como servicio en la nube: las páginas se envían a la API de un tercero, que devuelve el texto. Funciona razonablemente para lo que esas herramientas fueron construidas: documentos limpios, nacidos digitales, en inglés.

Contra un expediente penal chileno, ese estándar falla tres veces, y las tres fallas son de naturaleza distinta.

**Falla de motor: ninguno gana en todas las páginas.** Esto lo medimos antes de decidir nada, y el resultado fue inapelable: el motor rápido y preciso en impreso se derrumba en el manuscrito; el modelo de visión que rescata el manuscrito es demasiado lento y caro para pasarle las diez mil páginas completas. Un expediente real trae ambas cosas mezcladas foja por foja. Elegir un solo motor es elegir en qué parte del expediente leer mal.

**Falla de arquitectura: el OCR en la nube resuelve la lectura creando el problema del [artículo anterior](../que-pasa-con-su-expediente-cuando-lo-sube/).** Enviar las fojas, una por una, a la API de un tercero es exactamente la operación que su deber de reserva le exige mirar con lupa. Que el sobre sea página a página no cambia que el contenido completo del expediente terminó, página a página, en servidores ajenos.

**Falla de honestidad: el silencio.** Es la peor de las tres. Cuando una página no se puede leer —demasiado oscura, demasiado torcida, manuscrito ilegible—, el estándar de la industria es saltarla y seguir. El sistema no miente activamente; hace algo más corrosivo: deja que usted asuma que «procesado» significa «leído». Y sobre esa asunción usted construye la confianza de que si algo importara, habría aparecido.

## Lo que construimos, y por qué lo decidimos así

Nuestra respuesta a las tres fallas cabe en tres decisiones, y las tres se tomaron midiendo, no opinando.

**Primera: se lee por página, no por expediente.** Cada foja pasa primero por un triaje que decide su ruta. Si la página trae texto digital embebido, se toma directo: lectura perfecta y gratis. Si es impreso escaneado legible, va al motor clásico: rápido, barato, error bajo. Si es manuscrito o un escaneo pobre, escala a un modelo de visión —la tecnología cara— que en nuestras mediciones lee ese material con **la mitad del error** de un OCR corriente. Mejor, no perfecto; sobre eso volvemos enseguida. El umbral que decide cuándo una página escala no se fijó a ojo: se calibró con datos, sobre corpus judicial real, y el resultado operativo es que **cerca de ocho de cada diez páginas se leen por la ruta rápida**, mientras la fracción difícil va a una cola diferida donde la máquina cara trabaja sin bloquear al resto. Es la misma lógica con la que un estudio asigna trabajo: lo estándar al procedimiento estándar, lo difícil al especialista, y nadie espera al especialista para avanzar con lo demás.

**Segunda: la procedencia se escribe desde el primer carácter.** En el momento en que un fragmento de texto nace del OCR, queda registrado de qué documento salió, de qué foja, y de qué lugar exacto dentro de la foja. El [cuarto artículo de esta serie](../como-se-verifica-una-respuesta-de-ia/) explicó por qué esto no se puede agregar después: la procedencia se guarda al leer o no existe. Por eso se guarda al leer.

**Tercera: la transcripción nunca reemplaza al papel.** Todo lo anterior asume algo incómodo y cierto: el OCR se va a equivocar. Con tasas de error mayores que cero y cientos de miles de caracteres, algún RUT va a salir cambiado. La pregunta de diseño no es cómo impedirlo —nadie puede— sino cómo lograr que ese error no pueda convertirse en una afirmación que usted firme sin verla. Nuestra respuesta: cada cita abre la **imagen real de la página**, con el pasaje señalado sobre la tinta. La verificación es contra el papel, no contra nuestra lectura del papel. Si el OCR leyó mal, usted lo ve en el mismo clic con que verifica todo lo demás —y el error muere ahí, como error de lectura, en vez de viajar hasta su escrito convertido en hecho—.

## El principio detrás de las tres: completitud comunicada

Si tuviéramos que reducir nuestra política de OCR a una sola regla, es esta: **ninguna página se da por leída sin serlo.** El cien por ciento de las fojas termina el proceso clasificado en una de dos listas: leída —con su texto y su procedencia—, o declarada pendiente o ilegible, con su ubicación exacta, en un reporte que usted puede abrir.

Puede parecer un detalle de interfaz. Es lo contrario de un detalle: es la diferencia entre dos promesas. El sistema que dice «leí todo» le está vendiendo una cobertura que no puede demostrar, y usted descubre los huecos cuando ya construyó encima. El sistema que dice «leí 9.986 fojas; estas 14 no, y son estas» le entrega algo que ningún resumen fluido reemplaza: **el mapa exacto de dónde tiene que mirar usted.** Catorce fojas se revisan a mano en una tarde. Lo que no se puede revisar es el hueco que nadie declaró.

## Lo que sigue, en nuestros planes

Tres frentes, en orden de importancia.

El primero cierra el círculo del artículo anterior: llevar también el razonamiento —no solo la lectura y los índices, que ya corren donde el estudio decide— a modelos que se ejecutan localmente, para que exista el modo de operación totalmente aislado de red: un sistema al que se le puede desconectar el cable y sigue trabajando. El segundo es institucional más que técnico: los motores de OCR y de visión mejoran cada pocos meses, así que mantenemos un banco de pruebas propio, sobre corpus judicial real, contra el que cada candidato nuevo se mide antes de tocar el sistema —los motores rotan; la vara queda—. Y el tercero es el residuo duro: para la fracción que ninguna máquina lee bien hoy, una cola de rescate explícita, con revisión humana cuando haga falta, porque la promesa nunca fue «lo leemos todo». La promesa es que usted sabe, en todo momento y foja por foja, **qué se leyó, con qué calidad, y qué no.**

## La pregunta para su proveedor

No es «¿usa inteligencia artificial?» —el [primer artículo](../que-es-machine-learning/) ya estableció que eso no informa nada—. Ni siquiera es «¿qué OCR usa?», que suena técnica y se contesta con una marca.

Es esta: **¿qué pasa con las páginas que no puede leer?**

Escuche la respuesta con atención, porque solo hay tres posibles. Si le dicen «las leemos todas», acaba de aprender que los huecos existen y nadie se los va a declarar. Si le responden con un porcentaje de precisión, pregunte sobre qué material se midió —impreso limpio en inglés no es su expediente—. Y si le contestan «quedan listadas, aquí está el reporte, y cada cita abre la imagen de la página para que usted compruebe la lectura», entonces está frente a alguien que entendió lo mismo que usted entendió leyendo esta serie: que en este oficio no se firma la prosa. Se firma lo que consta en la foja.
