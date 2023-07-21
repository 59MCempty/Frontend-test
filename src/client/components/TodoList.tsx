import { useState, type SVGProps, useRef } from 'react'

import * as Checkbox from '@radix-ui/react-checkbox'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { api } from '@/utils/client/api'
import { log } from 'console'
import { check } from 'prettier'

/**
 * QUESTION 3:
 * -----------
 * A todo has 2 statuses: "pending" and "completed"
 *  - "pending" state is represented by an unchecked checkbox
 *  - "completed" state is represented by a checked checkbox, darker background,
 *    and a line-through text
 *
 * We have 2 backend apis:
 *  - (1) `api.todo.getAll`       -> a query to get all todos
 *  - (2) `api.todoStatus.update` -> a mutation to update a todo's status
 *
 * Example usage for (1) is right below inside the TodoList component. For (2),
 * you can find similar usage (`api.todo.create`) in src/client/components/CreateTodoForm.tsx
 *
 * If you use VSCode as your editor , you should have intellisense for the apis'
 * input. If not, you can find their signatures in:
 *  - (1) src/server/api/routers/todo-router.ts
 *  - (2) src/server/api/routers/todo-status-router.ts
 *
 * Your tasks are:
 *  - Use TRPC to connect the todos' statuses to the backend apis
 *  - Style each todo item to reflect its status base on the design on Figma
 *
 * Documentation references:
 *  - https://trpc.io/docs/client/react/useQuery
 *  - https://trpc.io/docs/client/react/useMutation
 *
 *
 *
 *
 *
 * QUESTION 4:
 * -----------
 * Implement UI to delete a todo. The UI should look like the design on Figma
 *
 * The backend api to delete a todo is `api.todo.delete`. You can find the api
 * signature in src/server/api/routers/todo-router.ts
 *
 * NOTES:
 *  - Use the XMarkIcon component below for the delete icon button. Note that
 *  the icon button should be accessible
 *  - deleted todo should be removed from the UI without page refresh
 *
 * Documentation references:
 *  - https://www.sarasoueidan.com/blog/accessible-icon-buttons
 *
 *
 *
 *
 *
 * QUESTION 5:
 * -----------
 * Animate your todo list using @formkit/auto-animate package
 *
 * Documentation references:
 *  - https://auto-animate.formkit.com
 */

export const TodoList = () => {

  const { data: todos = [] } = api.todo.getAll.useQuery({
    statuses: ['completed', 'pending'],
  })


  const [currentId, setCurrentId] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [parent] = useAutoAnimate();


  const listStatuses = ['all', 'pending', 'completed'];

  const clickStatusTodo = (e: React.MouseEvent<HTMLButtonElement>, status: string, id: number) => {
    setStatusFilter(status);
    setCurrentId(Number(e.currentTarget.id))
  }


  const filteredTodos = statusFilter === 'all' ? todos : todos.filter(todo => todo.status === statusFilter);

  const apiContext = api.useContext();

  // update status
  const { mutate: updateStatus, isLoading: isUpdatingStatus } =
    api.todoStatus.update.useMutation({
      onSuccess: () => {
        apiContext.todo.getAll.refetch();
      }
    })

  // delete todo  
  const { mutate: deleteTodo, isLoading: isDeletingTodo } =
    api.todo.delete.useMutation({
      onSuccess: () => {
        apiContext.todo.getAll.refetch();
      }
    });

  return (
    <>
      <div className='flex gap-2'>
        {listStatuses.map((s, id) =>
          <button
            key={id}
            id={String(id)}
            onClick={(e) => clickStatusTodo(e, s, id)}
            className={`border capitalize border-gray-200 rounded-full py-3 px-6 font-bold text-sm hover:text-white delay-200 transition duration-300 ease-out hover:bg-gray-600 ${currentId === id ? "bg-gray-700 text-white" : "bg-white text-gray-700"}`}>
            {s}
          </button>
        )}
      </div>

      <ul
        ref={parent}
        className="grid grid-cols-1 gap-y-3 pt-10 ">
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <div className="rounded-12 border border-gray-200 px-4 py-3 shadow-sm flex items-center justify-between">
              <div className='flex items-center '>
                <Checkbox.Root
                  disabled={isUpdatingStatus}
                  checked={todo.status === 'pending' ? false : true}

                  // change status todo pending to complete and opposite
                  onCheckedChange={() => updateStatus({
                    todoId: todo.id,
                    status: todo.status === 'pending' ? "completed" : 'pending'
                  })}

                  id={String(todo.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
                >
                  <Checkbox.Indicator>
                    <CheckIcon className="h-4 w-4 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>

                <label className={`block pl-3 text-base font-medium ${todo.status === 'completed' ? "line-through cursor-pointer capitalize text-gray-500" : ""}`} htmlFor={String(todo.id)}>
                  {todo.body}
                </label>
              </div>

              {/* button delete */}
              <div className="w-6 h-6 cursor-pointer"
                onClick={() => deleteTodo({
                  id: todo.id
                })}
              >
                <XMarkIcon />
              </div>

            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}
