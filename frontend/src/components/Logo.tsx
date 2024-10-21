import logo from "../assets/logo.png";

interface LogoProps {
  size: number; //  cambiar a 'string' si necesito tamaños en píxeles
}

const Logo: React.FC<LogoProps> = ({ size }) => {
  return (
    <div className="Logo">
      <img src={logo} alt="Logo" style={{ width: size, height: "auto" }} />
    </div>
  );
};

export default Logo;
