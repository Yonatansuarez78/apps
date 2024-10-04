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
    const precioUnitario = parseFloat(factura.precioUnitario).toFixed(2);
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
    const precioUnitario = parseFloat(factura.precioUnitario).toFixed(2);
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




// // Función para mostrar factura personalizada
// export const mostrarFactura = (factura, tipoNegocio) => {
//     const doc = new jsPDF();

//     // Configurar el contenido del PDF basado en el tipo de negocio
//     let nombreNegocio, nit, direccion, telefono;

//     if (tipoNegocio === "Panadería") {
//         nombreNegocio = "PatrosPan";
//         nit = "890904713 - Responsable del IVA";
//         direccion = "Carrera 11 # 10 62, Piendamo, Tunia (Cauca)";
//         telefono = "3507700552";
//     } else if (tipoNegocio === "Pastelería") {
//         nombreNegocio = "Dulce Pastelería";
//         nit = "900123456 - Responsable del IVA";
//         direccion = "Calle 15 # 8 45, Popayán (Cauca)";
//         telefono = "3111234567";
//     }

//     // Título y encabezado
//     doc.setFontSize(16);
//     doc.setFont("bold");
//     doc.text(nombreNegocio, 20, 15);

//     doc.setFont("normal");
//     doc.setFontSize(10);
//     doc.text(`Nit: ${nit}`, 20, 25);
//     doc.text(direccion, 20, 30);
//     doc.text(`Teléfono: ${telefono}`, 20, 35);

//     doc.text("Factura de venta POS: MTTO 234567", 20, 45);
//     const fechaHora = new Date(factura.fecha).toLocaleString();
//     doc.text(`Fecha: ${fechaHora}`, 20, 50);

//     doc.text("Señor(a): CONSUMIDOR FINAL", 20, 55);
//     doc.text("C.C / NIT: 222222222222", 20, 60);
//     doc.text(`Tel: ${telefono}`, 20, 65);

//     // Detalles de la factura
//     const lineY = 80;
//     doc.line(20, lineY - 5, 100, lineY - 5); // Línea arriba
//     doc.text("Cant. Descripción   V unitario    Total", 20, lineY);
//     doc.line(20, lineY + 5, 100, lineY + 5); // Línea abajo

//     const cantidad = factura.cantidad;
//     const descripcion = factura.nombre;
//     const precioUnitario = parseFloat(factura.precioUnitario).toFixed(2);
//     const precioTotal = factura.precioTotal;

//     doc.text(`${cantidad}        ${descripcion}          $${precioUnitario}          $${precioTotal}`, 20, lineY + 10);

//     // Totales
//     doc.text(`Total antes de IVA:                                        ${precioTotal}`, 20, 110);
//     doc.text("Total descuento:                                                     0", 20, 115);
//     doc.text("Total IVA:                                                              0", 20, 120);
//     doc.text(`Total:                                                              ${precioTotal}`, 20, 125);

//     doc.text("FACTURA SISTEMA POS", 20, 140);
//     doc.text("*** GRACIAS POR SU COMPRA ***", 20, 145);

//     // Generar el PDF
//     doc.save(`${tipoNegocio}_factura.pdf`);

//     // Imprimir el PDF
//     doc.autoPrint();  // Prepara el documento para impresión
//     window.open(doc.output('bloburl')); // Abre el PDF en una nueva ventana para imprimir
// };
