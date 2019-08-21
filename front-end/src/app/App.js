import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import AppHeader from '../common/AppHeader';
import Home from '../home/Home';
import Login from '../user/login/Login';
import Feed from '../feed/Feed';
import Todo from '../todo/Todo';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import LiveChat from '../livechat/LiveChat'
import OAuth2RedirectHandler from '../user/oauth2/OAuth2RedirectHandler';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import {getCurrentUser} from '../util/APIUtils';
import {ACCESS_TOKEN} from '../constants';
import PrivateRoute from '../common/PrivateRoute';
// import Alert from 'react-s-alert';
// import 'react-s-alert/dist/s-alert-default.css';
// import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

toast.configure({
	autoClose: 3000,
	draggable: false,
	//etc you get the idea
});

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			authenticated: false,
			currentUser: null,
			loading: false
		};

		this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
	}

	loadCurrentlyLoggedInUser() {
		this.setState({
			loading: true
		});

		getCurrentUser()
			.then(response => {
				this.setState({
					currentUser: response,
					authenticated: true,
					loading: false
				});
			}).catch(error => {
			this.setState({
				loading: false
			});
		});
	}

	handleLogout() {
		localStorage.removeItem(ACCESS_TOKEN);
		this.setState({
			authenticated: false,
			currentUser: null
		});
		toast("You're safely logged out!");
	}

	componentDidMount() {
		this.loadCurrentlyLoggedInUser();
	}

	render() {
		//Problem is we are not updating authenticated property immediately here, but we do this at componentDidMount()
		if (this.state.loading) {
			return <LoadingIndicator/>
		}

		return (
			<div className="app">
				<div className="app-top-box">
					<AppHeader authenticated={this.state.authenticated} onLogout={this.handleLogout}/>
				</div>
				<div className="app-body">
					<Switch>
						<Route exact path="/" component={Home}/>
						<PrivateRoute path="/profile" authenticated={this.state.authenticated} currentUser={this.state.currentUser}
													component={Profile}/>
						<PrivateRoute path="/feed" authenticated={this.state.authenticated} currentUser={this.state.currentUser}
													component={Feed}/>
						<PrivateRoute path="/todo" authenticated={this.state.authenticated} currentUser={this.state.currentUser}
													component={Todo}/>
						<PrivateRoute path="/livechat" authenticated={this.state.authenticated} currentUser={this.state.currentUser}
													component={LiveChat}/>
						{/*Settings should be included here.*/}
						{/*<PrivateRoute path="/settings" authenticated={this.state.authenticated} currentUser={this.state.currentUser} component={Settings}/>*/}

						<Route path="/login"
									 render={(props) => <Login authenticated={this.state.authenticated}
																						 onLogin={this.loadCurrentlyLoggedInUser} {...props} />}/>
						<Route path="/signup"
									 render={(props) => <Signup authenticated={this.state.authenticated} {...props} />}/>
						<Route path="/oauth2/redirect" component={OAuth2RedirectHandler}/>
						<Route component={NotFound}/>
					</Switch>
				</div>
			</div>
		);
	}
}

export default App;
