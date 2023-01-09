import "../../chats.css";
import { useEffect, useState } from "react"
import socketIOClient from "socket.io-client"
import { useSelector } from "react-redux"

const UserChatComponent = () => {


  const [socket, setSocket] = useState(false)

  useEffect(() => {
      const socket = socketIOClient()
      setSocket(socket)                 // save socket client to local react state
      return () => socket.disconnect()  //return so socket will disconnect on page close
  }, [])

  
  const clientSubmitChatMsg = (e) => {
    // handler for chat message submit
    // if the key is not enter, return
    if (e.keyCode && e.keyCode !== 13) {
        return
    }
    socket.emit("client sends message", "message from client")  //server is listening for this named event
}

  return (
    <>
      <input type="checkbox" id="check" />
      <label className="chat-btn" htmlFor="check">
        <i className="bi bi-chat-dots comment"></i>
        {/* alert for new chat message - https://getbootstrap.com/docs/5.1/utilities/position/#examples */}
        <span className="position-absolute top-0 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>
        <i className="bi bi-x-circle close"></i>
      </label>
      <div className="chat-wrapper">
        <div className="chat-header">
          <h6>Let's Chat - Online</h6>
        </div>
        <div className="chat-form">
          <div className="cht-msg">

            {Array.from({ length: 20 }).map((_, id) => (
              <div key={id}>
                <p>
                  <b>You Wrote:</b>  Hello, world!  This is a toast message. 
                </p>
                <p className="bg-primary p-3 ms-4 mt-3 text-light rounded-pill">
                  <b>Support Wrote:</b>  Hello, world!  This is a toast message.                 
                </p>
              </div>
            ))
          }


          </div>
          <textarea
            onKeyUp={(e)=> clientSubmitChatMsg(e)}
            id="clientChatMsg"
            className="form-control"
            placeholder="Your Text Message"
          ></textarea>
          <button onClick={(e)=> clientSubmitChatMsg(e)} className="btn btn-success btn-block">Submit</button>
        </div>
      </div>
    </>
  );
};

export default UserChatComponent;

