import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MdSave, MdDelete, MdFileCopy } from 'react-icons/all';
import BootstrapSelect from 'react-bootstrap-select-dropdown';
import { Container, Button, Accordion, Form, FloatingLabel } from 'react-bootstrap';
import Navbar from './Navbar';
import { readTextFile, writeFile, BaseDirectory } from '@tauri-apps/api/fs';
import './App.css';
import { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = props.state;
  }

  getOptions() {
    var o = this.state.config.servers.map(s => {return {
      "labelKey": s.ip,
      "value": s.name
    }});
    if(o.length > 0) {
      return <BootstrapSelect selectStyle="btn-dark-outline" options={o} />;
    }
    return <span className="text-muted" disabled>No servers.</span>;
  }

  render() {
    return (
      <div>
        <div className="bottom">
          <div className="float-end">
            {this.getOptions()}
            <Button variant="primary" className="px-4 center ms-4">Launch</Button>
          </div>
        </div>
      </div>
    );
  }
}

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = props.state;
  }

  render() {
    return (
      <div>
        <h1>Servers</h1>
        <Accordion>
          {this.state.config.servers.map(s => (
              <Accordion.Item eventKey={s.ip}>
                <Accordion.Header>{s.name}</Accordion.Header>
                <Accordion.Body>
                  <FloatingLabel label="Server Name" className="mb-3">
                    <Form.Control type="text" value={s.name} />
                  </FloatingLabel>
                  <FloatingLabel label="IP Address" className="mb-3">
                    <Form.Control type="text" value={s.ip} />
                  </FloatingLabel>
                  <FloatingLabel label="Launch Arguments" className="mb-3">
                    <Form.Control type="text" value={s.customargs} />
                  </FloatingLabel>
                  <div className="d-inline-block me-auto">
                    <Button variant="info"><MdFileCopy /> Copy</Button>&nbsp;
                  </div>
                  <div className="d-inline-block float-end">
                    <Button variant="danger"><MdDelete /> Delete</Button>&nbsp;
                    <Button variant="success"><MdSave /> Save</Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
          ))}
          </Accordion>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {
        "version": 1,
        "servers": []
      }
    }
  }

  componentDidMount() {
    document.getElementById("balls").click();
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
    try {
      readTextFile("config.json", {dir: BaseDirectory.Data}).then(data => {
        this.setState({config: Object.assign(this.state.config, JSON.parse(data))});
      });
    } catch(ex) {
      console.error(ex);
      writeFile({path: "config.json", contents: JSON.stringify(this.state.config)}, {dir: BaseDirectory.Data});
    }
  }

  render() {
    return (
      <Router>
        <Navbar />
        <Container className="m-0 p-3" style={{maxHeight: "100%", width: "100%", maxWidth: "100%", overflowY: "auto"}}>
          <Routes>
            <Route path="/home" element={<Home state={this.state} />} />
            <Route path="/settings" element={<Settings state={this.state} />} />

            <Route exact path="/" element={<Navigate to="/home" />} />
          </Routes>
        </Container>
      </Router>
    );
  }
}

export default App;