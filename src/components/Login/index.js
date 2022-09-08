import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorMessage: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onFailure = errorMessage => {
    this.setState({showError: true, errorMessage})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    console.log(response)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSuccess(data.jwt_token)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showError, errorMessage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div>
        <div>
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
            />
          </div>
          <form onSubmit={this.onSubmitForm}>
            <h1>Welcome Back!</h1>
            <label htmlFor="username">User ID</label>
            <input
              type="text"
              value={username}
              placeholder="Enter User Id"
              id="username"
              onChange={this.onChangeUsername}
            />
            <label htmlFor="password">PIN</label>
            <input
              type="password"
              value={password}
              placeholder="Enter PIN"
              id="password"
              onChange={this.onChangePassword}
            />
            <button type="submit">Login</button>
            {showError ? <p>{errorMessage}</p> : null}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
