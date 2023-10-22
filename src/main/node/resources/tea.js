const express = require('express'); //import express

const TeaService = require("../service/TeaService");

const teaService2 = require("../service/TeaService2");

// 1.
const router  = express.Router(); 

router.get('/tea', (req, res, next) => {

   const type =  req.query.type;
   let t = teaService2.getTeaType(type);
    res.json({message:t}); // dummy function for now
}); 
// 4. 
module.exports = router; // export to use in server.js