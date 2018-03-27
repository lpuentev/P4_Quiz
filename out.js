

const figlet = require('figlet');
const chalk = require('chalk');

/**
* Dar color a un string.
*
* @param msg  Es string al que hay que dar color.
* @param color  El color con el que pintar msg.
* @returns {string} Devuelve el string msg con el color indicado.
*/
const colorize = (msg, color) => {

  if(typeof color !== "undefined") {
    msg = chalk[color].bold(msg);
  }
  return msg;
};

/**
* Escribe un mensaje de log.
*
* @param msg  El string a escribir.
* @param color  Color del texto.
*/
const log = (socket, msg, color) => {
  socket.write(colorize(msg, color) + "\n");
};

/**
* Escribe un mensaje de log grande.
*
* @param msg  Texto a escribir.
* @param color  Color del texto.
*/
const biglog = (socket, msg, color) => {
  log(socket, figlet.textSync(msg, {horizontalLayout: 'full' }), color);
};

/**
* Escribe un mensaje de error emsg.
*
* @param emsg Texto del mensaje de error.
*/
const errorlog = (socket, emsg) => {
  socket.write(`${colorize("Error","red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")}\n`);
};

exports = module.exports = {
  colorize,
  log,
  biglog,
  errorlog
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