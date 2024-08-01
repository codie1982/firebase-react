import React, { useState, useEffect } from 'react';

import { Form, Row, Col, Container, Button, Table ,Modal} from 'react-bootstrap';

import { Navigate } from "react-router-dom"
import { useAuth } from '../context/authContext'
import { getSongList } from "../firebase/firestore.js"
import { uploadSong,getUrl } from '../firebase/storage.js';
function Home(params) {
  const {currentUser, userLoggedIn } = useAuth()
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const [songList, setSongList] = useState([]);
  const [downloadURL, setDownloadURL] = useState('');
  const [error, setError] = useState("")
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileChange  = (e)=>{
    setFiles(e.target.files)
  }
  const uploadAudio = async ()=> {
    for(let i =0;i<files.length;i++){
      .then((url) => {
        setDownloadURL(url);
        console.log('File available at', url);
      })
      .catch((error) => {
        setError(error);
        console.error('Upload failed', error);
      });
    }
  }

  useEffect(() => {
    if (currentUser){
      getSongList(currentUser.uid)
      .then((querySnapshot) => {
        const songs = [];
        querySnapshot.forEach((doc) => {
          songs.push({ id: doc.id, ...doc.data() });
        });
        setSongList(songs);
      }).catch((error) => {
        console.error("Error fetching song list: ", error);
      });
    }
  }, [currentUser])
  
useEffect(() => {
  console.log("files",files)
}, [files])

useEffect(() => {
  console.log("progress",progress)
}, [progress])
useEffect(() => {
  console.log("downloadURL",downloadURL)

}, [downloadURL])



  return (
    <>
      {!userLoggedIn ?
        (<Navigate to={'/login'} replace={true} />)
        :
        <>
          <Container>
            <Row><Col><div className='text-2xl font-bold pt-14'>Merhaba {currentUser.displayName ? currentUser.displayName : currentUser.email}, Listeni düzenlemeye başlayabilirsin.</div></Col></Row>
            <Row><Col><Button variant='primary'  onClick={handleShow}>Şarkı Ekle</Button></Col></Row>
            <Row>
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Şanatçı</th>
                      <th>URL</th>
                      <th>Eylem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songList.length > 0 ? songList.map((song, index)=>
                     (
                      <tr key={song.id}>
                        <td>{index + 1}</td>
                        <td>{song.artist}</td>
                        <td>{song.streamurl}</td>
                        <td>
                        <Button variant="danger" >Kaldır</Button>
                        </td>
                      </tr>
                    )
                    ):
                    (
                      <tr>
                        <td colSpan="4">No songs found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>

            <Modal size="lg" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Dosya Seçin</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Row>
                <Col> 
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Control type="file" multiple onChange={handleFileChange} />
                </Form.Group>
                </Col>
                <Col><Button variant="primary" onClick={uploadAudio}>Ekle</Button></Col>
               
              </Row>
              
              <Row>
                <Col>
                <Table striped bordered hover>
                  <thead>
                        <tr>
                          <th>#</th>
                          <th>Şarkı İsmi</th>
                          <th>Eylem</th>
                        </tr>
                      </thead>
                      <tbody>
                     {/*    {files.length > 0 ?
                        files.map((it)=>{
                          return (
                            <tr>
                            <td>{""}</td>
                            <td>{it.name}</td>
                            <td>  <Button variant="danger" >Kaldır</Button></td>
                            </tr>
                          )
                        })
                      :
                      <tr>
                      <td></td>
                      <td>{"Şeçili şarkı bulunmamaktadır."}</td>
                      <td></td>
                    </tr> } */}
                          
                      </tbody>
                </Table>
                  
                </Col>
              </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Kapat
                </Button>
                <Button variant="primary" onClick={handleClose}>
                  Kayıt Et
                </Button>
              </Modal.Footer>
            </Modal>
          </Container>

        </>

      }
    </>
  )
}

export default Home