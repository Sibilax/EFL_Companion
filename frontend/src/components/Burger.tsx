import React from 'react';

interface BurgerProps {
    isOpen: boolean; // Propiedad para el estado abierto/cerrado
    toggleMenu: () => void; // Propiedad para la función que alterna el menú
}

const Burger: React.FC<BurgerProps> = ({ isOpen, toggleMenu }) => {  //será un manejador de eventos, cuando es isopen se añade la clase open para dar estilos, class name dinamico
    return (
        <div className="burger-icon" onClick={toggleMenu}>
            <div className={`line ${isOpen ? "open" : ""}`}></div> 
            <div className={`line ${isOpen ? "open" : ""}`}></div>
            <div className={`line ${isOpen ? "open" : ""}`}></div> 
        </div>
    );
};

export default Burger;
