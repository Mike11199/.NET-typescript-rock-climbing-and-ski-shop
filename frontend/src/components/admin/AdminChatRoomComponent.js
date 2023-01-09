import { Toast, Button, Form } from "react-bootstrap";
import { Fragment, useState, useEffect } from "react";

const AdminChatRoomComponent = ({ chatRoom, roomIndex, socket, socketUser }) => {
  [window["toast" + roomIndex], window["closeToast" + roomIndex]] =
    useState(true);
    const [rerender, setRerender] = useState(false);

  const close = () => {
    window["closeToast" + roomIndex](false);
  };

  const adminSubmitChatMsg = (e, elem) => {
      e.preventDefault();
      if (e.keyCode && e.keyCode !== 13) {
          return;
      }
      const msg = document.getElementById(elem);
      let v = msg.value.trim();
      if (v === "" || v === null || v === false || !v) {
         return; 
      }
      chatRoom[1].push({ admin: msg.value });
      socket.emit("admin sends message", {
          message: v,
      })
       setRerender(!rerender);
        msg.focus();
        setTimeout(() => {
            msg.value = "";
            const chatMessages = document.querySelector(`.cht-msg${socketUser}`);
            if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 200)
  }

  useEffect(() => {
     const chatMessages = document.querySelector(`.cht-msg${socketUser}`); 
     if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
  })

  return (
    <>
      <Toast
        show={window["toast" + roomIndex]}
        onClose={() => close()}
        className="ms-4 mb-5"
      >
        <Toast.Header>
          <strong className="me-auto">Chat with User</strong>
        </Toast.Header>
        <Toast.Body>
          <div className={`cht-msg${socketUser}`} style={{ maxHeight: "500px", overflow: "auto" }}>
            {chatRoom[1].map((msg, idx) => (
              <Fragment key={idx}>
                {msg.client && (
                  <p
                    key={idx}
                    className="bg-primary p-3 ms-4 text-light rounded-pill"
                  >
                    <b>User wrote:</b> {msg.client}
                  </p>
                )}
                {msg.admin && (
                  <p key={idx}>
                    <b>Admin wrote:</b> {msg.admin}
                  </p>
                )}
              </Fragment>
            ))}
          </div>

          <Form>
            <Form.Group
              className="mb-3"
              controlId={`adminChatMsg${roomIndex}`}
            >
              <Form.Label>Write a message</Form.Label>
              <Form.Control onKeyUp={(e) => adminSubmitChatMsg(e, `adminChatMsg${roomIndex}`)} as="textarea" rows={2} />
            </Form.Group>
            <Button onClick={(e) => adminSubmitChatMsg(e, `adminChatMsg${roomIndex}`)} variant="success" type="submit">
              Submit
            </Button>
          </Form>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default AdminChatRoomComponent;

