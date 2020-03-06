const express = require('express');
const server =  express();
server.use(express.json()); // For the express receive json

server.use((req, res, next)=>{
    return next();
})
const animes = [
    {
        id: "1",
        title: "Naruto",
        characters: ["Sasuke, Naruto, Sakura"]
    },
    {
        id: "2",
        title: "Bleach",
        characters: ["Kurosaki Ichigo, Sado, Hitsugaya"]
    }
];

// midlewares
function checkAnimeExists(req, res, next)
{
    if (!req.body.title || !req.body.id) {
        return res.status(400).json({error: 'Anime title/id is required'});
    }
    return next();    
}

function checkAnimeInArray(req, res, next) {
    if (!animes[req.params.id]) {
        return res.status(400).json({error: 'Anime does not exists'});
    }
    return next(); 
}

// called before each request for count requisitions
function logRequests(req, res, next) {

    console.count("Number of Requests");
  
    return next();
  }
  
server.use(logRequests);

//list all animes
server.get('/animes', (req, res) =>{
    return res.json(animes);
})
//Create animes
server.post('/animes', checkAnimeExists, (req, res) =>{
    const data = {
        "id": req.body.id,
        "title": req.body.title,
    };
    animes.push(data);
    return res.json(animes);
})
//Create Characters in animes
server.post('/animes/:id/character', checkAnimeInArray, (req, res) =>{
    const { id } = req.params;
    animes[id]['characters'].push(req.body.characters);
    return res.json(animes);
})
//update anime title
server.put('/animes/:id', checkAnimeInArray, (req, res) =>{
    const { id } = req.params;
    animes[id]['title'] = req.body.title;
    return res.json(animes[id]);
})
//Delete anime
server.delete('/animes/:id', checkAnimeInArray, (req, res) =>{
    const { id } = req.params;
    animes.splice(id, 1);
    return res.json(animes);
})

server.listen(3000);
