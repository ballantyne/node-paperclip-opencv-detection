node-paperclip-opencv-detection
=========

This is a plugin that works with node-paperclip.  It reads images and recognizes objects or faces.  This is mostly a demonstration showing how to integrate with node-paperclip.  I would be very interested to hear other people's ideas about how to configure this so that it can be more useful for more general purposes like training to detect arbitrary things from data sets that are provided by the user.  As I learn more about opencv, I'll try to improve this.   

To install 

```bash
npm install node-paperclip-opencv-detection --save
```

Here is an example of a model that uses the mongoose plugin.

```javascript
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const Paperclip    = require('node-paperclip');

const Image = new Schema({});

Image.plugin(Paperclip.plugins.mongoose, {
  image: {
    image: { 
      before_save: [{task: require('node-paperclip-opencv-detection')}]
      class_name: 'image',
      has_attached_file: 'image', 
      styles: [
        { original: true },
      ],
      storage: 'file'
    }
  }
})

module.exports     = mongoose.model('Image', Image);
```

Here is an example of an express route that uses that Image model.


```javascript
const express      = require('express');
const router       = express.Router();

const Image        = require('image');
const middleware   = require('node-paperclip').middleware

router.post('/post_image',

    middleware.parse(), 

  function (req, res) {  
    Image.create(req.body.image, function(err, doc) {
      res.redirect('/');
    });
})

```

```html
    <form  class="form-horizontal" enctype="multipart/form-data" action="/post_image" method="post">

    <div>
      <label>File</label>
      <input type="file" name="image[image]" id="file">
    </div>

    <div  class="form-group">
      <div class="col-sm-offset-2 col-sm-10">
        <input class='btn btn-default' type="submit" value="Save"/>
      </div>
    </div>
    </form>

```

This module uses s3 by default, but can use a file system if you want.  The example above is configured to use the file system.  If you plan to use s3 you will need the following environment variables set the AWS_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.

Contributing
------------

If you'd like to contribute a feature or bugfix: Thanks! To make sure your
fix/feature has a high chance of being included, please read the following
guidelines:

1. Post a [pull request](https://github.com/ballantyne/node-paperclip-opencv/compare/).
2. Make sure there are tests! We will not accept any patch that is not tested.
   It's a rare time when explicit tests aren't needed. If you have questions
   about writing tests for paperclip, please open a
   [GitHub issue](https://github.com/ballantyne/node-paperclip-opencv/issues/new).


And once there are some contributors, then I would like to thank all of [the contributors](https://github.com/ballantyne/node-paperclip-opencv/graphs/contributors)!

License
-------

It is free software, and may be redistributed under the terms specified in the MIT-LICENSE file.

Copyright 
-------
© 2017 Scott Ballantyne. See LICENSE for details.



