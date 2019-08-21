import React, {Component} from 'react';
import './Feed.css';
import {getFeed, postFeed, deleteFeed} from '../util/APIUtils';
// import Alert from 'react-s-alert';
import LoadingIndicator from '../common/LoadingIndicator';
import {toast} from "react-toastify";

class Feed extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            list: [],
            loading: true,
            message: ""
        };
        this.getItems = this.getItems.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.createItem = this.createItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderList = this.renderList.bind(this);
        this.renderRow = this.renderRow.bind(this);
        
    }

    componentDidMount() {
        this.getItems();
    }

    getItems() {
        getFeed()
            .then(response => {
                console.log(response);
                this.setState({
                    list: response,
                    authenticated: true,
                    loading: false
                });
            }).catch(error => {
            toast(error.error)
            // this.setState({
            //     loading: false
            // });
        });
    }

    renderList() {
        return this.state.list.map(this.renderRow)
    }

    deleteItem(id) {
        return deleteFeed(id).then(response => {
            toast("Your post has been deleted!");
            let lists = this.state.list;
            lists.pop(response);
            this.setState({
                lists: lists
            });
        }).catch(error => {
            toast((error && error.message) || 'Oops! Something went wrong. Please try again!');
        });
    }

    renderRow(item) {
        return (
            <div className={"feed-item"} key={item.id}>
                <h4> Message: {item.message}</h4>
                <p>
                    <small> User{item.app_user_id}</small>
                </p>
                <p>
                    <small>Post ID: {item.id}</small>
                </p>
                {/* onClick={removeItem} */}
                { this.props.currentUser.id === item.app_user_id && <button onClick = {() => this.deleteItem(item.id)}>
                    Remove
                </button>}
            </div>)
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    createItem(event) {
        event.preventDefault();

        const postRequest = Object.assign({}, {
                message: this.state.message
            }
        );
        console.log(JSON.stringify(postRequest));

        return postFeed(postRequest,this.props.currentUser.id).then(response => {
            toast("Your post has been submitted!");
            let lists = this.state.list;
            lists.push(response);
            this.setState({
                lists: lists
            });
        }).catch(error => {
            toast((error && error.message) || 'Oops! Something went wrong. Please try again!');
        });
    }

    render() {
        if (this.state.loading) {
            return <LoadingIndicator/>
        }
        return (<div className="container">
            <div className="feed-submit">
                <form onSubmit={this.createItem}>
                    <label>
                        Enter a post:
                        <input type="text" name="message" value={this.state.message} onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
            <div className="feed-list">
                {this.renderList()}
            </div>
        </div>);
    }

}

export default Feed
