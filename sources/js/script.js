var todoList = new Vue ({
	el: '#canvas',
	data: {
		newContent: "",
		todos: []
	},
	methods: {
		addItem () {
			if (this.newContent) {
				this.todos.push({done: false, content: this.newContent});
				this.newContent = "";
			} else {
				console.log("Nothing to create");
			}
		},
		undone: function (todos) {
			return todos.filter(function (todo) {
				return todo.done === false
			})
		},
		done: function (todos) {
			return todos.filter(function (todo) {
				return todo.done === true
			})
		}
	}
});