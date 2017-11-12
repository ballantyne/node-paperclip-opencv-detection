const cv                  = require('opencv');

// This is mostly just an example showing how opencv can be integrated.  I think that
// there must be some other really interesting applications of opencv and better ways 
// of configuring if you have any suggestions, please feel from to make a pull request.

module.exports            = function(paperclip) {
  var obj = {};
  obj.paperclip           = paperclip;
  obj.perform             = function(options, next) {
    if (options.object_type == undefined) {
      options.object_type = 'FACE_CASCADE';
    }
    if (options.dataset == undefined) {
      options.dataset = cv[options.object_type];
      options.custom  = false;
    } else {
      options.custom  = true;
    }

    cv.readImage(this.paperclip.file().file.buffer, function(err, im){
      im.detectObject(options.dataset, {}, function(err, faces){
        if (options.custom == true) {
          next(err, {objects: {count: faces.length, data: faces}})
        } else {
          if (faces && faces.length > 0) {
            switch(options.object_type) { 
              case 'FACE_CASCADE':
                next(err, {faces: {count: faces.length, data: faces}});
                break;
              case 'EYE_CASCADE':
                next(err, {eyes: {count: faces.length, data: faces}});
                break;
              case 'EYEGLASSES_CASCADE':
                next(err, {glasses: {count: faces.length, data: faces}});
                break;
              case 'FULLBODY_CASCADE':
                next(err, {cars: {count: faces.length, data: faces}});       
                break;
              case 'CAR_SIDE_CASCADE':
                next(err, {car_profiles: {count: faces.length, data: faces}});      
                break;
            }
          } else {
            next(err, {});
          }
        }
      });
    })
  }
  return obj;
}
