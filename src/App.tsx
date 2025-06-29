/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodo,
  getTodos,
  patchTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FormTodo } from './components/FormTodo';
import { FooterTodos } from './components/FooterTodos';
import { ErrorTodos } from './components/ErrorTodos';

type Filter = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterSelect, setFilterSelected] = useState<Filter>('All');

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
        setFilteredTodos(data);
      })
      .catch(() => {
        setError('Unable to load todos');
        throw new Error('Cant find todos');
      });
  }, []);

  function postTodos(title: string) {
    if (title.trim().length === 0) {
      setError('Title should not be empty');

      return;
    }

    addTodos({ title, completed: false, userId: 3177 })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setFilteredTodos(prev => [...prev, newTodo]);
      })
      .catch(() => {
        setError('Unable to add a todo');
        throw new Error('Cant create new todos');
      });
  }

  function removeTodos(todoId: number) {
    return deleteTodo(todoId)
      .then(() => {
        return getTodos();
      })
      .then(data => {
        setTodos(data);
        setFilteredTodos(data);
      })
      .catch(() => {
        setError('Unable to delete a todo');
        throw new Error('Cant delete todos');
      });
  }

  function changeTodo(todoId: number, title: string, complet: boolean) {
    return patchTodos({ id: todoId, title, completed: complet, userId: 3177 })
      .then(() => {
        return getTodos();
      })
      .then(data => {
        setTodos(data);
        setFilteredTodos(data);
      })
      .catch(() => {
        setError('Unable to update a todo');
        throw new Error('Cant change todos');
      });
  }

  function changeComplite() {
    const isAllCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !isAllCompleted,
    }));

    setTodos(updatedTodos);
    setFilteredTodos(updatedTodos);

    const updatePromises = updatedTodos.map(todo => patchTodos(todo));

    Promise.all(updatePromises)
      .then(() => getTodos())
      .then(setTodos)
      .catch(() => {
        throw new Error('Cant change all todos');
      });
  }

  function filter(typeOfSort: 'All' | 'Active' | 'Completed') {
    if (typeOfSort === 'All') {
      setFilteredTodos(todos);
      setFilterSelected('All');
    } else if (typeOfSort === 'Active') {
      const updatedTodos = todos.filter(todo => {
        return todo.completed === false;
      });

      setFilterSelected('Active');
      setFilteredTodos(updatedTodos);
    } else if (typeOfSort === 'Completed') {
      const updatedTodos = todos.filter(todo => {
        return todo.completed === true;
      });

      setFilterSelected('Completed');
      setFilteredTodos(updatedTodos);
    }
  }

  function clearCompleted() {
    todos.map(todo => {
      if (todo.completed === true) {
        removeTodos(todo.id);
      }
    });
  }

  function clearError() {
    setError('');
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <FormTodo
          postTodos={postTodos}
          changeComplite={changeComplite}
          todos={todos}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            deleteTodo={removeTodos}
            changeTodo={changeTodo}
          />
        )}

        {todos.length > 0 && (
          <FooterTodos
            todos={todos}
            filter={filter}
            clearCompleted={clearCompleted}
            selected={filterSelect}
          />
        )}
      </div>

      <ErrorTodos error={error} clearError={clearError} />
    </div>
  );
};
