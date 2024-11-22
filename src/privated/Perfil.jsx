import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { app } from '../firebaseConfig';
import Sidebars from './Sidebars';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

// Cloudinary configuration
const preset_name = "apps_patrospan";
const cloud_name = "doyoqpbuo";

function Perfil() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState('');
    const [newName, setNewName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState(null); // Estado para la vista previa de la imagen
    const [error, setError] = useState('');

    useEffect(() => {
        const auth = getAuth(app);
        const user = auth.currentUser;

        if (user) {
            setUserData({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: user.providerData[0]?.providerId || 'Desconocido',
            });
        } else {
            setUserData(null);
        }
    }, []);

    // Actualizar nombre en Firebase
    const handleNameChange = async () => {
        const auth = getAuth(app);
        const user = auth.currentUser;

        if (user && newName) {
            try {
                await updateProfile(user, {
                    displayName: newName
                });
                setUserData({ ...userData, displayName: newName });
                setNewName('');
            } catch (error) {
                console.error('Error updating name:', error);
            }
        }
    };

    // Subir la imagen a Cloudinary
    const uploadImage = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', preset_name);

        // Establecer la vista previa de la imagen
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result); // Esto actualizará la vista previa
        };
        reader.readAsDataURL(files[0]);
        setLoading(true);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data
            });
            const file = await response.json();
            setImage(file.secure_url);
            const auth = getAuth(app);
            const user = auth.currentUser;

            // Actualizar la imagen en Firebase
            if (user) {
                await updateProfile(user, {
                    photoURL: file.secure_url
                });
                setUserData({ ...userData, photoURL: file.secure_url });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error uploading image:', error);
            setLoading(false);
            setError('Error al subir la imagen. Intenta nuevamente.');
        }
    };

    // Mostrar el modal
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            <div style={{ width: '280px' }}>
                <Sidebars />
            </div>
            <div className="flex-grow-1 p-4">
                {userData ? (
                    <div className="card shadow-lg p-3 mb-5 bg-white rounded">
                        <div className=" bg-primary text-white text-center">
                            <h3>Perfil de Administrador</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4 text-center">
                                    <img
                                        src={userData.photoURL || 'https://via.placeholder.com/150'}
                                        alt="User Profile"
                                        width="150"
                                        height="150"
                                        className="rounded-circle mb-3 shadow"/>
                                </div>
                                <div className="col-md-8">
                                    <p><strong>Nombre:</strong> {userData.displayName || 'No disponible'}</p>
                                    <p><strong>Correo electrónico:</strong> {userData.email}</p>
                                    <p><strong>ID del usuario:</strong> {userData.uid}</p>
                                    <p><strong>Proveedor de inicio de sesión:</strong> {userData.providerId}</p>
                                    <button className="btn btn-warning" onClick={handleShowModal}>
                                        Actualizar Datos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-info" role="alert">
                        Cargando datos del perfil...
                    </div>
                )}
            </div>

            {/* Modal para actualizar datos */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar Perfil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Formulario para actualizar el nombre */}
                    <div className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Nuevo nombre"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div class="input-group mb-3">
                        <input type="file" class="form-control" id="inputGroupFile02" onChange={uploadImage}></input>
                    </div>

                    {/* Vista previa de la imagen seleccionada */}
                    {preview && (
                        <div className="mt-3">
                            <h6>Vista previa</h6>
                            <img
                                src={preview}
                                alt="Vista previa"
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: '10px',
                                    border: '2px solid #ddd'
                                }}
                            />
                        </div>
                    )}

                    {loading && <p className="text-center text-primary">Cargando...</p>}
                    {error && <Alert variant="danger">{error}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={() => { handleNameChange(); handleCloseModal(); }}>
                        Actualizar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Perfil;
