import React from "react";

function Footer(props) {
  return <footer className="footer">
    <div className="bottom"><div className="name">{props.title}</div> {/*<img alt="react" src={props.url} />*/} <div className="freepik">{props.children}</div></div>
  </footer>;
}

export default Footer;
