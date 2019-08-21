import React from 'react'
import TodoItem from "./TodoItem"
import {getTodos, postTodo, updateTodo, deleteTodo} from '../util/APIUtils';
import "./Todo.css"
import {toast} from "react-toastify";
import LoadingIndicator from '../common/LoadingIndicator';

class Todo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			todos: [],
			loading: true,
		};
		this.getItems = this.getItems.bind(this);
		this.getItem = this.getItem.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
		this.createItem = this.createItem.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
	}

	componentDidMount() {
		this.getItems();
	}

	getItems() {
		getTodos()
			.then(response => {
				console.log(response);
				this.setState({
					todos: response,
					loading: false
				});
			}).catch(error => {
				toast(error.error)
			/*this.setState((prevState) => {
					prevState.loading = false;
					return prevState;
			});*/
		});
	}

	getItem(id) {
		return this.state.todos.find(todo => {
			return todo.id === id
		})
	}

	deleteItem(id) {
        return deleteTodo(id).then(response => {
            toast("Todo has been deleted!");
            let todos = this.state.todos;
            todos.pop(response);
            this.setState({
                todos: todos
            });
        }).catch(error => {
            toast((error && error.message) || 'Oops! Something went wrong. Please try again!');
        });
    }

	createItem(event) {
		event.preventDefault();

		const todoRequest = Object.assign({}, {
				message: this.state.message
			}
		);
		console.log(JSON.stringify(todoRequest));

		return postTodo(todoRequest).then(response => {
			toast("Your todo has been submitted!");
			let lists = this.state.todos;
			lists.push(response);
			this.setState({
				todos: lists
			});
		}).catch(error => {
			toast((error && error.message) || 'Oops! Something went wrong. Please try again!');
		});
	}

	//FIXME: This should be improved. Fetching the changed todo first, then making the change at the callback, instead making another API call after every todo update.
	handleCheckboxChange(id) {
		this.setState((prevState) => {
			const updatedTodos = prevState.todos
				.map(todo => {
					if (todo.id === id) todo.completed = !todo.completed;
					return todo
				});
			return {
				todos: updatedTodos
			}
		}, () => {
			updateTodo(this.getItem(id))
				.then(response => {
					console.log('Response');
					console.log(response);
				})
				.catch(error => {
					toast(error);
				});
		});
	}

	handleTextChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	render() {
		if (this.state.loading) {
			return <LoadingIndicator/>
		}
		const todoItems = this.state.todos.map((todo) =>
			<TodoItem
				key={todo.id}
				userId={this.props.currentUser.id}
				todoItem={todo}
				handleChange={this.handleCheckboxChange}
				onDelete={this.deleteItem}
			/>
		);
		return (
			<div className="container">
				<h4>Enter a post:</h4>
				<form onSubmit={this.createItem}>
					<label>
						<input type="text" name="message" value={this.state.message} onChange={this.handleTextChange}/>
					</label>
					<input type="submit" value="Submit"/>
				</form>

				<div className={"todo-list"}>
					{todoItems}
				</div>
			</div>
		);
	}

}

export default Todo
