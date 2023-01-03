import { useState } from 'react'
import type { FilterState, User, Label } from '../types'

interface FilterBarProps {
  filter: FilterState
  users: User[]
  labels: Label[]
  taskCount: number
  totalCount: number
  onFilterChange: (f: Partial<FilterState>) => void
  onClear: () => void
}

export function FilterBar({
  filter,
  users,
  labels,
  taskCount,
  totalCount,
  onFilterChange,
  onClear,
}: FilterBarProps) {
  const hasFilters =
    filter.query !== '' ||
    filter.status !== 'all' ||
    filter.priority !== 'all' ||
    filter.assigneeId !== 'all' ||
    filter.labelId !== 'all'

  if (hasFilters) {
    const [expanded, setExpanded] = useState(true)
    return (
      <div className="filter-bar filter-bar--active">
        <div className="filter-bar__summary">
          <span className="filter-bar__count">
            Showing {taskCount} of {totalCount}
          </span>
          <button type="button" onClick={() => setExpanded(!expanded)} className="filter-bar__toggle">
            {expanded ? 'Collapse' : 'Expand'}
          </button>
          <button type="button" onClick={onClear} className="filter-bar__clear">
            Clear filters
          </button>
        </div>
        {expanded && (
          <div className="filter-bar__fields">
            <FilterFields
              filter={filter}
              users={users}
              labels={labels}
              onFilterChange={onFilterChange}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="filter-bar">
      <FilterFields
        filter={filter}
        users={users}
        labels={labels}
        onFilterChange={onFilterChange}
      />
    </div>
  )
}

interface FilterFieldsProps {
  filter: FilterState
  users: User[]
  labels: Label[]
  onFilterChange: (f: Partial<FilterState>) => void
}

function FilterFields({ filter, users, labels, onFilterChange }: FilterFieldsProps) {
  return (
    <div className="filter-fields">
      <div className="filter-fields__group">
        <label htmlFor="filter-query">Search</label>
        <input
          id="filter-query"
          type="search"
          value={filter.query}
          placeholder="Search tasks…"
          onChange={(e) => onFilterChange({ query: e.target.value })}
        />
      </div>
      <div className="filter-fields__group">
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          value={filter.status}
          onChange={(e) => onFilterChange({ status: e.target.value as FilterState['status'] })}
        >
          <option value="all">All statuses</option>
          <option value="backlog">Backlog</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div className="filter-fields__group">
        <label htmlFor="filter-priority">Priority</label>
        <select
          id="filter-priority"
          value={filter.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value as FilterState['priority'] })}
        >
          <option value="all">All priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="filter-fields__group">
        <label htmlFor="filter-assignee">Assignee</label>
        <select
          id="filter-assignee"
          value={filter.assigneeId}
          onChange={(e) => onFilterChange({ assigneeId: e.target.value })}
        >
          <option value="all">All members</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-fields__group">
        <label htmlFor="filter-label">Label</label>
        <select
          id="filter-label"
          value={filter.labelId}
          onChange={(e) => onFilterChange({ labelId: e.target.value })}
        >
          <option value="all">All labels</option>
          {labels.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
