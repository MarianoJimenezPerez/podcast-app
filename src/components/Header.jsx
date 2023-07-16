import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header__primary">
      <div className="container">
        <div className="logo">
          <Link to={"/"}>Podcaster</Link>
        </div>
        <div className="led__indicator"></div>
      </div>
    </header>
  );
};

export default Header;
