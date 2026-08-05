---
title: "No se olvidó de su expediente. Nunca lo leyó entero."
slug: "por-que-ninguna-herramienta-te-sirve"
excerpt: "Pagó la suscripción, subió el expediente y la herramienta le falló de tres maneras distintas. Ninguna de las tres fue una falla: las tres son el mismo límite."
publishDate: 2026-08-05
author: "Equipo fundador de pin"
tags: ["Ventana de contexto", "Herramientas de IA", "Verificabilidad"]
draft: true
readingMinutes: 5
---

Usted pagó la suscripción más cara que había y, a la mitad del expediente, la
herramienta ya no se acordaba de nada. Quinientos dólares después, terminó leyendo el
expediente a mano.

Fueron tres formas de fallar y probablemente las vio todas. **Se olvidó**: respondió
sobre el tomo I como si el tomo VII no existiera. **Mintió**: afirmó con absoluta
seguridad algo que no aparece en ninguna página. **Se trabó**: subió los volúmenes tres
veces, tres veces se cayó la carga, o le contestó que el documento era demasiado
grande.

## Ninguna de esas herramientas está rota

Esto es lo incómodo: no le fallaron. Hicieron exactamente aquello para lo que fueron
construidas, y aquello nunca fue esto.

Lo que sigue no es una acusación contra ellas. Es el mecanismo por el que las tres
fallas que usted vio son, en realidad, una sola —y por qué esa sola no se arregla
pagando más.

## Un escritorio de tamaño fijo

Un modelo de lenguaje trabaja sobre un escritorio de tamaño fijo. (Si leyó
[el artículo anterior](../que-es-machine-learning/), ya tiene el vocabulario:
entrenamiento, modelo, inferencia.)

Todo lo que el sistema necesita para responderle —su pregunta, el documento que usted
cargó, lo que se dijeron antes en la conversación— tiene que estar apoyado sobre ese
escritorio al mismo tiempo. Lo que no está sobre el escritorio no existe para el
modelo. Eso es la **ventana de contexto**: la cantidad máxima de texto que el sistema
puede tener a la vista en un mismo momento.

El escritorio es grande. Un expediente penal es más grande.

Y cuando el material no cabe, el sistema no se detiene a avisarle. Hace una de tres
cosas. Cada una de ellas es uno de los síntomas que usted vio.

**Lo que usted vio como olvido fue truncamiento.** Truncar es cortar: el material que
no entra en el escritorio se deja fuera, normalmente lo más antiguo de la conversación
o el final del documento. El modelo no sabe que le faltó algo, porque para él eso
nunca estuvo ahí. No se olvidó del tomo VII. Nunca lo leyó.

**Lo que usted vio como mentira fue compresión.** Comprimir es resumir para que quepa:
el sistema reemplaza el texto largo por una versión corta y trabaja sobre el resumen.
En el resumen sobrevive el sentido general y se pierde justamente lo que a usted le
importa —la fecha, el nombre, el número de foja—. Cuando usted pregunta por ese
detalle, el modelo contesta igual, porque contestar es lo que hace: completa el hueco
con lo más plausible. **En la compresión nace la mayor parte de las alucinaciones**,
esas respuestas seguras y bien redactadas que no están en ninguna página. No hubo mala
fe. Hubo un resumen respondiendo una pregunta que solo el original podía responder.

**Lo que usted vio como que se trabó fue lo único honesto de las tres.** Ahí el
sistema encontró el límite y lo dijo: el archivo excede el máximo, la carga falla, el
documento es demasiado grande. Es lo más frustrante de usar y es la única de las tres
respuestas que no lo engañó. Entre una herramienta que se traba y una que contesta
igual, prefiera mil veces la que se traba.

## La versión más cara tampoco lo va a leer

La objeción evidente es que estos escritorios crecen. Es cierto: cada año los modelos
admiten más texto a la vista, y el plan superior admite más que el gratuito. También
es cierto que eso no resuelve el problema, sino que lo corre de lugar. El expediente
que hoy no cabe tampoco cabe cuando el escritorio se duplica, y usted habrá pagado la
diferencia para averiguarlo.

Pero suponga que cupiera entero. Seguiría sin servirle, y esta es la parte que ningún
plan superior arregla: una herramienta de conversación no sabe qué es una foja. No
sabe que la numeración de un expediente es un sistema de referencia con valor
procesal y no un número de página cualquiera. No maneja **procedencia** —de qué
documento y de qué página salió cada dato, y cómo demostrarlo—. Y no sabe cómo se
cita algo ante un tribunal, donde lo que no se puede señalar no vale nada.

Nada de eso es un descuido de sus fabricantes. Esas herramientas se construyeron para
conversar, porque ahí estaba el dinero: cientos de millones de personas escribiendo
preguntas cortas sobre cualquier tema. Leer un expediente penal completo es una
capacidad que se les fue agregando encima, no el problema que salieron a resolver. Le
prestaron una herramienta excelente, construida para otra tarea.

## Procesar una vez, apuntar siempre

Lo que resuelve esto no es un modelo más grande. Es invertir el orden de las
operaciones.

En vez de empujar el expediente por la ventana de contexto cada vez que usted
pregunta —que es lo que hace una herramienta de conversación, y por eso se rompe—, el
expediente se procesa una sola vez, entero y por adelantado: se lee, se indexa foja
por foja, y cada fragmento queda guardado junto con el documento y la página exacta de
la que salió. Después, cuando usted pregunta, no se vuelve a leer el expediente
completo: se recuperan las fojas que corresponden y se responde con ellas a la vista.
La cita no la escribe el modelo. La apunta: a un documento, a una página, a una imagen
que usted abre y confirma con sus propios ojos.

Ese principio es toda la diferencia, y se puede verificar con una sola pregunta antes
de pagar cualquier suscripción: ¿puedo abrir la página de la que salió esta respuesta?

Sobre el volumen conviene ser exacto, porque en este mercado casi nadie lo es: un
sistema construido así no tiene el techo de la conversación, porque nunca se le pide
al modelo que sostenga el expediente entero a la vista. Cuánto es «entero» en su causa
depende de su causa, y esa es una cifra que corresponde medir sobre el expediente
real, no prometerla en un artículo.

## Lo que usted ya sabe hacer

Usted ya tiene el criterio para esto. Lo aplica todos los días con los peritajes que
recibe y con cada escrito que firma.

Un abogado no acepta un dictamen que no puede verificar. Si aceptó una respuesta de
inteligencia artificial sin fuente, no fue por descuido: fue porque nadie le ofreció
la fuente.
