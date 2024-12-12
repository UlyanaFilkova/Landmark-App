<template>
  <div class="container">
    <BaseLoader v-if="isLoading" />
    <div>
      <HomeHeader />
      <CalendarList />
      <ToDoList />
      <BaseButton
        v-if="!activeDayInThePast"
        @click="handleAddClick"
        text="+ Add a New Task"
        class="big-button fixed-button"
      />
    </div>
  </div>
</template>

<script>
import CalendarList from '@/components/home/CalendarList.vue'
import HomeHeader from '@/components/home/HomeHeader.vue'
import ToDoList from '@/components/home/ToDoList.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    HomeHeader,
    CalendarList,
    ToDoList,
    BaseButton,
    BaseLoader,
  },
  computed: {
    ...mapGetters(['todos', 'activeDate', 'registrationDate', 'isLoading', 'activeDayInThePast']),
  },
  methods: {
    ...mapActions(['fetchTodos', 'fetchRegistrationDate', 'fetchDays']),
    handleAddClick() {
      this.$router.push({ name: 'todo' })
    },
    async initTodos() {
      await this.fetchRegistrationDate()
      await this.fetchTodos()
      await this.fetchDays()
      window.scrollTo({ top: 0 })
    },
  },

  created() {
    this.initTodos()
  },
}
</script>

<style scoped>
.container {
  box-sizing: border-box;
  min-height: 100vh;
  margin: 0 20px;
  padding-bottom: 70px;
}
@media (max-width: 576px) {
  .container {
    margin: 0 15px;
  }
}

.fixed-button {
  display: block;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
