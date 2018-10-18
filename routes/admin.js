const express = require('express');
const path = require('path');
const router = express.Router(); 
const _ = require('lodash');

function adminRouter(dependencies) {
  const { db, io } = dependencies;

  router.get('/', (req, res) => {
    const matches = db.get('matches').value();
    res.render('admin/index', { matches });
  });

  router.get('/match/:id', (req, res) => {
    const matches = db.get('matches').value();
    const match = db.get(`matches[${req.params.id}]`).value();
    match.bids = _.orderBy(match.bids, ['half', 'time'], ['desc', 'desc']);
    res.render('admin/match', { matches, match, id: req.params.id });
  });

  router.post('/match/:id/score', (req, res) => {
    db.set(`matches[${req.params.id}].team-a.score`, 
      parseInt(req.body.scoreA)).write();
    db.set(`matches[${req.params.id}].team-b.score`,
      parseInt(req.body.scoreB)).write();
    
    io.emit('score', {
      match: req.params.id,
      scoreA: req.body.scoreA,
      scoreB: req.body.scoreB,
      notify: req.body.notify || 0
    });
    res.send(req.body);
  });

  router.post('/match/:id/videos', (req, res) => {
    db.get(`matches[${req.params.id}].videos`)
      .push(req.body.video).write();  
    io.to(`match-${req.params.id}`).emit('video', req.body.video);  
    res.send(req.body);
  });

  router.post('/match/:id/bids', (req, res) => {
    const bid = {  
      time: parseInt(req.body.time),
      half: parseInt(req.body.half),
      team: req.body.team,
      subject: req.body.subject,
      description: req.body.description
    }
    db.get(`matches[${req.params.id}].bids`)
      .push(bid).write();
    io.to(`match-${req.params.id}`).emit('bid', bid);
    res.send(bid); 
  })

  return router;
}

module.exports = adminRouter;
