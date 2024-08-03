import React, { useState, useEffect } from 'react';

import { Form, Row, Col, Container, Button, Table ,Modal,Pagination} from 'react-bootstrap';

import { useParams, useNavigate,Navigate } from "react-router-dom"
import { useAuth } from '../context/authContext'
import { getSongList,addSong } from "../firebase/firestore.js"
import { uploadSong,getUrl } from '../firebase/storage.js';
import Song from "../Model/Song.js"
import { timestampToDate } from '../util/Time.js'; 


function Home(params) {
  const { page } = useParams();
  const {currentUser, userLoggedIn } = useAuth()
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const navigate = useNavigate();
  const [files, setFiles] = useState([])

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [songList, setSongList] = useState([]);
  const [uploadFiles, setUploadfiles] = useState([])
  const [error, setError] = useState("")


  const [pageNumber, setPageNumber] = useState()
 
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileChange  = (e)=>{
    setFiles(e.target.files)
  }
  const uploadAudio = async ()=> {
    for(let i =0;i<files.length;i++){
      uploadSong(files[i],currentUser.uid,i,(index , progress) => setUploadFilesState(index,progress))
      .then((data) => {
        setDownloadURL(data.url);
        for(let i=0; i < uploadFiles.length;i++){
          if(i == data.index){
            uploadFiles[i].url = data.url
          }
        }
        setUploadfiles(uploadFiles)
      })
      .catch((error) => {
        setError(error);
        console.error('Upload failed', error);
      });
    }
  }

  useEffect(() => {
    console.log("currentPage",currentPage)
    if (currentUser){
      fetchSongs()
    }
  }, [currentUser,currentPage])
  
useEffect(() => {
  var _uploadFiles = []
  for (let index = 0; index < files.length; index++) {
    const element = files[index];
    _uploadFiles.push(
      {
      id:index,
      name:element.name,
      size:element.size / 1024/1024,
      type:element.type,
      progress:0,
      url:""})
  }
  setUploadfiles(_uploadFiles)
}, [files])


function setUploadFilesState(index,progress){
  setProgress(progress)

  for(let i=0; i < uploadFiles.length;i++){
    if(i == index){
      uploadFiles[i].progress = progress
    }
  }
  setUploadfiles(uploadFiles)
}

useEffect(() => {
 if(!show){
  fetchSongs()
 }
}, [show])

const handleSaveSongs = async () => {
   var songs =  uploadFiles.map((data)=>{
      if(data.progress==100){
        return (new Song(data.name,data.url,currentUser.uid,data.size,data.type,"","",""))
      }
    })
  for(let i=0;i<songs.length;i++)
    await addSong(songs[i])
  
  setShow(false)
};

function fetchSongs(){
  setLoading(true);
  getSongList(currentUser.uid)
      .then((querySnapshot) => {
        const songs = [];
        querySnapshot.forEach((doc) => {
          songs.push({ id: doc.id, ...doc.data() });
        });
        setSongList(songs);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        console.error("Error fetching song list: ", error);
      });
}

  const setPaginationNavigate = (pageNumber)=>{
    console.log("setPaginationNavigate",pageNumber)
    if(pageNumber<=1) pageNumber = 1 
    navigate(`/home/${pageNumber}`);
    setCurrentPage(pageNumber)
  }
  return (
    <>
      {!userLoggedIn ?
        (<Navigate to={'/login'} replace={true} />)
        :
        <>
          <Container>
            <Row><Col><div className='text-2xl font-bold pt-14'>Merhaba {currentUser.displayName ? currentUser.displayName : currentUser.email}, Listeni düzenlemeye başlayabilirsin.</div></Col></Row>
            <Row><Col><Button variant='primary'  onClick={handleShow}>Şarkı Ekle</Button></Col></Row>
            {songList.length >0 ?
            <Row>
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>isim</th>
                      <th>Sanatçi</th>
                      <th>Tür</th>
                      <th>Eklenme Zamanı</th>
                      <th>Eylem</th>
                    </tr>
                  </thead>
                  <tbody>

                    {songList.length > 0 ? songList.map((data, index)=>
                     (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data.name}</td>
                        <td>{data.performer}</td>
                        <td>{data.type}</td>
                        <td>{timestampToDate(data.create_date)}</td>
                        <td>
                          {data.progress == 0 || data.progress == 100 ? <><Button variant="danger" >Kaldır</Button></> : <><Button disabled variant="danger" >Kaldır</Button></>}
                        </td>
                      </tr>
                    )):
                    (
                      <tr>
                        <td colSpan="4">No songs found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                    <div>
                      <Row>
                        <Col>
                          <Pagination>
                          <Pagination.Item key={"onceki"}   onClick={()=>setPaginationNavigate(currentPage - 1)}>
                            {"Önceki"}
                          </Pagination.Item>
                            {[1,2,3].map((number)=>{
                          return ( 
                          <Pagination.Item key={number} active={number === currentPage} onClick={()=>setPaginationNavigate(number)}>
                            {number}
                          </Pagination.Item>)
                        })}
                        <Pagination.Item key={"sonraki"}  onClick={()=>setPaginationNavigate(currentPage + 1)}>
                            {"Sonraki"}
                          </Pagination.Item>
                        </Pagination>
                        </Col>
                      </Row>
                    </div>
              </Col>
            </Row> :<></> }
            

            <Modal size="lg" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Dosya Seçin</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Row>
                <Col> 
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Control type="file"  multiple onChange={handleFileChange} accept="audio/mpeg" />
                </Form.Group>
                </Col>
                <Col><Button variant="primary" onClick={uploadAudio}>Yükle</Button></Col>
               
              </Row>
              
              <Row>
                <Col>
                {uploadFiles.length > 0 ? 
                 <Table striped bordered hover>
                 <thead>
                    <tr key={"table"}>
                      <th>#</th>
                      <th>isim</th>
                      <th>Boyut</th>
                      <th>Tipi</th>
                      <th>Progress</th>
                      <th>Eylem</th>
                    </tr>
                     </thead>
                     <tbody>
                    {uploadFiles.length > 0 ? uploadFiles.map((data, index)=>
                     (
                      <tr key={index}>
                        <td>{data.id + 1}</td>
                        <td>{data.name}</td>
                        <td>{data.size.toFixed() }Mb</td>
                        <td>{data.type}</td>
                        <td>{data.progress.toFixed(2)}</td>
                        <td>
                          {data.progress == 0 || data.progress == 100 ? <><Button variant="danger" >Kaldır</Button></> : <><Button disabled variant="danger" >Kaldır</Button></>}

                        </td>
                      </tr>
                    )                    ):
                    (
                      <tr>
                        <td colSpan="4">No songs found</td>
                      </tr>
                    )}
                  </tbody>
                  
               </Table>
               
               :
               <><Row><Col>Bir Müzik dosyası Seçin</Col></Row></> }

                </Col>
              </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Kapat
                </Button>
                <Button variant="primary" onClick={handleSaveSongs}>
                  Şarkıları Kayıt Et
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