import React from 'react';

import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import ReactFileReader from 'react-file-reader';

const FileSelector = ({ onLoadFile = () => {} }) => {
  return (
    <Container>
      <Form>
        <Form.Row>
          <Form.Group>
            <Form.Label>Select Source File</Form.Label>
            <ReactFileReader fileTypes={['.yaml']} base64 multipleFiles={false} handleFiles={onLoadFile}>
              <button className='btn'>...</button>
            </ReactFileReader>
          </Form.Group>
        </Form.Row>
      </Form>
    </Container>
  );
};

export default FileSelector;
