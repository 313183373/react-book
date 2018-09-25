import React, {Component} from "react";
import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, computed, action} from "mobx";

class Todo {
    id = Math.random();
    @observable title = "";
    @observable finished = false;

    constructor(title) {
        this.title = title;
    }
}

class TodoList {
    @observable todos = [];
    @observable filter = 'ALL';

    @computed
    get unfinishedTodoCount() {
        return this.todos.filter(todo => !todo.finished).length;
    }
    @computed
    get todosToShow() {
        return this.todos.filter(todo => this.filter === 'ALL' ? true : this.filter === 'COMPLETED' ? todo.finished : !todo.finished);
    }
}

@observer
class TodoListView extends Component {
    state = {
        text: '',
    };

    handleChange = e => {
        this.setState({
            text: e.target.value,
        })
    };

    @action
    handleClick = () => {
        const {todoList} = this.props;
        todoList.todos.push(new Todo(this.state.text));
    };

    render() {
        return (
            <div>
                <input type="text" value={this.state.text} onChange={this.handleChange}/>
                <button onClick={this.handleClick}>提交</button>
                <br/>
                <button onClick={action(() => {this.props.todoList.filter = 'ALL'})}>ALL</button><button onClick={action(() => {this.props.todoList.filter = 'COMPLETED'})}>COMPLETED</button><button onClick={action(() => {this.props.todoList.filter = 'UNCOMPLETED'})}>UNCOMPLETED</button>
                <ul>
                    {this.props.todoList.todosToShow.map(todo => (
                        <TodoView todo={todo} key={todo.id}/>
                    ))}
                </ul>
                剩余任务: {this.props.todoList.unfinishedTodoCount}
            </div>
        );
    }
}

const TodoView = observer(({todo}) => {
    const handleClick = action(() => (todo.finished = !todo.finished));
    return (
        <li>
            <input type="checkbox" checked={todo.finished} onClick={handleClick}/>
            {todo.title}
        </li>
    );
});

const store = new TodoList();
store.todos.push(new Todo("Task1"));
store.todos.push(new Todo("Task2"));

ReactDOM.render(
    <TodoListView todoList={store}/>,
    document.getElementById("root")
);
