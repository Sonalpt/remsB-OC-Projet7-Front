import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <section>
      <h1>Page non trouvée :/</h1>
      <h3>
        Retour à la page d'accueil: <Link to="/"> Home Page</Link>
      </h3>
    </section>
  );
}

export default PageNotFound;
