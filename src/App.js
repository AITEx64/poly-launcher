import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BootstrapSelect from 'react-bootstrap-select-dropdown';
import { Container, Button } from 'react-bootstrap';
import Navbar from './Navbar';
import { readTextFile, writeFile, BaseDirectory } from '@tauri-apps/api/fs';
import './App.css';
import { Component } from 'react';

class Home extends Component {
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
    console.log("mout");
    try {
      readTextFile("config.json", {dir: BaseDirectory.Data}).then(data => {
        this.setState({config: Object.assign(this.state.config, JSON.parse(data))});
      });
    } catch(ex) {
      console.error(ex);
      writeFile({path: "config.json", contents: JSON.stringify(this.state.config)}, {dir: BaseDirectory.Data});
    }
  }

  getOptions() {
    var o = this.state.config.servers.map(s => {return {
      "labelKey": s.ip,
      "value": s.name
    }});
    if(o.length > 0) {
      return <BootstrapSelect selectStyle="btn-dark-outline" options={o} onChange={(selectedOptions) => console.log(selectedOptions)} />;
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

const Settings = () => {
  return (
    <div>
    </div>
  );
};

class App extends Component {
  componentDidMount() {
    
  }

  render() {
    return (
      <Router>
        <Navbar />
        <Container className="m-3">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/settings" element={<Settings />} />

            <Route exact path="/" element={<Navigate to="/home" />} />
          </Routes>
        </Container>
      </Router>
    );
  }
}

export default App;