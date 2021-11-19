import { MdGamepad, MdSettings, MdOutlineMinimize, VscChromeClose, MdOutlineManageAccounts } from 'react-icons/all';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { appWindow } from '@tauri-apps/api/window';

export default function Navigation() {
  return (
    <>
        <Navbar data-tauri-drag-region bg="dark" variant="dark" className="titlebar" id="titlebar">
            <Container data-tauri-drag-region className="ms-0 me-0 p-0 ps-4 pe-2" style={{maxWidth: "100%", width: "100vw"}}>
                <Navbar.Brand data-tauri-drag-region>
                    <img src="https://abs-0.twimg.com/emoji/v2/svg/1f338.svg" alt="my nuts itch" height="20" style={{marginTop: "-4px"}} /> Poly
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#/home" id="balls">
                        <MdGamepad /> Home</Nav.Link>
                    <Nav.Link href="#/settings">
                        <MdSettings /> Settings</Nav.Link>
                </Nav>
                <Nav className="ms-auto">
                    <img src="https://cdn.discordapp.com/avatars/513654483495026699/d3b86b2a772a0ed963306cf55c4adaba.png" height="24" style={{marginTop: "8px", borderRadius: "500px"}} />&nbsp;
                    <NavDropdown id="bals" title="AITEx64&nbsp;&nbsp;" align="end">
                        <NavDropdown.Item><MdOutlineManageAccounts /> Show Profile</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                    <Nav.Link label="balls" onClick={()=> appWindow.minimize()}>
                        <MdOutlineMinimize />
                    </Nav.Link>
                    <Nav.Link label="balls" onClick={()=> appWindow.close()}>
                        <VscChromeClose />
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
        <div className="bar" />
    </>
  );
};