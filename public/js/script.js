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
		},
		
		check (handle) {
			console.log("Изначальный массив: ");
			for (i=0; i < this.todos.length; i++) {
				console.log("Done: " + this.todos[i].done + "\nContent: " + this.todos[i].content + ";");
			}
			console.log("Перемещение задания id=" + handle + "\"" + this.todos[handle].content + "\" в выполненные");
			var cont = this.todos[handle].content;
			console.log("записываем №" + handle + " \"" + cont + "\" во временную переменную;");
			console.log("удаляем из массива позицию №" + handle + "\"" + this.todos[handle].content);
			console.log("И заменяем его элементом " + {done: true, content: cont});
			this.todos.splice(handle, 1, {done: true, content: cont});
			cont="";
			console.log("Итоговый массив: ");
			for (i=0; i < this.todos.length; i++) {
				console.log("Done: " + this.todos[i].done + "\nContent: " + this.todos[i].content + ";");
			}
		},
		
		uncheck (handle) {
			console.log("Изначальный массив: ");
			for (i=0; i < this.todos.length; i++) {
				console.log("Done: " + this.todos[i].done + "\nContent: " + this.todos[i].content + ";");
			}
			console.log("Перемещение задания id=" + handle + "\"" + this.todos[handle].content + "\" в невыполненные");
			var cont = this.todos[handle].content;
			console.log("записываем №" + handle + " \"" + cont + "\" во временную переменную;");
			console.log("удаляем из массива позицию №" + handle + "\"" + this.todos[handle].content);
			console.log("И заменяем его элементом " + {done: false, content: cont});
			this.todos.splice(handle, 1, {done: false, content: cont});
			cont="";
			console.log("Итоговый массив: ");
			for (i=0; i < this.todos.length; i++) {
				console.log("Done: " + this.todos[i].done + "\nContent: " + this.todos[i].content + ";");
			}
		},
	}
});