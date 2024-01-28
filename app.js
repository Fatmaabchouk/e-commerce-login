const express= require ("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require ('dotenv');




dotenv.config({path: './.env'});



  const app = express();
  const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: process.env.DATABASE,
 
});

const publicDirectory = path.join(__dirname, './public')
app.use(express.static( publicDirectory ));
//yraj3ouli ana chnou 3ameret fy lformulaire

app.use(express.urlencoded({extended :false}));
app.use(express.json());




app.set('view engine','hbs');

db.connect((error)=>{
    if(error){

console.log(error)        
    }else {

        console.log("MYSQL Connected...")
    }





})



  app.get("/",(req , res) =>   {

// res.send("<h1>home </h1>")
res.render("index")

  } );
 // DEfine Routes
app.use('/' , require('./routes/pages'));

app.use('/auth', require('./routes/auth'));
   app.listen(3000 , ()=> {
console.log ("Server started on port 3000");


   })





// ...

