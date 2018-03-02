

const {log, biglog, errorlog, colorize} = require("./out");

const model = require('./model');


/**
* Muestra la ayuda.
*
* @param rl Objeto readline usado para implementar el CLI.
*/
exports.helpCmd = rl => {
  log("Commandos:");
      log(" h|help - Muestra esta ayuda.");
      log(" list - Listar los quizzes existentes.");
      log(" show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
      log(" add - Añadir un nuevo quiz interactivamente.");
      log(" delete <id> - Borrar el quiz indicado.");
      log(" edit <id> - Editar el quiz indicado.");
      log(" test <id> - Probar el quiz indicado.");
      log(" p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
      log(" credits - Créditos.");
      log(" q|quit - Salir del programa.");
      rl.prompt();
};

/**
* Lista todos los quizzes existentes en el modelo.
*
* @param rl Objeto readline usado para implementar el CLI.
*/
exports.listCmd = rl => {

  model.getAll().forEach((quiz, id) => {
    log(` [${colorize(id, 'magenta')}]: ${quiz.question}`);
  });
  rl.prompt();
};

/**
* Muestra el quiz indicado en el parámetro: la pregunta y la respuesta.
*
* @param id Clave del quiz a mostrar.
*/
exports.showCmd = (rl, id) => {
  
  if(typeof id === "undefined"){
    errorlog(`Falta el parámetro id.`);
  } else {
      try {
          const quiz = model.getByIndex(id);
          log(` [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
      } catch(error) {
          errorlog(error.message);
      }
  }

  rl.prompt();
};

/**
* Añade un nuevo quiz al modelo.
* Pregunta interactivamente por la pregunta y por la respuesta.
*/
exports.addCmd = rl => {
  
  rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

      rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {
  
          model.add(question, answer);
          log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
          rl.prompt();
      });
  });
};

/**
* Borra un quiz del modelo.
*
* @param id Clave del quiz a borrar en el modelo.
*/
exports.deleteCmd = (rl, id) => {
  
   if(typeof id === "undefined"){
    errorlog(`Falta el parámetro id.`);
  } else {
      try {
          model.deleteByIndex(id);
      } catch(error) {
          errorlog(error.message);
      }
  }

  rl.prompt();
};

/**
* Edita un quiz del modelo.
* 
* @param id Clave del quiz a editar en el modelo.
*/
exports.editCmd = (rl, id) => {
   if(typeof id === "undefined"){
    
    errorlog(`Falta el parámetro id.`);
    rl.prompt();
    
    } else {
        try {
            const quiz = model.getByIndex(id);

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);

            rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

                          process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);

             
              rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer => {
                  model.update(id, question, answer);
                  log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                  rl.prompt();
              });
            });
        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
     }    
};

/**
* Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos contestar.
* 
* @param id Clave del quiz a probar.
*/
exports.testCmd = (rl, id) => {
  if(typeof id === "undefined"){
    
    errorlog(`Falta el parámetro id.`);
    rl.prompt();
    
    } else {
        try {
          const quiz = model.getByIndex(id);

          rl.question(colorize(quiz.question+'? ', 'red'), resp => {

            if(normalize(resp) === normalize(quiz.answer)){

              log(`Su respuesta es:`);
              biglog('Correcta', 'green');
              rl.prompt();

            } else{

              log(`Su respuesta es:`);
              biglog('Incorrecta', 'red');
              rl.prompt();

            }

          });

          } catch (error) {
            errorlog(error.message);
            rl.prompt();
          }
    }
};


/**
* Pregunta todos los quizzes existentes en el modelo en orden aleatorio.
* Se gana si se contesta a todos satisfactoriamente.
*/
exports.playCmd = rl => {

  let score = 0

  let toBeResolved = [];

  for(i=0; i<model.count(); i++){
    toBeResolved[i]=i;
  }
  const playOne = () => {

    if (toBeResolved === undefined || toBeResolved.length == 0) {
        log(`No hay nada más que preguntar.`);
        log(`Fin del juego. Aciertos: ` + score);
        biglog(score, 'magenta');
        rl.prompt();
    } else {

    let id = Math.floor(Math.random()*toBeResolved.length);
    const quiz = model.getByIndex(toBeResolved[id]);
    toBeResolved.splice(id,1);
    
      rl.question(colorize(quiz.question+'? ', 'red'), resp => {

        if(normalize(resp) === normalize(quiz.answer)){
            score ++;
            log(`CORRECTO - Lleva ` + score + ` aciertos.`);
            playOne();

        } else {
              log(`INCORRECTO.`);
              log(`Fin del juego. Aciertos: ` + score);
              biglog(score, 'magenta');
              rl.prompt();

        }

      });
    }
    }
    playOne();
    };

/**
* Muestra los nombres de los autores de la práctica.
*/
exports.creditsCmd = rl => {
  log('Autores de la práctica:');
    log('LUIS', 'green');
    rl.prompt();
};

/**
* Terminar el programa.
*/
exports.quitCmd = rl => {
  rl.close();
};


/**
* Normaliza un string para que salga en minúsculas sin espacios ni carácteres raros.
*
* Source: http://www.etnassoft.com/2011/03/03/eliminar-tildes-con-javascript/
*
*/
var normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};
 
  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );
 
  return function( str ) {

      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }      
      return ret.join( '' ).replace( /[^-A-Za-z0-9]+/g, '' ).toLowerCase();;
  }
 
})();