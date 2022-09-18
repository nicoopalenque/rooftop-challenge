
/**
 * primero calcula la cantidad de letras disponibles en la frase y obtiene la mitad, esta mitad se utiliza para obtener
 * con un Math.random un numero, este numero se utilizara como indice y se almacenara la letra perteneciente a dicho indice en un nuevo array.
 * Este nuevo array conformara la frase desordenada y con algunos caracteres eliminados
 */
function deleteCharacters(phrase) {
  let halfCharacters = Math.floor(phrase.length/2);
  let position;

  let phraseArray = phrase.split('');
  let newArray = []
  
  for(let i = 0; i<halfCharacters; i ++) {
    position = Math.floor(Math.random() * halfCharacters );
    let aux = phraseArray.filter((data, index) => index === position)
    newArray.push(aux[0])
  }
  
  let response = [...new Set(newArray)]
  
  return response.join('').trim();
}

/**
 * obtiene la diferencia que hay entre el array desordenado y el array desordenado con caracteres eliminados
 */
function getDifference(arr1, arr2) {
  return arr1.filter(element => arr2.indexOf(element) == -1)
}

/**
 * obtiene la posicion de cada caracter teniendo como referencia la frase original
 */
function getPosition(iterable, phrase) {
  let indices = [];
  let response = {};

  iterable.forEach(element => {
    let index = phrase.indexOf(element);
    while (index != -1) {
      indices.push(index);
      index = phrase.indexOf(element, index + 1);
    }
    /**
     * se arma el objeto json con la key = letra y value = array de las posiciones, en caso de que haya un
     * espacio la key se llamara 'space'
     */
    response[`${element != ' ' ? element : 'space'}`] = indices 
    indices = []
  })
  return response
}

function buildOriginalPhrase(info) {
  const { positionMessy, positionMissing} = info
  const data = Object.assign(positionMessy, positionMissing)
  let phrase = []
  for(let key in data){
    data[key].forEach(position => {
      phrase[position] = key === 'space' ? ' ' : key //se valida si debe ir un espacio o una letra
    })
  }
  
  return phrase.join('')
}

//First function
function modifyPhrase(phrase) {
  phraseInArray = phrase.split(' ');

  let disorderPhrase= '';

  phraseInArray.forEach( data => {
    disorderPhrase += data.split('').sort().join('') + ' ';
  })
  
  let phraseModified = deleteCharacters(disorderPhrase);

  const response = {
    complete: phrase,
    modified: phraseModified
  }
  console.log('Frase completa:', response.complete)
  console.log('Frase modificada:', response.modified)
  return Promise.resolve(response)
} 

//Second function
async function analizePhrase(phrase) {
  try {

    const { complete, modified } = await modifyPhrase(phrase);

    let iterable = modified.split('');
    let phraseComplete = complete.split('');

    const difference = getDifference(phraseComplete, iterable)
    
    
    const positionForMissing = getPosition(difference, phraseComplete)
    const positionForMessy = getPosition(iterable, phraseComplete);

    return {
      complete,
      modified,
      positionMissing: positionForMissing,
      positionMessy: positionForMessy 
    }
  } catch(error) {
    console.log(error)
  }
}

//third function
async function buildResult(phrase) {
  try {
    const data = await phrase
    console.log('Datos provenientes del analisis: ', data)
    const response = buildOriginalPhrase(data)
    console.log('Frase reconstruida: ', response)
    return response
  } catch( error ) {
    console.log(error)
  }
}

//generator function
function* generator() {
  let data = analizePhrase('Hola mundo!')
  yield data
  yield buildResult(data)
}


//main function
async function main() {
  const gen = generator();
	gen.next().value
	gen.next().value
}

main();