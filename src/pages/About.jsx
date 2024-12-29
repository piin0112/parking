import Icons from "../assets/images/icons";

function About() {
  return (
    <div className="about">
      <div className="about__container">
        <Icons.undrawParking className="about__undrawParking" />
        <div className="about__text">智慧停車是一款</div>
        <div className="about__text">解決停車場資訊不透明的網站。</div>
      </div>
    </div>
  );
}

export default About;
