const probability = 0.5;
const minFitness = 680;
const geneLength = 10;
const genes = [0, 1];
let poblacion = [];
const pesos = [100, 155, 50, 112, 70, 80, 60, 118, 110, 55];
const demes = false; //para que los cromosomas en el torneo sean consecutivos

/**
 * Generate a population of Genotypes of length 'size'
 * @param {number} size
 *
 */
generatePopulation = (size) => {
  const population = [];
  let i = 0;
  do {
    const genotype = [];
    for (let i = 0; i < geneLength; i++) {
      const randomGene = genes[Math.floor(Math.random() * genes.length)];
      genotype.push(randomGene);
    }
    if (fitness(genotype) <= 700) {
      population.push(genotype);
    }
    i++;
  } while (population.length < size);
  poblacion = [...population];
};

fitness = (cromosoma) => {
  return cromosoma.reduce((acc, bit, index) => (acc += bit * pesos[index]), 0);
};

//SELECCIÓN POR TORNEO
/**
 * Compare fitness of genotypes and return winner and loser indicies.
 * If fitnesses are equal, then still return one as
 * winner and one as loser to allow for mutation.
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

//CRUZA EN 2 PUNTOS
/**
 * Split each Genotype by a two random indices and concatenate.
 * @param {Genotype} winner
 * @param {Genotype} loser
 */
twoPointCrossover = (padre1, padre2) => {
  let son1, son2, sections;
  console.log('---CRUZA EN 2 PUNTOS---');
  console.log('Competidores: ' + padre1 + ', ' + padre2);
  let cut = 0;
  do {
    sections = [
      Math.floor(Math.random() * padre1.length),
      Math.floor(Math.random() * padre1.length),
    ].sort((a, b) => a - b);
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

  return cut >= 15 ? [padre1, padre2] : [son1, son2];
};

//MUTACIÓN - REVERTIR
/**
 * Mutate the supplied Genotype with the supplied genes
 * @param {Genotype} G
 */
mutate = (G) => {
  if (Math.random() < probability) {
    do {
      const pos = Math.floor(Math.random() * G.length);
      G[pos] = G[pos] ? 0 : 1;
    } while (fitness(G) > 700);
  }
  return G;
};

// AUXILIARES

/*
 * Select two random indices of the population
 */
selectRandomGenotypes = (tamanioPadres) => {
  let index1, index2;
  while (index1 === index2) {
    index1 = Math.floor(Math.random() * tamanioPadres);
    index2 = Math.floor(Math.random() * tamanioPadres);
  }
  return [index1, index2];
};

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
const maxNumeroDeGeneraciones = 10;
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
  nroGeneracion < maxNumeroDeGeneraciones ||
  !mejorFitness(poblacion).resultado
);

// Resultado Final
const { cromosoma, resultado } = mejorFitness(poblacion);
console.log('POBLACIÓN FINAL: ', poblacion)
console.log('GENERACIÓN NUMERO: ' + nroGeneracion);
console.log('CROMOSOMA GANADOR: ' + cromosoma + ',  FITNESS: ' + resultado);
