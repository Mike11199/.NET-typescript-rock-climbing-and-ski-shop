import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EditUserPageComponent = ({ updateUserApiRequest, fetchUser }) => {
  const [validated, setValidated] = useState(false);
    const [user, setUser] = useState([]);
    const [isAdminState, setIsAdminState] = useState(false);
    const [updateUserResponseState, setUpdateUserResponseState] = useState({ message: "", error: "" });

    const { id } = useParams();
    const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;
    const name = form.name.value;
    const lastName = form.lastName.value;
    const email = form.email.value;
    const isAdmin = form.isAdmin.checked;
    if (event.currentTarget.checkValidity() === true) {
        updateUserApiRequest(id, name, lastName, email, isAdmin)
        .then(data => {
            if (data === "user updated") {
                navigate("/admin/users");
            }
        })
        .catch(er => {
            setUpdateUserResponseState({ error: er.response.data.message ? er.response.data.message : er.response.data });
        })
    }

    setValidated(true);
  };

    useEffect(() => {
        fetchUser(id)
        .then(data => {
            setUser(data);
            setIsAdminState(data.isAdmin);
        })
        .catch((er) => console.log(er.response.data.message ? er.response.data.message : er.response.data));
    }, [id])

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={1}>
          <Link to="/admin/users" className="btn btn-info my-3">
            Go Back
          </Link>
        </Col>
        <Col md={6}>
          <h1>Edit user</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                name="name"
                required
                type="text"
                defaultValue={user.name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                name="lastName"
                required
                type="text"
                defaultValue={user.lastName} 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                defaultValue={user.email}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check name="isAdmin" type="checkbox" label="Is admin" checked={isAdminState} onChange={(e) => setIsAdminState(e.target.checked)} />
            </Form.Group>

            <Button variant="primary" type="submit">
              UPDATE
            </Button>
            {updateUserResponseState.error}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditUserPageComponent;

