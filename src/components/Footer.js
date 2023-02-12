import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <p>
        1. Battle stats estimating algorithm is from <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16065473">here</a>. I believe this is also used by TornTools.
      </p>
      <p>2. Official Torn API updates data every 15-30 seconds, so data shown here has some delay from the actual status.</p>
      <p>3. Spy data is fetched from a seperate manually eddited Google Sheet.</p>
      <p>TornRadio by tornradio [2851045]</p>
    </footer>
  );
};

export default Footer;
