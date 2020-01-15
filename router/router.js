const express = require('express');
const Db = require('../data/db')
const router = express.Router();




router.get('/', (req, res) => {
    Db.find()
    .then(posts => {
        console.log('posts', posts)
        res.status(200).json(posts)
    })
})

router.get('/:id', (req, res) => {
    Db.findById(req.params.id)
    .then(id => {
        if(id.length === 0){
            res.status(404).json({message: 'Post not found'})
        }else{
            res.status(200).json(id);
        }
    })
    .catch(err => {
        res.status(500).json({message: 'Error finding post'})
    })
})

router.post('/', (req, res) => {
    const post = req.body;
    if(!post.title || !post.contents) {
        res.status(400).json({message: 'Please provide title and content for the post'})
    } else {
        Db.insert(post)
        .then(addPost => {
            res.status(201).json(addPost)
        })
        .catch(error => {
            res.status(500).json({message:'There was an error while saving the post to the database'})
        })
    }

})

router.post('/:id/comments', (req, res) => {
    const post = req.body;
    if (!post.text) {
      res.status(400).json({ errorMessage: 'Please provide text for the comment.'})
    } else {
      Db.insertComment(post)
      .then(comment => {
        if (comment) {
          res.status(201).json(comment)
        } else {
          res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' })
        }
      })
      .catch(error => {
        res.status(500).json({
          errorMessage: 'There was an error while saving the comment to the database'
        })
      })
    }
})

router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    Db.findPostComments(id)
    .then(comment => {
      if (comment.length !== 0) {
        res.status(200).json(comment)
      } else {
        res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' })
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: 'The comments information could not be retrieved.'
      })
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Db.remove(id)
    .then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.'})
      }
    })
    .catch(error => {
      console.log('error on DELETE /api/posts/:id', error)
      res.status(500).json({
        errorMessage: 'The post could not be removed'
      })
    })
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    if (!data.title || !data.contents) {
      res.status(400).json({ errorMessage: 'Please provide title and contents for the post.'})
    } else {
      db.update(id, data)
      .then(post => {
        if (post) {
          res.status(200).json(data)
        } else {
          res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.'})
        }
      })
      .catch(error => {
        console.log('error on PUT /api/posts/:id', error)
        res.status(500).json({
          errorMessage: 'The post information could not be modified.'
        })
      }) 
    }
})


module.exports = router;