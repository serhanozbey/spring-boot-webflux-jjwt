import React, {Component} from 'react';
import './Profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        return (
            <div className="profile-container">
                <div className="container">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            { 
                                this.props.currentUser.imageUrl ? (
                                    <img src={this.props.currentUser.imageUrl} alt={this.props.currentUser.firstName}/>
                                ) : (
                                    <div className="text-avatar">
                                        <span>{this.props.currentUser.firstName && this.props.currentUser.firstName[0]}</span>
                                    </div>
                                )
                            }
                        </div>
                        <div className="profile-name">
                           <h2>Welcome {this.props.currentUser.firstName}!</h2>
                           <p className="profile-email">{this.props.currentUser.email}</p>
                        </div>
                    </div>
                </div>    
            </div>
        );
    }
}

export default Profile