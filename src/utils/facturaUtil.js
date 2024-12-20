import { jsPDF } from "jspdf";

export const mostrarFactura = (factura) => {
    const doc = new jsPDF();

    // Configurar el contenido del PDF
    doc.setFontSize(16);
    doc.setFont("bold");
    doc.text("PatrosPan", 20, 15);

    doc.setFont("normal");
    doc.setFontSize(10);
    doc.text("Nit: 890904713 - Responsable del IVA", 20, 25);
    doc.text("Carrera 11 # 10 62", 20, 30);
    doc.text("Teléfono: 3507700552 - Piendamo, Tunia (Cauca)", 20, 35);

    doc.text("Factura de venta POS: MTTO 234567", 20, 45);
    const fechaHora = new Date(factura.fecha).toLocaleString();
    doc.text(`Fecha: ${fechaHora}`, 20, 50);

    doc.text("Señor(a): CONSUMIDOR FINAL", 20, 55);
    doc.text("C.C / NIT: 222222222222", 20, 60);
    doc.text("Tel: 3507700552", 20, 65);

    const lineY = 80; // Y-coordinate for the text
    doc.line(20, lineY - 5, 100, lineY - 5); // Línea arriba
    doc.text("Cant. Descripción   V unitario    Total", 20, lineY);
    doc.line(20, lineY + 5, 100, lineY + 5); // Línea abajo

    // Detalles de la factura
    const cantidad = factura.cantidad; // Asumiendo que `cantidad` es un número
    const descripcion = factura.nombre; // Nombre del producto
    const precioUnitario = factura.precioUnitario;
    const precioTotal = factura.precioTotal;

    doc.text(`${cantidad}        ${descripcion}          $${precioUnitario}          $${precioTotal}`, 20, lineY + 10);


    doc.text(`Total antes de IVA:                                        ${precioTotal}`, 20, 110);
    doc.text("Total descuento:                                                     0", 20, 115);
    doc.text("Total IVA:                                                              0", 20, 120);
    doc.text(`Total:                                                              ${precioTotal}`, 20, 125);


    doc.text("FACTURA SISTEMA POS", 20, 140);
    doc.text("*** GRACIAS POR SU COMPRA ***", 20, 145);

    // Generar el PDF
    doc.save('factura.pdf');

    // Imprimir el PDF
    doc.autoPrint();  // Prepara el documento para impresión
    window.open(doc.output('bloburl')); // Abre el PDF en una nueva ventana para imprimir
};




export const mostrarFacturaPasteleria = (factura) => {
    const doc = new jsPDF();

    // Configurar el contenido del PDF
    doc.setFontSize(16);
    doc.setFont("bold");
    doc.text("PatrosPan", 20, 15);

    doc.setFont("normal");
    doc.setFontSize(10);
    doc.text("Nit: 890904713 - Responsable del IVA", 20, 25);
    doc.text("Carrera 11 # 10 62", 20, 30);
    doc.text("Teléfono: 3507700552 - Piendamo, Tunia (Cauca)", 20, 35);

    doc.text("Factura de venta POS: MTTO 234567", 20, 45);
    const fechaHora = new Date(factura.fecha).toLocaleString();
    doc.text(`Fecha: ${fechaHora}`, 20, 50);

    doc.text("Señor(a): CONSUMIDOR FINAL", 20, 55);
    doc.text("C.C / NIT: 222222222222", 20, 60);
    doc.text("Tel: 3507700552", 20, 65);

    const lineY = 80; // Y-coordinate for the text
    doc.line(20, lineY - 5, 100, lineY - 5); // Línea arriba
    doc.text("Cant. Descripción   V unitario    Total", 20, lineY);
    doc.line(20, lineY + 5, 100, lineY + 5); // Línea abajo

    // Detalles de la factura
    const cantidad = factura.cantidad; // Asumiendo que `cantidad` es un número
    const descripcion = factura.nombre; // Nombre del producto
    const precioUnitario = factura.precioUnitario;
    const precioTotal = factura.precioTotal;

    doc.text(`${cantidad}        ${descripcion}          $${precioUnitario}          $${precioTotal}`, 20, lineY + 10);


    doc.text(`Total antes de IVA:                                        ${precioTotal}`, 20, 110);
    doc.text("Total descuento:                                                     0", 20, 115);
    doc.text("Total IVA:                                                              0", 20, 120);
    doc.text(`Total:                                                              ${precioTotal}`, 20, 125);


    doc.text("FACTURA SISTEMA POS", 20, 140);
    doc.text("*** GRACIAS POR SU COMPRA ***", 20, 145);

    // Generar el PDF
    doc.save('factura.pdf');

    // Imprimir el PDF
    doc.autoPrint();  // Prepara el documento para impresión
    window.open(doc.output('bloburl')); // Abre el PDF en una nueva ventana para imprimir
};




export const mostrarFacturaPedido = (factura) => {
    const doc = new jsPDF();

    // Configurar el contenido del PDF
    doc.setFontSize(16);
    doc.setFont("bold");
    doc.text("PatrosPan", 20, 15);

    doc.setFont("normal");
    doc.setFontSize(10);
    doc.text("Nit: 890904713 - Responsable del IVA", 20, 25);
    doc.text("Carrera 11 # 10 62", 20, 30);
    doc.text("Teléfono: 3507700552 - Piendamo, Tunia (Cauca)", 20, 35);

    doc.text("Factura de venta POS: MTTO 234567", 20, 45);
    const fechaHora = new Date(factura.fecha).toLocaleString();
    doc.text(`Fecha: ${fechaHora}`, 20, 50);

    doc.text("Señor(a): CONSUMIDOR FINAL", 20, 55);
    doc.text("C.C / NIT: 222222222222", 20, 60);
    doc.text("Tel: 3507700552", 20, 65);

    const lineY = 80; // Y-coordinate for the text
    doc.line(20, lineY - 5, 100, lineY - 5); // Línea arriba
    doc.text("Cant. Descripción   V unitario    Total", 20, lineY);
    doc.line(20, lineY + 5, 100, lineY + 5); // Línea abajo

    // // Variables para calcular el total
    // let total = 0;

    // Iterar sobre el carrito para mostrar los productos
    factura.carrito.forEach((producto, index) => {
        const yPos = lineY + 15 + index * 10; // Ajustar la posición Y para cada producto
        const cantidad = producto.cantidad;
        const descripcion = producto.nombre;
        const precioUnitario = producto.precioUnitario;
        const precioTotal = producto.precioTotal;

        doc.text(`${cantidad}        ${descripcion}          $${precioUnitario}          $${precioTotal}`, 20, yPos);
        // total = precioTotal; // Sumar al total
        // console.log(factura)
    });

    doc.text(`Total antes de IVA:                                        $${factura.total}`, 20, 110);
    doc.text("Total descuento:                                                     0", 20, 115);
    doc.text("Total IVA:                                                              0", 20, 120);
    doc.text(`Total:                                                              $${factura.total}`, 20, 125);

    doc.text("FACTURA SISTEMA POS", 20, 140);
    doc.text("*** GRACIAS POR SU COMPRA ***", 20, 145);

    // Generar el PDF
    doc.save('factura.pdf');

    // Imprimir el PDF
    doc.autoPrint();  // Prepara el documento para impresión
    window.open(doc.output('bloburl')); // Abre el PDF en una nueva ventana para imprimir
};




export const mostrarFacturaAlmuerzos = (factura) => {
    const doc = new jsPDF();
    console.log(factura);

    // Configurar el contenido del PDF
    doc.setFontSize(16);
    doc.setFont("bold");
    doc.text("PatrosPan", 20, 15);

    doc.setFont("normal");
    doc.setFontSize(10);
    doc.text("Nit: 890904713 - Responsable del IVA", 20, 25);
    doc.text("Carrera 11 # 10 62", 20, 30);
    doc.text("Teléfono: 3507700552 - Piendamo, Tunia (Cauca)", 20, 35);

    doc.text("Factura de venta POS: MTTO 234567", 20, 45);
    const fechaHora = new Date(factura.fecha.seconds * 1000).toLocaleString();
    doc.text(`Fecha: ${fechaHora}`, 20, 50);

    doc.text("Señor(a): CONSUMIDOR FINAL", 20, 55);
    doc.text("C.C / NIT: 222222222222", 20, 60);
    doc.text("Tel: 3507700552", 20, 65);

    let lineY = 80; // Y-coordinate for the header
    doc.line(20, lineY - 5, 180, lineY - 5); // Línea arriba
    doc.text("Cant.    Descripción             V unitario          Total", 20, lineY);
    doc.line(20, lineY + 5, 180, lineY + 5); // Línea abajo

    lineY += 15; // Espacio para la primera línea de productos

    // Recorrer cada almuerzo y agregar sus datos en el PDF
    factura.almuerzos.forEach((almuerzo, index) => {
        const cantidad = 1; // Supongo que es 1 para cada almuerzo, puedes ajustar si es distinto
        const descripcion = `${index + 1}: ${almuerzo.carne}, ${almuerzo.sopa}, ${almuerzo.otros}`;
        const precioUnitario = almuerzo.precio;
        const precioTotal = almuerzo.precio;

        doc.text(`${cantidad}             ${descripcion}          $${precioUnitario}          $${precioTotal}`, 20, lineY);
        lineY += 10; // Ajusta la coordenada Y para la siguiente línea
    });

    // Mostrar el total de la factura
    lineY += 10; // Espacio para el total
    doc.line(20, lineY - 5, 180, lineY - 5); // Línea arriba del total
    doc.text(`Total antes de IVA:                                        $${factura.total}`, 20, lineY);
    doc.text("Total descuento:                                                     0", 20, lineY + 5);
    doc.text("Total IVA:                                                              0", 20, lineY + 10);
    doc.text(`Total:                                                              $${factura.total}`, 20, lineY + 15);

    doc.text("FACTURA SISTEMA POS", 20, lineY + 30);
    doc.text("*** GRACIAS POR SU COMPRA ***", 20, lineY + 35);

    // Generar el PDF
    doc.save('factura.pdf');

    // Imprimir el PDF
    doc.autoPrint();  // Prepara el documento para impresión
    window.open(doc.output('bloburl')); // Abre el PDF en una nueva ventana para imprimir
};

