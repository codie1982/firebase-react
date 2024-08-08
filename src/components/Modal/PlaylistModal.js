import React,{useState} from 'react'
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { v4 as uuid } from "uuid";

import {Playlist} from "../../Model/Song.js"
import { uploadPlaylistImage } from '../../firebase/storage.js'
import { createPlaylist } from "../../firebase/firestore.js"
import { useAuth } from '../../context/authContext'
export default function PlaylistModal({
    show,
    handleClose,
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { currentUser } = useAuth()
    const handleSavePlaylist = async (e)=>{
        e.preventDefault()
        var playlist = new Playlist(name,description,currentUser.uid)
        await createPlaylist(playlist).then(()=>{
            handleClose()
        })
    }
 
  return (
    <Modal size="lg" show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Liste Oluşturun</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Row>
        <Form onSubmit={handleSavePlaylist}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Liste İsmi</Form.Label>
                <Form.Control type="text" placeholder="liste ismi"  onChange={(e) => setName(e.target.value)}/>
            </Form.Group>
            <Form.Group>
            <Form.Text
                value={description}
                onChange={(e) => setDescription(e.target.value)} // Olay nesnesinden doğru veriyi çıkarma
                placeholder="Playlist Description"
            />
            </Form.Group>
            <Button type="submit" variant="primary" onClick={handleSavePlaylist}>Listeyi Kayıt Et</Button>
        </Form>
      </Row>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>Kapat</Button>
      
    </Modal.Footer>
  </Modal>
  )
}
