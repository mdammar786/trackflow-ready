import { useMemo, useState } from 'react'
import { useApp } from '../hooks/useApp'
import { KanbanBoard } from '../components/KanbanBoard'
import { FilterBar } from '../components/FilterBar'
import { TaskDetail } from '../components/TaskDetail'
import { AddTaskForm } from '../components/AddTaskForm'
import { filterTasks } from '../lib/utils'
import type { Task } from '../types'

export function BoardPage() {
  const { state, dispatch } = useApp()
  const [showAddForm, setShowAddForm] = useState(false)

  const visibleTasks = useMemo(
    () => filterTasks(state.tasks, state.filter),
    [state.tasks, state.filter],
  )

  const selectedTask = useMemo(
    () => state.tasks.find((t) => t.id === state.selectedTaskId) ?? null,
    [state.tasks, state.selectedTaskId],
  )

  function handleStatusChange(taskId: string, status: Task['status']) {
    dispatch({ type: 'SET_TASK_STATUS', taskId, status })
  }

  function handleAddTask(task: Task) {
    dispatch({ type: 'ADD_TASK', task })
    setShowAddForm(false)
  }

  return (
    <div className="board-page">
      <div className="board-page__toolbar">
        <FilterBar
          filter={state.filter}
          users={state.users}
          labels={state.labels}
          taskCount={visibleTasks.length}
          totalCount={state.tasks.length}
          onFilterChange={(f) => dispatch({ type: 'SET_FILTER', filter: f })}
          onClear={() => dispatch({ type: 'CLEAR_FILTERS' })}
        />
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="btn btn--primary"
        >
          + New task
        </button>
      </div>
      <div className="board-page__body">
        <KanbanBoard
          tasks={visibleTasks}
          users={state.users}
          labels={state.labels}
          selectedId={state.selectedTaskId}
          onSelect={(id) => dispatch({ type: 'SELECT_TASK', taskId: id })}
          onStatusChange={handleStatusChange}
        />
        {selectedTask && (
          <TaskDetail
            task={selectedTask}
            users={state.users}
            labels={state.labels}
            comments={state.comments}
            onStatusChange={handleStatusChange}
            onClose={() => dispatch({ type: 'SELECT_TASK', taskId: null })}
          />
        )}
      </div>
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <AddTaskForm
              sprints={state.sprints}
              users={state.users}
              labels={state.labels}
              defaultSprintId={state.activeSprint}
              onAdd={handleAddTask}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
