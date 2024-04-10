'use client'
import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Container } from 'react-bootstrap';
import ArticuloServer from './ArticuloServer';

export default function ArticuloClient() {
    const [articulos, setArticulos] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [cuerpo, setCuerpo] = useState('');
    const [autor, setAutor] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    async function fetchData() {
        try {
            const data = await ArticuloServer.getArticulos();
            setArticulos(data);
        } catch (error) {
            console.error('Error al obtener los artículos:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (event) => {
        event.preventDefault();
        try {
            const newArticulo = await ArticuloServer.createArticulo(titulo, cuerpo, autor);
            setArticulos([...articulos, newArticulo]);
            // Limpiar los campos después de la creación
            setTitulo('');
            setCuerpo('');
            setAutor('');
        } catch (error) {
            console.error('Error al crear el artículo:', error);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        if (isEditing && editingId) {
            try {
                const updatedArticulo = await ArticuloServer.updateArticulo(editingId, titulo, cuerpo, autor);
                if (updatedArticulo && updatedArticulo.id) {
                    setArticulos(articulos.map(art => art.id === editingId ? updatedArticulo : art));
                }
                // Restablecer el formulario y salir del modo de edición
                setTitulo('');
                setCuerpo('');
                setAutor('');
                setIsEditing(false);
                setEditingId(null);
            } catch (error) {
                console.error('Error al actualizar el artículo:', error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await ArticuloServer.deleteArticulo(id);
            setArticulos(articulos.filter(art => art.id !== id));
        } catch (error) {
            console.error('Error al eliminar el artículo:', error);
        }
    };

    const startEdit = (articulo) => {
        setEditingId(articulo.id);
        setTitulo(articulo.titulo);
        setCuerpo(articulo.cuerpo);
        setAutor(articulo.autor);
        setIsEditing(true);
    };

    return (
        <Container fluid>
            <Form onSubmit={isEditing ? handleUpdate : handleCreate}>
                <Form.Group className="mb-3" controlId="formTitulo">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingrese el título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCuerpo">
                    <Form.Label>Cuerpo</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Ingrese el cuerpo"
                        value={cuerpo}
                        onChange={(e) => setCuerpo(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAutor">
                    <Form.Label>Autor</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingrese el autor"
                        value={autor}
                        onChange={(e) => setAutor(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    {isEditing ? 'Actualizar' : 'Crear'}
                </Button>
            </Form>

            <Table responsive>
                <thead>
                    <tr>
                        <th>Numero</th>
                        <th>Título</th>
                        <th>Cuerpo</th>
                        <th>Autor</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {articulos.map((articulo) => (
                        <tr key={articulo.id}>
                            <td>{articulo.id}</td>
                            <td>{articulo.titulo}</td>
                            <td>{articulo.cuerpo}</td>
                            <td>{articulo.autor}</td>
                            <td>
                                <Button variant="primary" onClick={() => startEdit(articulo)}>
                                    Editar
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(articulo.id)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}