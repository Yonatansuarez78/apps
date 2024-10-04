import React, { useEffect, useRef } from 'react';

const MyPopoverComponent = () => {
    const buttonRef = useRef(null);

    useEffect(() => {
        // Verifica si Bootstrap está definido
        if (window.Bootstrap) {
            const popover = new window.Bootstrap.Popover(buttonRef.current);
            return () => {
                popover.dispose(); // Limpia el popover al desmontar
            };
        } else {
            console.error("Bootstrap no está cargado");
        }
    }, []);

    return (
        <div className="container mt-5">
            <button
                ref={buttonRef}
                type="button"
                className="btn btn-secondary"
                data-bs-toggle="popover"
                data-bs-content="¡Hola! Soy un popover."
                tabIndex="0" // Asegúrate de incluir tabindex para la accesibilidad
            >
                Mostrar Popover
            </button>
        </div>
    );
};

export default MyPopoverComponent;
