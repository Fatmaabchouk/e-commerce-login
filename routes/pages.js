const express = require('express');
const router = express.Router();


router.get('/',(req , res)=>{
res.render('index');


});
router.get('/index',(req , res)=>{
    res.render('index');
    
    
    });
  
        router.get('/acc',(req , res)=>{
            res.render('acc');
            
            
            });
router.get('/login',(req , res)=>{
    res.render('login');
    
    
    });
    router.get('/profile',(req , res)=>{
        res.render('profile');
        
        
        });
    router.get('/register',(req , res)=>{
        res.render('register');
        
        
        });
    module.exports = router;