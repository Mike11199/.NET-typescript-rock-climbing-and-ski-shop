import "../../chats.css";
import { useEffect, useState } from "react"
import socketIOClient from "socket.io-client"
import { useSelector } from "react-redux"

const UserChatComponent = () => {

  //   let chat = [
  //       {"client": "msg"},
  //       {"client": "msg"},
  //       {"admin": "msg"},
  //   ]

  const [chat, setChat] = useState([])
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo)
  const [messageReceived, setMessageReceived] = useState(false);
  const [chatConnectionInfo, setChatConnectionInfo] = useState(false);
  const [reconnect, setReconnect] = useState(false);

  const [socket, setSocket] = useState(false)

  useEffect(() => {
    if (!userInfo.isAdmin) {

      setReconnect(false)


      //get audio for message
      let audio = new Audio("/audio/chat-msg.mp3")


      const socket = socketIOClient();

      socket.on("no admin", (msg) => {
        
        setChat((chat)=> {
          return [...chat, {admin: "no admin here now"}]
        })
     
      })
      

      //if not admin, client listens for message from server
      socket.on("server sends message from admin to client", (msg)=> {
          setChat((chat) => {
            return [...chat, {admin: msg}]
          })
          setMessageReceived(true);
          audio.play() //play message

          const chatMessages = document.querySelector(".cht-msg")
          chatMessages.scrollTop = chatMessages.scrollHeight
      })  

      setSocket(socket);                  // save socket client to local react state

      socket.on("admin closed chat", () => {
        setChat([])
        setChatConnectionInfo("Admin closed chat.  Type something and submit to reconnect.")
        setReconnect(true)
      })


      return () => socket.disconnect();   // return so socket will disconnect on page close
    }
  }, [userInfo.isAdmin, reconnect]);

  
  
  const clientSubmitChatMsg = (e) => {
    // handler for chat message submit
    // if the key is not enter, return
    if (e.keyCode && e.keyCode !== 13) {
        return
    }
    setChatConnectionInfo("")
    setMessageReceived(false);

    const msg = document.getElementById("clientChatMsg")

    //trim or end function if message is empty
    let v = msg.value.trim()
    if (v === "" || v === null || v === false || !v) {
      return;
    }

    // socket.emit("client sends message", "message from client")  //server is listening for this named event
    socket.emit("client sends message", v)  //server is listening for this named event
    setChat((chat)=> {
      return [...chat, {client: v}]
    })

    //clear message field after user submits message after 200ms and scroll down
    msg.focus()
    setTimeout(()=> {
      msg.value=""
      const chatMessages = document.querySelector(".cht-msg")
      chatMessages.scrollTop = chatMessages.scrollHeight
    }, 200)


}

  //return the following HTML if the user is not an admin, or else null (ternary operator)
  return !userInfo.isAdmin? (
    <>
      <input type="checkbox" id="check" />
      
      
      {/* - htmlFor for the label below associates an ID (for the input checkbox above) with the label below.
          - This in effect allows the two <i> tags to also function as checkboxes.
          - We also add 'comment' and 'close' as additional classes to <i> tags below for CSS purposes. 
          - The logic for showing/displaying is handled in chats.css approximately lines 1-36
      */}
      <label className="chat-btn" htmlFor="check">  
        <i className="bi bi-chat-dots comment"></i>

        {/* alert for new chat message - https://getbootstrap.com/docs/5.1/utilities/position/#examples */}
        {messageReceived &&<span className="position-absolute top-0 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>}
        <i className="bi bi-x-circle close"></i>
      </label>


      {/* opacity CSS chat-wrapper possible cause of constant issues of buttons not being able to be clicked on mobile */}
      <div className="chat-wrapper">
        <div className="chat-header">
          <h6>Let's Chat - Online</h6>
        </div>
        <div className="chat-form">
          <div className="cht-msg">
          <p>{chatConnectionInfo}</p>

          {/* map array of chat values between admin/client to chat box */}
          {chat.map((item,id) => (
             <div key={id}>
             {item.client && (
               <p>
                 <b>You wrote:</b> {item.client}
               </p>
             )}
             {item.admin && (
               <p className="bg-primary p-3 ms-4 text-light rounded-pill">
                 <b>Support wrote:</b> {item.admin}
               </p>
             )}
           </div>
          ))}

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
  ): null
};

export default UserChatComponent;

