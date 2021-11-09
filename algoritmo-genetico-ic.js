const geneLength = 10;
const genes = [0, 1];
let poblacion;
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
      population.push({ genotype });
      console.log("cromosoma " + i + ": ", genotype);
      console.log("fitness: ", fitness(genotype));
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
  if (f1 > f2) {
    return [1, 0];
  } else {
    return [0, 1];
  }
};

//CRUZA EN 2 PUNTOS
/**
 * Split each Genotype by a two random indices and concatenate.
 * @param {Genotype} winner
 * @param {Genotype} loser
 */
twoPointCrossover = (winner, loser) => {
  console.log("crom1 :", winner);
  console.log("crom2 :", loser);
  let son1, son2, sections;
  do {
    sections = [
      Math.floor(Math.random() * winner.length),
      Math.floor(Math.random() * winner.length),
    ].sort((a, b) => a - b);
    console.log("secciones: ", sections);
    son1 = [].concat(
      winner.slice().splice(0, sections[0]),
      loser.slice().splice(sections[0], sections[1] - sections[0]),
      winner.slice().splice(sections[1])
    );
    son2 = [].concat(
      loser.slice().splice(0, sections[0]),
      winner.slice().splice(sections[0], sections[1] - sections[0]),
      loser.slice().splice(sections[1])
    );
  } while (fitness(winner) > 700 || fitness(loser) > 700);
  return [son1, son2];
};

//MUTACIÓN - REVERTIR
/**
 * Mutate the supplied Genotype with the supplied genes
 * @param {Genotype} G
 */
mutate = (G) => {
  do {
    const pos = Math.floor(Math.random() * G.length);
    G[pos] = G[pos] ? 0 : 1;
  } while (fitness(winner) > 700);
  return G;
};

// INICIO del programa

generatePopulation(10);
let index = 0;
//let newGeneration;
let parents = [];

for (let i = 0; i < poblacion.length / 2; i++) {
  const resultadoTorneo = tournament(poblacion[index], poblacion[index + 1]);

  parents.push(resultadoTorneo[0] ? poblacion[index] : poblacion[index + 1]);

  console.log("Population: ", populationFinal);
  console.log("Cromosomas a competir: ", competitorsIndexes);
  console.log("Resultado torneo: ", resultadoTorneo);

}


/*
const cruza = twoPointCrossover(
  populationFinal[competitorsIndexes[0]].genotype,
  populationFinal[competitorsIndexes[1]].genotype
);
console.log('Resultado cruza: ', cruza);
console.log('Perdedor: ', loser);
console.log('Resultado mutación: ', mutate(loser));
*/
