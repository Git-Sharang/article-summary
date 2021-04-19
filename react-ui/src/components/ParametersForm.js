import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const ParametersForm = (props) => {
  const [state, setState] = useState({
    summarizeURL: "",
    numSentences: 3,
  });

  const handleOnSubmit = (event) => {
    event.preventDefault();
    props.history.push({
      pathname: "/results",
      state,
    });
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <div>
      <h1 style={{textAlign: "center"}}>Summarize your Article</h1>
      <Form className="register-form" onSubmit={handleOnSubmit}>
        <Form.Group controlId="numSentences">
          <Form.Label>Number of Sentences</Form.Label>
          <Form.Control
            type="number"
            step="any"
            min="1"
            placeholder="Enter Number of Sentences "
            name="numSentences"
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="summarizeURL">
          <Form.Label>Enter the website's URL</Form.Label>
          <Form.Control
            type="url"
            placeholder="Enter URL"
            name="summarizeURL"
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Generate
        </Button>
        <br />
      </Form>
    </div>
  );
};
export default ParametersForm;
