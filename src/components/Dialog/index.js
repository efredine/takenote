import React, { useEffect, useState, useReducer, useCallback } from 'react';
import { useRepositoryMutation } from '../../repository';
import insertNote from '../../repository/insertNote';
import updateNote from '../../repository/updateNote';
import './Dialog.css';

function valid(field) {
  return !!field;
}

function dirty(before, after) {
  return before.localeCompare(after) !== 0;
}

export default function Dialog({ rowid, title = '', content = '', onClose }) {
  const { transactWith, result, loading } = useRepositoryMutation(
    rowid ? updateNote : insertNote,
  );
  const [showErrors, setShowErrors] = useState(false);
  const [reloading, setReloading] = useState(false);
  useEffect(() => {
    if (reloading && result) {
      console.log('closing the dialog');
      onClose(true);
    }
  }, [reloading, setReloading, result, onClose]);
  const [state, dispatch] = useReducer(
    function reducer(state, action) {
      const { value } = action;
      switch (action.type) {
        case 'updateTitle':
          return {
            ...state,
            title: {
              value,
              valid: valid(value),
              dirty: dirty(title, value),
            },
          };
        case 'updateContent':
          return {
            ...state,
            content: {
              value,
              valid: valid(value),
              dirty: dirty(content, value),
            },
          };
        default:
          throw new Error();
      }
    },
    {
      title: {
        value: title,
        valid: valid(title),
        dirty: false,
      },
      content: {
        value: content,
        valid: valid(content),
        dirty: false,
      },
    },
  );
  const handleTitleChange = useCallback(
    e => dispatch({ type: 'updateTitle', value: e.target.value }),
    [],
  );
  const handleContentChange = useCallback(
    e => dispatch({ type: 'updateContent', value: e.target.value }),
    [],
  );
  const isDirty = state.title.dirty || state.content.dirty;
  const isValid = state.title.valid && state.content.valid;
  console.log({ isDirty, isValid });
  function handleSave() {
    if (isDirty && isValid) {
      if (rowid) {
        transactWith({
          title: state.title.value,
          content: state.content.value,
          rowid,
        });
      } else {
        transactWith({
          title: state.title.value,
          content: state.content.value,
          sample: 0,
        });
      }
      setReloading(true);
      console.log('Saving transaction.');
      return;
    }
    if (!isValid) {
      setShowErrors(true);
    }
  }
  function isSaveDisabled() {
    if (!showErrors) {
      return !isDirty || loading;
    }
    return !isDirty || !isValid || loading;
  }
  function Error({ hasError, children }) {
    return showErrors && hasError ? <div>{children}</div> : null;
  }
  console.log('Dialog', { rowid, title, content, state });
  return (
    <div className="DialogContainer">
      <div className="DialogContent">
        <div className="DialogHeader">{rowid ? 'Edit' : 'Create'}</div>
        <div className="DialogBody">
          <form className="DialogForm">
            <label htmlFor="title">Title</label>
            <Error hasError={!state.title.valid}>Title can't be empty.</Error>
            <input
              type="text"
              id="title"
              value={state.title.value}
              onChange={handleTitleChange}
              required
            />
            <label htmlFor="content">Content</label>
            <Error hasError={!state.content.valid}>
              Content can't be empty.
            </Error>
            <textarea
              className="TextArea"
              id="content"
              value={state.content.value}
              onChange={handleContentChange}
              required
            />
          </form>
        </div>
        <div className="DialogFooter">
          <span>
            <button disabled={isSaveDisabled()} onClick={handleSave}>
              Save
            </button>
            <button onClick={() => onClose(false)}>Cancel</button>
          </span>
        </div>
      </div>
    </div>
  );
}
