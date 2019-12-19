import React from "react";
import { Auth } from "aws-amplify";

function getRandomString(bytes: number) {
  const randomValues = new Uint8Array(bytes);
  window.crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map(intToHex)
    .join("");
}

function intToHex(nr: number) {
  return nr.toString(16).padStart(2, "0");
}

class Login extends React.Component {
  state = {
    email: "",
    mobile: "",
    username: "",
    signinType: "email",
    otp: "",
    authUser: "",
    result: ""
  };

  // signUP
  signUp =()=>{

    let payload;

    let {email, mobile, username, signinType} = this.state;

    if(signinType==="email"){
        payload = {
            username: username,
            password: getRandomString(30),
            attributes: {
              email: email
            },
            validationData: [] //optional
          };
    }

    if(signinType==="mobile"){
       payload = {
        username: username,
        password: getRandomString(30),
        attributes: {
          phone_number: mobile
        },
        validationData: [] //optional
      };
    }

    Auth.signUp(payload)
      .then(data => {
        console.log("signup_res", data)
        console.log("Token", data.getTo)
        this.signIn();
      })
      .catch(err => {
        console.log("signup_err", err)
        if (err.code === "UsernameExistsException") {
            this.signIn();
        } else {
            this.setState({
                result: err.message
            });
        }
      });
  }

  // Sign in.  
  signIn = () => {
    Auth.signIn(this.state.username)
      .then(user => {
        console.log("signin_res", user);
        this.setState({
          authUser: user
        });
      })
      .catch(err => {
        console.log("signin_err", err);
        this.setState({
            result: err.message
        });
      });
  };

// OTP verify
  verifyCode = () => {
    let authUser = this.state.authUser;
    let otp = this.state.otp;

    Auth.sendCustomChallengeAnswer(authUser, otp)
      .then(data => {
            console.log("verifyCode_data", data);
            if(data.signInUserSession){
                this.setState({
                    result: "Successfully Loggedin."
                });
            }else{
                this.setState({
                    result: "Wronge OTP."
                });
            }
            
        })
      .catch(err => {
            console.log("verifyCode_err", err)
            this.setState({
                result: err.message
            });
        });
  };

//   handle input box.

  handleInput = e => {
    let name = e.target.name;
    let val = e.target.value;
    if (name === "email") {
      this.setState({
        email: val,
        username: val
      });
    } else if (name === "mobile") {
        this.setState({
          mobile: val,
          username: val
        });
    } else if (name === "otp") {
      this.setState({
        otp: val
      });
    }
  };

//   handle radio button.
  handleRadio = val =>{
    
    this.setState({
        signinType: val
      });
  };

  render() {
    return ( 
    <div>
      <div>
        <div>
            <label>
                <input 
                    name="signinType" 
                    type="radio" 
                    value="email"
                    onChange={()=>this.handleRadio("email")}
                    checked={(this.state.signinType === "email")? "checked" : undefined}
                ></input>
                Email
            </label>
            <label>
                <input 
                    name="signinType" 
                    type="radio" 
                    value="mobile"
                    onChange={()=>this.handleRadio("mobile")}
                    checked={(this.state.signinType === "mobile")? "checked" : undefined}
                ></input>
                Mobile
            </label>
        </div>
        <div>
            {
                (this.state.signinType ==="email")?
                <input 
                    name = "email"
                    type = "text"
                    placeholder = "Enter Email"
                    onChange = {this.handleInput}
                    value = {this.state.email}
                />
                :
                <input 
                    name = "mobile"
                    type = "text"
                    placeholder = "Enter mobile (+919999999999)"
                    onChange = {this.handleInput}
                    value = {this.state.mobile}
                />
            }
        </div>
        <div>
            <button onClick = {() => this.signUp()} > Get OTP </button> 
        </div>
        
        <div>
            <input 
                name = "otp"
                type = "number"
                placeholder = "Enter OTP"
                onChange = {this.handleInput}
                value = {this.state.otp}
            /> 
        </div>
        <div>
            <button onClick = {() => this.verifyCode()} > OTP verify </button> 
        </div>
        </div>

        <div>
            <h4>Result</h4>
            <p>{this.state.result}</p>
        </div>
      </div>
    );
  }
}

export default Login;