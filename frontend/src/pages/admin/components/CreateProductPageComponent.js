import {
  Row,
  Col,
  Container,
  Form,
  Button,
  CloseButton,
  Table,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProductPageComponent = ({ createProductApiRequest, uploadImagesApiRequest }) => {
  const [validated, setValidated] = useState(false);
  const [attributesTable, setAttributesTable] = useState([]);
  const [images, setImages] = useState(false);
  const [isCreating, setIsCreating] = useState("");
  const [createProductResponseState, setCreateProductResponseState] = useState({ message: "", error: "" });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;
    const formInputs = {
        name: form.name.value,
        description: form.description.value,
        count: form.count.value,
        price: form.price.value,
        category: form.category.value,
        attributesTable: attributesTable
    }
    if (event.currentTarget.checkValidity() === true) {
        createProductApiRequest(formInputs)
        .then(data => {
            if (images) {
                uploadImagesApiRequest(images, data.productId)
                .then(res => {})
                .catch((er) => setIsCreating(er.response.data.message ? er.response.data.message : er.response.data))
            }
            if (data.message === "product created") navigate("/admin/products");
        })
        .catch(er => {
            setCreateProductResponseState({ error: er.response.data.message ? er.response.data.message : er.response.data });
        })
    }

    setValidated(true);
  };

    const uploadHandler = (images) => {
        setImages(images);
    }

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={1}>
          <Link to="/admin/products" className="btn btn-info my-3">
            Go Back
          </Link>
        </Col>
        <Col md={6}>
          <h1>Create a new product</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" required type="text" />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                required
                as="textarea"
                rows={3}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCount">
              <Form.Label>Count in stock</Form.Label>
              <Form.Control name="count" required type="number" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price" required type="text" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>
                Category
                <CloseButton />(<small>remove selected</small>)
              </Form.Label>
              <Form.Select
                required
                name="category"
                aria-label="Default select example"
              >
                <option value="">Choose category</option>
                <option value="1">Laptops</option>
                <option value="2">TV</option>
                <option value="3">Games</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicNewCategory">
              <Form.Label>
                Or create a new category (e.g. Computers/Laptops/Intel){" "}
              </Form.Label>
              <Form.Control name="newCategory" type="text" />
            </Form.Group>

            <Row className="mt-5">
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicAttributes">
                  <Form.Label>Choose atrribute and set value</Form.Label>
                  <Form.Select
                    name="atrrKey"
                    aria-label="Default select example"
                  >
                    <option>Choose attribute</option>
                    <option value="red">color</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="formBasicAttributeValue"
                >
                  <Form.Label>Attribute value</Form.Label>
                  <Form.Select
                    name="atrrVal"
                    aria-label="Default select example"
                  >
                    <option>Choose attribute value</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Table hover>
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Value</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>attr key</td>
                    <td>attr value</td>
                    <td>
                      <CloseButton />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicNewAttribute">
                  <Form.Label>Create new attribute</Form.Label>
                  <Form.Control
                    disabled={false}
                    placeholder="first choose or create category"
                    name="newAttrValue"
                    type="text"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="formBasicNewAttributeValue"
                >
                  <Form.Label>Attribute value</Form.Label>
                  <Form.Control
                    disabled={false}
                    placeholder="first choose or create category"
                    required={true}
                    name="newAttrValue"
                    type="text"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="primary">
              After typing attribute key and value press enterr on one of the
              field
            </Alert>

            <Form.Group controlId="formFileMultiple" className="mb-3 mt-3">
              <Form.Label>Images</Form.Label>

              <Form.Control required type="file" multiple onChange={(e) => uploadHandler(e.target.files)} />
              {isCreating}
            </Form.Group>
            <Button variant="primary" type="submit">
              Create
            </Button>
            {createProductResponseState.error ?? ""}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProductPageComponent;

