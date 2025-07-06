const express = require('express');
// const routes = require('./config/routes');
const apiRoutes = require('./config/apiRoutes');

require('./config/mongoose');

const app = express();

require('dotenv').config();
const port = process.env.PORT;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// app.use(routes);
// app.use('/api', apiRoutes);
app.use(apiRoutes);

app.listen(port, () => console.log('Server is on 3000'));
