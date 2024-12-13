import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Todo {
  title: string
}

interface MapState {
  todos: Todo[]
}

export const useMapStore = defineStore('map', () => {
  const todos = ref<Todo[]>([])

  const totalTodos = computed(() => todos.value.length)

  const addTodo = (title: string) => {
    todos.value.push({ title })
  }

  const removeTodo = (index: number) => {
    todos.value.splice(index, 1)
  }

  return {
    todos,
    totalTodos,
    addTodo,
    removeTodo,
  }
})
