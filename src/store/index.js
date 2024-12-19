"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMapStore = void 0;
const pinia_1 = require("pinia");
const vue_1 = require("vue");
exports.useMapStore = (0, pinia_1.defineStore)('map', () => {
    const todos = (0, vue_1.ref)([]);
    const totalTodos = (0, vue_1.computed)(() => todos.value.length);
    const addTodo = (title) => {
        todos.value.push({ title });
    };
    const removeTodo = (index) => {
        todos.value.splice(index, 1);
    };
    return {
        todos,
        totalTodos,
        addTodo,
        removeTodo,
    };
});
