const probability = 0.5;
const minFitness = 690;
const geneLength = 10;
const genes = [0, 1];
let poblacion = [];
const pesos = [100, 155, 50, 112, 70, 80, 60, 118, 110, 55];

/**
 * Generar población inicial aleatoriamente, utilizando
 * "size" para determinar la cantidad de cromosomas que
 * compondrán el mismo
 * @param {number} size
 */
generatePopulation = (size) => {
  const population = [];
  let i = 0;
  do {
    const genotype = [];
    /**
     * Iteramos según el largo del cromosoma (geneLength) y le asignamos
     * uno de los valores que puede tomar esa posición, en este caso 0 o 1
     */
    for (let i = 0; i < geneLength; i++) {
      const randomGene = genes[Math.floor(Math.random() * genes.length)];
      genotype.push(randomGene);
    }
    /**
     * Evaluamos el fitness y de superar 700 no se agrega ese cromosoma
     * a la población
     */
    if (fitness(genotype) <= 700) {
      population.push(genotype);
    }
    i++;
  } while (population.length < size);
  /**
   * Una vez llegado al número de cromosomas deseado se setea la población
   */
  poblacion = [...population];
};

/**
 * Función de fitness: se suman los pesos multiplicados por el valor de los alelos
 */
fitness = (cromosoma) => {
  return cromosoma.reduce((acc, bit, index) => (acc += bit * pesos[index]), 0);
};

/**
 * SELECCIÓN POR TORNEO
 * Compara los fitness de los cromosomas y devuelve un arreglo con 2 valores:
 * [1, 0] si ganó el cromosoma 1 y [0, 1] si ganó el cromosoma 2.
 * Si los fitness son iguales, retorna igualmente un arreglo con quién ganó y
 * quién perdió.
 * @param {Genotype} G1
 * @param {Genotype} G2
 */
tournament = (G1, G2) => {
  const f1 = fitness(G1);
  const f2 = fitness(G2);
  console.log('---SELECCIÓN POR TORNEO---');
  console.log('Competidores: ' + G1 + '(' + f1 + '), ' + G2 + '(' + f2 + ')');
  if (f1 > f2) {
    console.log('Cromosoma ganador: G1');
    console.log('------');
    return [1, 0];
  } else {
    console.log('Cromosoma ganador G2');
    console.log('------');
    return [0, 1];
  }
};

/**
 * CRUZA EN 2 PUNTOS
 * Se divide a cada cromosoma en 2 puntos aleatorios y luego se los
 * concatena para generar los 2 hijos.
 * @param {Genotype} padre1
 * @param {Genotype} padre2
 */
twoPointCrossover = (padre1, padre2) => {
  let son1, son2, sections;
  console.log('---CRUZA EN 2 PUNTOS---');
  console.log('Competidores: ' + padre1 + ', ' + padre2);
  let cut = 0;
  /**
   * El siguiente DO - WHILE tiene como criterio de corte que ambos hijos
   * tengan un fitness válido. Como esto puede no cortar nunca, se agregó
   * además que se permitan hasta 15 iteraciones.
   */
  do {
    /**
     * en "sections" se almacenan las dos posiciones random
     * en donde se partirán a los cromosomas
     */
    sections = [
      Math.floor(Math.random() * padre1.length),
      Math.floor(Math.random() * padre1.length),
    ].sort((a, b) => a - b);
    /**
     * concatenación para generar ambos hijos
     */
    son1 = [].concat(
      padre1.slice().splice(0, sections[0]),
      padre2.slice().splice(sections[0], sections[1] - sections[0]),
      padre1.slice().splice(sections[1])
    );
    son2 = [].concat(
      padre2.slice().splice(0, sections[0]),
      padre1.slice().splice(sections[0], sections[1] - sections[0]),
      padre2.slice().splice(sections[1])
    );
    cut += 1;
  } while ((fitness(son1) > 700 || fitness(son2) > 700) && cut < 15);
  console.log('Hijos resultantes: ' + son1 + ', ' + son2);
  console.log('------');

  /**
   * Si los hijos generados que se obtuvieron son válidos se devuelve los mismos,
   * de lo contrario se devuelven los padres, ya que sabemos que ellos tienen
   * fitness válidos. Esto es debido a que se busca mantener una población que solo
   * incluya cromosomas válidos.
   */
  return cut >= 15 ? [padre1, padre2] : [son1, son2];
};

/**
 * MUTACIÓN POR MÉTODO DE REVERTIR
 * Se muta al cromosoma en cuestión con el alelo contrario al que tiene actualmente
 * en una posición random del mismo. Que el cromosoma se mute recae en la probabilidad
 * asignada por probability.
 * @param {Genotype} G
 */
mutate = (G) => {
  if (Math.random() < probability) {
    do {
      // se elige una posición random a mutar
      const pos = Math.floor(Math.random() * G.length);
      G[pos] = G[pos] ? 0 : 1;
    } while (fitness(G) > 700);
  }
  return G;
};

// FUNCIONES AUXILIARES

/**
 * Selecciona dos índices random de la población
 */
selectRandomGenotypes = (tamanioPadres) => {
  let index1, index2;
  while (index1 === index2) {
    index1 = Math.floor(Math.random() * tamanioPadres);
    index2 = Math.floor(Math.random() * tamanioPadres);
  }
  return [index1, index2];
};

/**
 * Función que evalua si dentro de la población actual existe un cromosoma
 * cuyo fitness se encuentre dentro del rango deseado. En base a esto se
 * devuelve un objecto con el cromosoma y su fitness.
 */
mejorFitness = (poblacion) => {
  let cromosoma;
  const resultado = poblacion.reduce((max, c) => {
    if (fitness(c) > max && fitness(c) > minFitness) {
      cromosoma = [...c];
      return fitness(c);
    }
    return max;
  }, 0);

  return { cromosoma, resultado };
};

// -- INICIO del programa
generatePopulation(10);
const maxNumeroDeGeneraciones = 20;
let nroGeneracion = 0;

do {
  let index = 0;
  let padres = [];
  let hijos = [];

  // Seleccionar padres a cruzar
  for (let i = 0; i < poblacion.length / 2; i++) {
    const resultadoTorneo = tournament(poblacion[index], poblacion[index + 1]);
    padres.push(resultadoTorneo[0] ? poblacion[index] : poblacion[index + 1]);
    index += 2;
  }
  do {
    const padresACruzar = selectRandomGenotypes(padres.length);
    const cruza = twoPointCrossover(
      padres[padresACruzar[0]],
      padres[padresACruzar[1]]
    );

    hijos.push(mutate(cruza[0]));
    hijos.push(mutate(cruza[1]));
  } while (hijos.length < poblacion.length);

  poblacion = [...hijos];
  nroGeneracion += 1;
  console.log('---GENERACIÓN NÚMERO: ' + nroGeneracion + '---');
} while (
  nroGeneracion < maxNumeroDeGeneraciones &&
  !mejorFitness(poblacion).resultado
);

// Resultado Final
const { cromosoma, resultado } = mejorFitness(poblacion);
console.log('POBLACIÓN FINAL: ', poblacion);
console.log('GENERACIÓN NUMERO: ' + nroGeneracion);
console.log('CROMOSOMA GANADOR: ' + cromosoma + '  FITNESS: ' + resultado);
