import Header from "../components/Header";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <Header />
      <main className="container">
        <section className="not__found">
          <h2>404</h2>
          <h1>Oops! La página que solicitas parece que no existe</h1>
          <p>
            Te invitamos a seguir escuchando las mejores listas
            <Link to={"/"}> aquí</Link>
          </p>
        </section>
      </main>
    </>
  );
};

export default NotFound;
