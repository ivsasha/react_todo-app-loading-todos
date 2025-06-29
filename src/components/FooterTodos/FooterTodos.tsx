import { useState } from 'react';
import { Todo } from '../../types/Todo';

type FooterTodosProps = {
  todos: Todo[];
  filter: (typeOfSort: boolean, all?: boolean) => void;
  clearCompleted: () => void;
};

export const FooterTodos: React.FC<FooterTodosProps> = ({
  todos,
  filter,
  clearCompleted,
}) => {
  const [selected, setSelected] = useState(1);

  return (
    // Hide the footer if there are no todos
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={selected === 1 ? 'filter__link selected' : 'filter__link'}
          data-cy="FilterLinkAll"
          onClick={() => {
            filter(false, true);
            setSelected(1);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={selected === 2 ? 'filter__link selected' : 'filter__link'}
          data-cy="FilterLinkActive"
          onClick={() => {
            filter(false);
            setSelected(2);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={selected === 3 ? 'filter__link selected' : 'filter__link'}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            filter(true);
            setSelected(3);
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => {
          clearCompleted();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
