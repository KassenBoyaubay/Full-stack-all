import React, { useState } from 'react'
import axios from 'axios'

function ChangePassword() {

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const changePassword = () => {
        axios.put('https://full-stack-api-kas.herokuapp.com/auth/changepassword',
            {
                oldPassword: oldPassword,
                newPassword: newPassword
            },
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken")
                }
            }).then((response) => {
                if (response.data.error) {
                    alert(response.data.error)
                }
            })
    }

    return (
        <div className="loginContainer">
            <h1>Change Your Password</h1>
            <input type="password" className="password" placehorder="Old Password..."
                onChange={(event) => { setOldPassword(event.target.value) }} />
            <input type="password" className="password" placehorder="New Password..."
                onChange={(event) => { setNewPassword(event.target.value) }} />
            <button onClick={changePassword}>Save Changes</button>
        </div>
    )
}

export default ChangePassword
