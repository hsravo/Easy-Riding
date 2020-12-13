import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Container, Button, Form, Alert, Col } from "react-bootstrap";
import ModelAutocompleteInput from "./ModelAutocompleteInput";
import Cookies from "js-cookie";

const BikeFormModal = ({ toggle, modal, setModal }) => {
  const [input, setInput] = useState({
    body_type: "",
    maximum_power: "",
    maximum_torque: "",
    zero_to_100: "",
    company_name: "",
  });
  const [spec, setSpec] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const handleInputChange = (event) => {
    setInput({
      ...input,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    console.log(input);
  }, [input]);

  useEffect(() => {
    setInput({
      ...input,
      ...spec,
    });
    console.log(spec);
  }, [spec]);

  const postBike = () => {
    console.log("fetchUser()");
    console.log(input);
    fetch("/api/bikes", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("EasyRiderUserToken")}`,
      },
      body: JSON.stringify({ bike: input }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        console.log(Cookies.get("token"));
        if (!response.errors) {
          setAlerts([{ variant: "success", message: "Moto Ajoutée" }]);
          setTimeout(() => {
            setModal(false);
            setAlerts([]);
          }, 3000);
          store.setCurrentUser(response);
        } else {
          console.log("fetch errors");
          setAlerts(
            response.errors.map((error) => {
              return { variant: "warning", message: error.detail };
            })
          );
          console.log(alerts);
        }
      });
  };

  return (
    <div>
      <Modal isOpen={true /*modal*/} toggle={toggle}>
        <ModalHeader toggle={toggle}>Ajouter ma moto</ModalHeader>
        {alerts.map((alert) => {
          <Alert variant={alert.variant}>{alert.message}</Alert>;
        })}
        <ModalBody>
          <Form>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                onChange={handleInputChange}
                name="description"
                placeholder="Bonne état, a surtout été entreposé dans un garage"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Kilométrage</Form.Label>
              <Form.Control
                onChange={handleInputChange}
                name="kilometrage"
                type="text-field"
                placeholder="20.500 km"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Modèle</Form.Label>
              <ModelAutocompleteInput setSpec={setSpec} setMasterInput={setInput} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Marque</Form.Label>
              <Form.Control
                onChange={handleInputChange}
                name="company_name"
                type="text"
                placeholder="Honda"
                value={input.company_name}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Catégorie</Form.Label>
              <Form.Control
                onChange={handleInputChange}
                name="body_type"
                type="text"
                placeholder="Roadster"
                value={input.body_type}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Puissance maximum</Form.Label>
              <Form.Control
                onChange={handleInputChange}
                name="maximum_power"
                type="text"
                placeholder="35 kW à 8 600 tr/min"
                value={input.maximum_power}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Torque maximum</Form.Label>
              <Form.Control
                onChange={handleInputChange}
                name="maximum_torque"
                type="text"
                placeholder="43 Nm à 6 500 tr/min"
                value={input.maximum_torque}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Zéro à 100</Form.Label>
              <Form.Control
                onChange={handleInputChange}
                name="zero_to_100"
                type="text"
                placeholder="5,4 seconds"
                value={input.zero_to_100}
              />
            </Form.Group>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={postBike}>
            Envoyer
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default BikeFormModal;
