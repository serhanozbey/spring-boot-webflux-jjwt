import React from 'react'
import "./Todo.css"


const styles = {
    color: "black",
    backgroundColor: "whitesmoke"
};

class TodoItem extends React.Component {


    constructor(props) {
        super(props);
    }

    render() {
        const completedTextStyle = this.props.todoItem.completed ? {textDecorationLine: 'line-through'} : null;
        return (
            <div className={"todo-item"} style={styles}>
                <input
                    type="checkbox"
                    onChange={() =>
                        this.props.handleChange(this.props.todoItem.id)}
                    defaultChecked={this.props.todoItem.completed}
                />
                <p style={completedTextStyle}>{this.props.todoItem.message}</p>
                { this.props.userId === this.props.todoItem.app_user_id && <button onClick = {() => this.props.onDelete(this.props.todoItem.id)}>
                    Remove
                </button>}
            </div>
        );
    }
}

export default TodoItem
