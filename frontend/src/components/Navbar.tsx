import './Navbar.css';
import logo from "../assets/logo.svg";
//import saved from "../assets/saved-openings.svg";
//import practice from "../assets/practice.svg";
//import settings from "../assets/settings.svg";

// type NavbarProps = {
// 	subSiteIndex: number;
// };

// const Navbar = ( {subSiteIndex}: NavbarProps ) => { 
const Navbar = () => { 
	// if(subSiteIndex == 0) {
	// 	console.log("HALO");
	// }
	return (
	<div className="navbar">
		<div className="navbar-logo-container">
			<a href="/" className="navbar-link">
				<img src={logo} alt="Website Logo" className="navbar-logo"/>
				<span>Chess openings</span>
			</a>
		</div>

		<div className="nav-container">
			<ul className="nav-list">
				<li><a className="navbar-link" href="/saved">Saved Openings</a></li>
				<li><a className="navbar-link" href="/practice">Pracitce</a></li>
				<li><a className="navbar-link" href="/settings">Settings</a></li>
			</ul>
		</div>
	</div>
)}
export default Navbar
