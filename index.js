
//use path module
const path = require('path');
//use express module
const express = require('express');
//use ejs view engine
const ejs = require('ejs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();
function requestHandler(req,res){
}
//konfigurasi koneksi
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crudjs'
});
 
//connect ke database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});


//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public sebagai static folder for static file
app.use('/assets',express.static(__dirname + '/public'));
 

//route for homepage
app.get('/',(req, res) => {
  let sql = "SELECT * FROM product";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      url: 'http//localhost:8000/',
      data: results
    });
  });
});


//route for Form add 

app.get('/add', (req, res)=> {
    res.render('add', {
    url: 'http//localhost:8000/',
    Name:'',
    Price:''
    });

});

//route for Form Update 

app.get('/edit/(:id)', (req, res)=> {
  res.render('edit', {
  url: 'http//localhost:8000/',
  Name:'',
  Price:''
  });

});


////////////////////////////////route Action Here //////////////////////////
 
//route for action insert data
app.post('/add/save',(req, res) => {
  let data = { product_name: req.body.Name, product_price: req.body.Price};
  let sql = "INSERT INTO product SET ?";
  let query = conn.query(sql, data,(err,rows, results) => {
    console.log(rows)
    if(err) throw err;
    res.redirect('/');
  });
});
 
//route for action update data
app.put('/edit/save/(:id)',(req, res) => {
      const data = {...req.body}
      const querySearch = 'SELECT * FROM product WHERE id = ?' ; 
      const queryupdate = 'UPDATE product SET ?  WHERE id = ?' ;

    conn.query(querySearch, req.params.id, (err, rows, field) => {

      if (err) {
        return res.status(500).json({ message: 'There is a mistake', error: err });
    }

      if (rows.length) {

           conn.query(queryupdate, [data, req.params.id], (err, rows, field) => {

            if (err) {
              return res.status(500).json({ message: 'There is a mistake', error: err });
            }

            // succeed 
            res.status(200).json({ success: true, message: 'update success' });

        });
      }else {
        return res.status(404).json({ message: 'Data not found!', success: false });
    }

    });

});
 
//route for action delete data
app.post('/delete/(:id)',(req, res) => {
  const querySearch = 'SELECT * FROM product WHERE id = ?';
  const querydelete = 'DELETE FROM product WHERE id = ?';


   conn.query(querySearch, req.params.id,(err, rows, field) => {
      if(err) {
            return res.status(500).json({ message: 'There is a mistake', error: err });
      }

      if (rows.length) {
      conn.query(querydelete, req.params.id, (err, rows, field) => {
          if(err){
              return res.status(500).json({message: 'There is a mistake', error: err });
          }

          res.redirect('/');

      });

      } else {
          return res.status(404).json({ message: 'Data not found!', success: false });
      }
  });
});
 

//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});


