const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const path = require('path');
const { v4 : uuid } = require('uuid');

const PORT = process.env.port || 3000;

const todos = [
  {
    id: uuid(),
    name: 'Taste Javascript',
    done: true
  },
  {
    id: uuid(),
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
  const { filter } = req.query;
  let filteredTodos = [];
  switch(filter) {
    case 'all':
      filteredTodos = todos;
      break;
    case 'active':
      filteredTodos = todos.filter(t => !t.done);
      break;
    case 'completed':
      filteredTodos = todos.filter(t => t.done);
      break;
    default:
      filteredTodos = todos;
  }

  const itemsLeft = todos.filter(t => !t.done).length;
  res.render('index', { todos: filteredTodos, filter, itemsLeft });
});

app.post('/todos', (req, res) => {
  const { todo } = req.body;
  const newTodo = { 
    id: uuid(),
    name: todo, 
    done: false 
  };
  todos.push(newTodo);
  const template = pug.compileFile('views/includes/todo-item.pug');
  const markup = template({ todo: newTodo});
  res.send(markup);
});

app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = todos.find(t => t.id === id);
  todo.done = !todo.done;
  const template = pug.compileFile('views/includes/todo-item.pug');
  const markup = template({ todo });
  res.send(markup);
});

app.delete('/todos/:id', (req,res) => {
  const { id } = req.params;
  const idx = todos.find(t => t === id);
  todos.splice(idx, 1);
  res.send('success');
});

app.listen(PORT);

console.log('Listening on port: ' + PORT);
