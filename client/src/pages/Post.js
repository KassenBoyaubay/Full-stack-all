import React, { useEffect, useState, useContext } from 'react'
import axios from "axios"
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'

function Post() {

    // id from url
    let { id } = useParams()

    // redirect url
    let history = useHistory()

    const [postObject, setPostObject] = useState({})
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const { authState } = useContext(AuthContext)

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            setPostObject(response.data)
        })

        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data)
        })
    }, [id])

    const addComment = () => {
        axios.post("http://localhost:3001/comments",
            { commentBody: newComment, PostId: id },
            {
                headers: {                                              // headers for validation token
                    accessToken: localStorage.getItem("accessToken")
                }
            })
            .then((response) => {
                if (response.data.error) alert(response.data.error)
                else {
                    setComments([...comments, { commentBody: newComment, username: response.data.username }])
                    setNewComment("")
                }
            })
    }

    const deleteComment = (id) => {
        axios.delete(`http://localhost:3001/comments/${id}`,
            {
                headers: {                                              // headers for validation token          
                    accessToken: localStorage.getItem("accessToken")
                }
            }).then((response) => {
                setComments(comments.filter((value) => {
                    return value.id !== id
                }))
            })
    }

    const deletePost = (id) => {
        axios.delete(`http://localhost:3001/posts/${id}`,
            {
                headers: {                                              // headers for validation token          
                    accessToken: localStorage.getItem("accessToken")
                }
            }).then((response) => {
                history.push('/')
            })
    }

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div className="title">
                        {postObject.title}
                    </div>
                    <div className="body">
                        {postObject.postText}
                    </div>
                    <div className="footer">
                        {postObject.username}
                        {authState.username === postObject.username && (
                            <button onClick={() => { deletePost(postObject.id) }}>Delete Post</button>
                        )}
                    </div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input type="text" placeholder="Comment..." autoComplete="off" value={newComment}
                        onChange={(event) => setNewComment(event.target.value)} />
                    <button onClick={addComment}>Add Comment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return (
                            <div key={key} className="comment">
                                {comment.commentBody}
                                <label>Username: {comment.username}</label>
                                {
                                    authState.status &&
                                    authState.username === comment.username &&
                                    <button onClick={() => { deleteComment(comment.id) }}>X</button>
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Post
