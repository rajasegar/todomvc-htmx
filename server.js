const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.port || 3000;

const todos = [
  {
    name: 'Taste Javascript',
    done: true
  },
  {
    name: 'Buy a unicorn',
    done: false
  }
];

const app = express();
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.render('index', { todos });
});

app.post('/todos', (req, res) => {
  const { todo } = req.body;
  const newTodo = { name: todo, done: false };
  todos.push(newTodo);
  const template = pug.compileFile('views/includes/todo-item.pug');
  const markup = template({ todo: newTodo});
  res.send(markup);
});

app.listen(PORT);

console.log('Listening on port: ' + PORT);
