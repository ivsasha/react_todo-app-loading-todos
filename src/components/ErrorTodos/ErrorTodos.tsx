import classNames from 'classnames';
import { useEffect } from 'react';

type ErrorTodosProps = {
  error: string;
  clearError: () => void;
};

export const ErrorTodos: React.FC<ErrorTodosProps> = ({
  error,
  clearError,
}) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      clearError();
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, clearError]);

  return (
    <>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            clearError();
          }}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </>
  );
};
