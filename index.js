const cv                  = require('opencv');
const _                   = require('underscore');
// This is mostly just an example showing how opencv can be integrated.  I think that
// there must be some other really interesting applications of opencv and better ways 
// of configuring if you have any suggestions, please feel from to make a pull request.

module.exports            = function(paperclip) {
  var obj = {};
  obj.paperclip           = paperclip;
  obj.perform             = function(options, next) {

    if (options.dataset == undefined) {
      
      if (options.type != undefined) {
        
        if (options.attribute == undefined) options.attribute = options.type;
        
        switch(options.type) { 
          case 'faces':
            _.extend(options, { dataset: cv.FACE_CASCADE });
            break;
          case 'eyes':
            _.extend(options, { dataset: cv.EYE_CASCADE });
            break;
          case 'glasses':
            _.extend(options, { dataset: cv.GLASSES_CASCADE });
            break;
          case 'cars':
            _.extend(options, { dataset: cv.FULLBODY_CASCADE });
            break;
          case 'car_profiles':
            _.extend(options, { dataset: cv.CAR_SIDE_CASCADE });
            break;
        } 

      } else {
        options.dataset = cv.FACE_CASCADE;
        options.attribute = 'faces';
      }

    } else {
      
      if (options.attribute == undefined) {
        options.attribute = 'objects';
        console.log('Set the options.attribute option to save it as something other than objects.');
      }

    }

    cv.readImage(this.paperclip.file().file.buffer, function(err, im){
      im.detectObject(options.dataset, {}, function(err, objects){
        var object = {};

        object[options.attribute] = { count: objects.length, data: objects };
        
        if (objects.length > 0 || options.presence) {
          if (objects.length > 0 && options.tag) {
            object.object_tags = [options.attribute]
          }
          next(err, object);
        } else {
          next(err, {});
        }

      });
    })
  }

  return obj;

}
