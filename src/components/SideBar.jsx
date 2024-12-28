import { Link } from "react-router-dom";
import Icons from "../assets/images/icons";
function SideBar() {
  return (
    <nav className="sidebar">
      <ul>
        <li className="link-logo-1">
          智慧停車
        </li>
        <li>
          <Link to="/">
            <div className="link-container">
              <Icons.SVGParking />
              <span>停車場</span>
            </div>
          </Link>
        </li>
        <li className="link-logo-2">
          智慧停車
        </li>
        <li>
          <Link to="/about">
            <div className="link-container">
              <Icons.SVGAccount />
              <span>關於</span>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}


export default SideBar;
