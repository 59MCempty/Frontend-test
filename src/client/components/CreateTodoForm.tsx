import { useRef, useState } from "react";

import { api } from "@/utils/client/api";
import { log } from "console";

/**
 * QUESTION 1:
 * -----------
 * Style the "Add" button so that it looks like the design in Figma.
 *
 * NOTE: You must use tailwindcss and className. Do not use other methods (eg.
 * inline styles, separate css files, css modules, etc.) unless absolutely
 * necessary. This applies to all styling-related questions in this assignment.
 *
 * Documentation references:
 *  - https://tailwindcss.com
 *  - https://www.youtube.com/watch?v=mr15Xzb1Ook
 *
 *
 *
 * QUESTION 2:
 * -----------
 * Currently our form is not keyboard accessible. Users cannot hit
 * <Enter> right after typing to submit the form (add new todo). Fix this issue.
 */

export const CreateTodoForm: React.FC = () => {
  const [todoBody, setTodoBody] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted!");
  };

  // hit ENTER to add new todo
  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      
      // check input empty
      if (todoBody !== "") {
        alert("please type something")
      }
      else {
        event.currentTarget.blur();
        handleSubmit(event);
      }
    }
  };


  const apiContext = api.useContext();
  const { mutate: createTodo, isLoading: isCreatingTodo } =
    api.todo.create.useMutation({
      onSuccess: () => {
        apiContext.todo.getAll.refetch();
      }
    });


  return (
    <form
      onSubmit={handleSubmit}
      className="group flex items-center justify-between rounded-12 border border-gray-200 py-2 pr-4 focus-within:border-gray-400">
      <label htmlFor={TODO_INPUT_ID} className="sr-only">
        Add todo
      </label>

      <input
        ref={inputRef}
        onKeyUp={handleEnterPress}
        id={TODO_INPUT_ID}
        type="text"
        placeholder="Add todo"
        value={todoBody}
        onChange={(e) => {
          setTodoBody(e.target.value);
        }}
        className="flex-1 px-4 text-base placeholder:text-gray-400 focus:outline-none"
      />

      <button
        type="submit"
        disabled={isCreatingTodo}
        onClick={() => {
          // check input empty
          if (todoBody !== "") {
            createTodo({
              body: todoBody
            })
          }
          else {
            alert("please enter todo")
          };
          setTodoBody("");
        }}
        className="px-5 py-2 rounded-full bg-gray-700 text-white"
      >
        Add
      </button>
    </form>
  );
};

const TODO_INPUT_ID = "todo-input-id";
