import { createStore } from 'vuex'
import router from '@/router/index.js'

const store = createStore({
  state: {
    todos: [],
    activeDate: null,
    registrationDate: null,
    days: [],
    currentDayIndex: 0,
    isLoading: false,
  },
  getters: {
    days(state) {
      return state.days
    },
    currentDayIndex(state) {
      return state.currentDayIndex
    },
    currentTodo() {
      const savedTodo = localStorage.getItem('currentTodo')
      return savedTodo ? JSON.parse(savedTodo) : null
    },
    todos(state) {
      return state.todos
    },
    activeDate(state) {
      return state.activeDate
    },
    registrationDate(state) {
      return state.registrationDate
    },
    isLoading(state) {
      return state.isLoading
    },
    activeDayInThePast(state) {
      if (!state.activeDate) return false
      const today = new Date()
      const activeDayDate = new Date(state.activeDate)

      today.setHours(0, 0, 0, 0)
      activeDayDate.setHours(0, 0, 0, 0)
      return activeDayDate < today
    },
  },
  mutations: {
    setDays(state, days) {
      state.days = days
    },
    resetState(state) {
      state.todos = []
      state.activeDate = null
      state.registrationDate = null
      state.days = []
      state.currentDayIndex = 0
      state.isLoading = false
    },
    setCurrentDayIndex(state, index) {
      state.currentDayIndex = index
    },
    setLoading(state, loading) {
      state.isLoading = loading
    },
    updateDay(state, todo) {
      const todoDate = todo.date.seconds ? new Date(todo.date.seconds * 1000) : todo.date
      const todosForDate = state.todos.filter(
        (t) => new Date(t.date.seconds * 1000).toDateString() === todoDate.toDateString(),
      )
      const dayToUpdate = state.days.find(
        (day) => day.date.toDateString() === todoDate.toDateString(),
      )

      if (dayToUpdate) {
        dayToUpdate.dayTaskState = ''

        todosForDate.forEach((t) => {
          if (t.isDone) {
            dayToUpdate.dayTaskState += 'd'
          } else {
            dayToUpdate.dayTaskState += 'u'
          }
        })
      }
    },
    fetchDays(state) {
      const todosByDate = {}
      state.todos.forEach((todo) => {
        const todoDate = new Date(todo.date.seconds * 1000).toDateString() // convert to milliseconds

        if (!todosByDate[todoDate]) {
          todosByDate[todoDate] = { dayTaskState: '' }
        }

        if (todo.isDone) {
          todosByDate[todoDate].dayTaskState += 'd'
        } else {
          todosByDate[todoDate].dayTaskState += 'u'
        }
      })

      state.days.forEach((day) => {
        const dayDateString = day.date.toDateString()
        day.dayTaskState = todosByDate[dayDateString]?.dayTaskState || ''
      })
    },
    addDays(state, days) {
      state.days.push(...days)
    },
    addPreviousDays(state, days) {
      state.days.unshift(...days)
    },
    setTodos(state, todos) {
      state.todos = todos
    },
    setActiveDate(state, date) {
      state.activeDate = date
    },
    setRegistrationDate(state, date) {
      state.registrationDate = date
    },
    toggleTodoStatus(state, todoId) {
      const todo = state.todos.find((t) => t.id === todoId)
      if (todo) {
        todo.isDone = !todo.isDone
      }
    },
    deleteTodo(state, todo) {
      state.todos = state.todos.filter((t) => t.id !== todo.id)
    },
    addTodo(state, todo) {
      state.todos.push(todo)
    },
    updateTodo(state, newTodo) {
      const oldTodo = state.todos.find((t) => t.id === newTodo.id)
      if (oldTodo) {
        Object.assign(oldTodo, newTodo)
      }
    },
    setCurrentTodo(state, todo) {
      state.currentTodo = todo

      localStorage.setItem('currentTodo', JSON.stringify(todo))
    },
    clearCurrentTodo(state) {
      state.currentTodo = null
      localStorage.removeItem('currentTodo')
    },
    moveTasksToToday(state, { goalTodo, today }) {
      state.todos.find((todo) => todo.id === goalTodo.id).date = new Date(today)
    },
  },
  actions: {
    setLoading({ commit }, loading) {
      commit('setLoading', loading)
    },
    resetStore({ commit }) {
      commit('resetState')
    },
    updateCurrentDayIndex({ commit }, index) {
      commit('setCurrentDayIndex', index)
    },
    fetchDays({ commit, state }) {
      const days = []
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const registDayWithoutTime = new Date(state.registrationDate)
      registDayWithoutTime.setHours(0, 0, 0, 0)

      // Determine the start date of loading
      let startDate
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(today.getDate() - 30)
      thirtyDaysAgo.setHours(0, 0, 0, 0)

      // If the registration date is not earlier than 30 days earlier than today's date
      if (registDayWithoutTime >= thirtyDaysAgo) {
        startDate = registDayWithoutTime
      } else {
        startDate = thirtyDaysAgo
      }

      // Generate days from registration date to current date
      for (let d = startDate; d < today; d.setDate(d.getDate() + 1)) {
        days.push({ date: new Date(d) })
      }

      // Generate days from current date to 30 days later
      for (let i = 0; i < 30; i++) {
        const nextDay = new Date(today)
        nextDay.setDate(today.getDate() + i)
        days.push({ date: nextDay })
      }

      // set currentDayIndex and activeDayIndex
      const currentDayIndex = days.findIndex(
        (day) => day.date.toDateString() === today.toDateString(),
      )
      commit('setCurrentDayIndex', currentDayIndex)

      if (!state.activeDate) {
        commit('setActiveDate', today)
      }
      commit('setDays', days)
      commit('fetchDays')
    },

    setDays({ commit }) {
      commit('setDays')
    },
    loadNextDays({ commit, state }) {
      const daysToAdd = []
      let lastDay = state.days[state.days.length - 1].date
      lastDay = new Date(lastDay)

      // Generate 30 new days starting from the day after the last one
      for (let i = 1; i <= 30; i++) {
        const nextDay = new Date(lastDay)
        nextDay.setDate(lastDay.getDate() + i)
        daysToAdd.push({ date: nextDay })
      }

      commit('addDays', daysToAdd)
      commit('fetchDays')
    },
    loadPreviousDays({ commit, state }) {
      const daysToAdd = []
      let lastDay = state.days[0].date
      lastDay = new Date(lastDay)
      const registrationDate = new Date(state.registrationDate)

      // Generate 30 new days starting from a date that is one month earlier
      for (let i = 30; i >= 1; i--) {
        const previousDay = new Date(lastDay)
        previousDay.setDate(lastDay.getDate() - i)

        if (previousDay >= registrationDate) {
          daysToAdd.push({ date: previousDay, dayTaskState: '' })
        }
      }

      commit('addPreviousDays', daysToAdd)
      // change currentDayIndex
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const currentDayIndex = state.days.findIndex(
        (day) => day.date.toDateString() === today.toDateString(),
      )
      commit('setCurrentDayIndex', currentDayIndex)
      commit('fetchDays')
    },
    async fetchTodos({ commit }) {
      const todos = await todoService.getTodos()
      commit('setTodos', todos)
    },
    async fetchRegistrationDate({ commit }) {
      commit('setLoading', true)
      const date = await todoService.getRegistrationDate()
      commit('setRegistrationDate', date)
    },
    async updateTodoStatus({ commit }, todo) {
      commit('toggleTodoStatus', todo.id)
      await todoService.updateTodoStatus(todo.id, todo.isDone)
      commit('updateDay', todo)
    },
    async deleteTodo({ commit }, todo) {
      commit('deleteTodo', todo)
      await todoService.deleteTodo(todo.id)
      commit('updateDay', todo)
    },
    async addTodo({ commit }, todo) {
      commit('addTodo', todo)
      await todoService.addTodo(todo)
      commit('updateDay', todo)
    },
    async updateTodo({ commit, state }, newTodo) {
      commit('updateTodo', newTodo)
      await todoService.updateTodo(state.currentTodo.id, newTodo)
      commit('updateDay', newTodo)
    },
    setActiveDate({ commit }, date) {
      commit('setActiveDate', date)
    },
    setCurrentTodo({ commit }, todo) {
      commit('setCurrentTodo', todo)
    },
    clearCurrentTodo({ commit }) {
      commit('clearCurrentTodo')
    },
    async moveTasksToToday({ commit, dispatch, state }) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      await Promise.all(
        state.todos.map(async (todo) => {
          if (
            new Date(todo.date.seconds * 1000).toDateString() === state.activeDate.toDateString()
          ) {
            commit('moveTasksToToday', { goalTodo: todo, today })

            try {
              await todoService.updateTodo(todo.id, { ...todo, date: today })
            } catch (error) {
              console.error(`Error updating task with ID ${todo.id}:`, error)
            }
          }
        }),
      )
      await dispatch('fetchTodos')
    },
    logout({ dispatch }) {
      localStorage.removeItem('userId')
      router.push({ name: 'login' })
      dispatch('resetStore')
    },
  },
})

export default store
