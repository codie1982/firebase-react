import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Container, Button, Table, Modal, Pagination,ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Navigate } from "react-router-dom"
import { useAuth } from '../context/authContext/index.js'
import { getSongs, createSong, getSongCount } from "../firebase/firestore.js"
import { uploadSong } from '../firebase/storage.js';
import {Song} from "../Model/Song.js"
import { timestampToDate } from '../util/Time.js';
import PlaylistModal from './Modal/PlaylistModal.js';


function Performer(params) {
  const { page } = useParams();
  const { currentUser, userLoggedIn } = useAuth()
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);

  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [addSongModal, setAddSongModal] = useState(false);
  const [addListModal, setAddListModal] = useState(false);
  const [addAlbumModal, setAddAlbumModal] = useState(false);
  const [addPerformerModal, setAddPerformerModal] = useState(false);
  const [addGenreModal, setAddGenreModal] = useState(false);

  const [songList, setSongList] = useState([]);
  const [songListPagination, setSongListPagination] = useState([])
  const [downloadURL, setDownloadURL] = useState('');
  const [uploadFiles, setUploadfiles] = useState([])
  const [error, setError] = useState("")
  const [song, setSong] = useState({})
  const [pageNumber, setPageNumber] = useState()
  const [totalDataCount, setTotalDataCount] = useState(0)
  const [numberOfDataOnPage, setNumberOfDataOnPage] = useState(10)
  const [startData, setStartData] = useState(0)
  const [pageCount, setPageCount] = useState([])
  const navigate = useNavigate();
  
  
  const handleCloseAddSongModal = () => setAddSongModal(false);
  const handleClosePlaylistModal = ()=> setAddListModal(false)
  const handleCloseAddALbumModal = () => setAddAlbumModal(false);
  const handleCloseAddPerformerModal = () => setAddPerformerModal(false);
  const handleCloseAddGenreModal = () => setAddGenreModal(false);


  const handleAddSongModal = () => setAddSongModal(true);
  const openPlaylistModal = ()=> setAddListModal(true)
  const handleAddAlbumModal = () => setAddAlbumModal(true);
  const handleAddPerformerModal = () => setAddPerformerModal(true);
  const handleAddGenreModal = () => setAddGenreModal(true);


  const handleFileChange = (e) => {
    setFiles(e.target.files)
  }
  const uploadAudio = async () => {
    for (let i = 0; i < files.length; i++) {
      uploadSong(files[i], currentUser.uid, i, (index, progress) => setUploadFilesState(index, progress))
        .then((data) => {
          setDownloadURL(data.url);
          for (let i = 0; i < uploadFiles.length; i++) {
            if (i == data.index) {
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
    getSongCount().then((result) => setTotalDataCount(result))
  }, [])

  useEffect(() => {
    console.log("totalDataCount", totalDataCount)
    let _pageCount;
    let pageCountArray = []
    _pageCount = totalDataCount / numberOfDataOnPage
    for (let i = 0; i < _pageCount; i++) {
      pageCountArray.push(i + 1)
    }
    setPageCount(pageCountArray)
  }, [totalDataCount])
  useEffect(() => {
    console.log("pageCount", pageCount)
  }, [pageCount])


  useEffect(() => {
    if (currentUser) {
      fetchSongs()
    }
  }, [currentUser, currentPage])

  useEffect(() => {
    console.log("files", files)
    var _uploadFiles = []
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      _uploadFiles.push(
        {
          id: index,
          name: element.name,
          size: element.size / 1024 / 1024,
          type: element.type,
          progress: 0,
          url: ""
        })
    }
    setUploadfiles(_uploadFiles)
  }, [files])



  function setUploadFilesState(index, progress) {
    setProgress(progress)

    for (let i = 0; i < uploadFiles.length; i++) {
      if (i == index) {
        uploadFiles[i].progress = progress
      }
    }
    console.log("_uploadFiles", uploadFiles)
    setUploadfiles(uploadFiles)
  }

  const handleSaveSongs = async () => {
    var songs = uploadFiles.map((data) => {
      if (data.progress == 100) {
        return (new Song(data.name, data.url, currentUser.uid, data.size, data.type, "", "", ""))
      }
    })
    for (let i = 0; i < songs.length; i++)
      await createSong(songs[i])

    setAddSongModal(false)
  };

  function fetchSongs() {
    setLoading(true);
    let limit = numberOfDataOnPage*currentPage
    getSongs(currentUser.uid, limit)
      .then((querySnapshot) => {
        const songs = [];
        querySnapshot.forEach((doc) => {
          console.log("doc", doc.data())
          songs.push({ id: doc.id, ...doc.data() });
        });
        setSongList(songs);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        console.error("Error fetching song list: ", error);
      });
  }

  useEffect(() => {
    if(songList!=null && songList.length >=1){
      let _songListPagination= []
      let limit = numberOfDataOnPage*currentPage;
      let _startData = startData == null ? 0 :startData
      for(let i = _startData;i<limit;i++){
        if(songList[i] !=null || songList[i] != undefined)
          _songListPagination.push(songList[i])
      }
      _songListPagination.filter((i)=>i == undefined)
      console.log("_songListPagination",_songListPagination)
      setSongListPagination(_songListPagination)
    }
  }, [songList])
  

  const setPaginationNavigate = (pageNumber) => {
    if (pageNumber <= 1) pageNumber = 1
    navigate(`/home/song/${pageNumber}`);
    setStartData((pageNumber - 1) * numberOfDataOnPage)
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
            <Row>
              <Col md="12">
                <ButtonGroup aria-label="Basic example">
                  <Button variant="secondary" onClick={handleAddSongModal}>Şarkı Ekle</Button>
                  <Button variant="secondary" onClick={openPlaylistModal}>Liste Ekle</Button>
                  <Button variant="secondary" onClick={handleAddAlbumModal}>Albüm Ekle</Button>
                  <Button variant="secondary" onClick={handleAddPerformerModal}>Sanatçı Ekle</Button>
                  <Button variant="secondary" onClick={handleAddGenreModal}>Tür Ekle</Button>
              </ButtonGroup>
              </Col>
              </Row>
            {songList.length > 0 ?
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
                      {console.log("songListPagination",songListPagination)}
                      {songListPagination != null && songListPagination.length > 0 ? songListPagination.map((data, index) =>
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
                      )) :
                        (
                          <tr>
                            <td colSpan="4">No songs found</td>
                          </tr>
                        )}
                    </tbody>
                  </Table>
                  <div>
                    {pageCount.size >=1 ?
                    <>
                      <Row>
                      <Col>
                        <Pagination>
                          <Pagination.Item key={"onceki"} onClick={() => setPaginationNavigate(currentPage - 1)}>
                            {"Önceki"}
                          </Pagination.Item>
                          { pageCount.map((number) => {
                            return (
                              <Pagination.Item key={number} active={number === currentPage} onClick={() => setPaginationNavigate(number)}>
                                {number}
                              </Pagination.Item>)
                          })}
                          <Pagination.Item key={"sonraki"} onClick={() => setPaginationNavigate(currentPage + 1)}>
                            {"Sonraki"}
                          </Pagination.Item>
                        </Pagination>
                      </Col>
                    </Row>
                    </> :<></>}
                  
                  </div>
                </Col>
              </Row> : <></>}


            <Modal size="lg" show={addSongModal} onHide={handleCloseAddSongModal}>
              <Modal.Header closeButton>
                <Modal.Title>Şarkı Ekleyin</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                      <Form.Control type="file" multiple onChange={handleFileChange} accept="audio/mpeg" />
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
                          {uploadFiles.length > 0 ? uploadFiles.map((data, index) =>
                          (
                            <tr key={index}>
                              <td>{data.id + 1}</td>
                              <td>{data.name}</td>
                              <td>{data.size.toFixed()}Mb</td>
                              <td>{data.type}</td>
                              <td>{data.progress.toFixed(2)}</td>
                              <td>
                                {data.progress == 0 || data.progress == 100 ? <><Button variant="danger" >Kaldır</Button></> : <><Button disabled variant="danger" >Kaldır</Button></>}
                              </td>
                            </tr>
                          )) :
                            (
                              <tr>
                                <td colSpan="4">No songs found</td>
                              </tr>
                            )}
                        </tbody>

                      </Table>

                      :
                      <><Row><Col>Bir Müzik dosyası Seçin</Col></Row></>}

                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAddSongModal}>
                  Kapat
                </Button>
                <Button variant="primary" onClick={handleSaveSongs}>
                  Şarkıları Kayıt Et
                </Button>
              </Modal.Footer>
            </Modal>

            <PlaylistModal show={addListModal} handleClose={handleClosePlaylistModal}/>
            
            <Modal size="lg" show={addAlbumModal} onHide={handleCloseAddALbumModal}>
              <Modal.Header closeButton>
                <Modal.Title>Albüm Oluşturun</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                      <Form.Control type="file" multiple onChange={handleFileChange} accept="audio/mpeg" />
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
                          {uploadFiles.length > 0 ? uploadFiles.map((data, index) =>
                          (
                            <tr key={index}>
                              <td>{data.id + 1}</td>
                              <td>{data.name}</td>
                              <td>{data.size.toFixed()}Mb</td>
                              <td>{data.type}</td>
                              <td>{data.progress.toFixed(2)}</td>
                              <td>
                                {data.progress == 0 || data.progress == 100 ? <><Button variant="danger" >Kaldır</Button></> : <><Button disabled variant="danger" >Kaldır</Button></>}
                              </td>
                            </tr>
                          )) :
                            (
                              <tr>
                                <td colSpan="4">No songs found</td>
                              </tr>
                            )}
                        </tbody>

                      </Table>

                      :
                      <><Row><Col>Bir Müzik dosyası Seçin</Col></Row></>}

                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAddALbumModal}>
                  Kapat
                </Button>
                <Button variant="primary" onClick={handleSaveSongs}>
                  Şarkıları Kayıt Et
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal size="lg" show={addPerformerModal} onHide={handleCloseAddPerformerModal}>
              <Modal.Header closeButton>
                <Modal.Title>Sanatçı Ekleyin</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                      <Form.Control type="file" multiple onChange={handleFileChange} accept="audio/mpeg" />
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
                          {uploadFiles.length > 0 ? uploadFiles.map((data, index) =>
                          (
                            <tr key={index}>
                              <td>{data.id + 1}</td>
                              <td>{data.name}</td>
                              <td>{data.size.toFixed()}Mb</td>
                              <td>{data.type}</td>
                              <td>{data.progress.toFixed(2)}</td>
                              <td>
                                {data.progress == 0 || data.progress == 100 ? <><Button variant="danger" >Kaldır</Button></> : <><Button disabled variant="danger" >Kaldır</Button></>}
                              </td>
                            </tr>
                          )) :
                            (
                              <tr>
                                <td colSpan="4">No songs found</td>
                              </tr>
                            )}
                        </tbody>

                      </Table>

                      :
                      <><Row><Col>Bir Müzik dosyası Seçin</Col></Row></>}

                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAddPerformerModal}>
                  Kapat
                </Button>
                <Button variant="primary" onClick={handleSaveSongs}>
                  Şarkıları Kayıt Et
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal size="lg" show={addGenreModal} onHide={handleCloseAddGenreModal}>
              <Modal.Header closeButton>
                <Modal.Title>Tür Ekleyin</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                      <Form.Control type="file" multiple onChange={handleFileChange} accept="audio/mpeg" />
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
                          {uploadFiles.length > 0 ? uploadFiles.map((data, index) =>
                          (
                            <tr key={index}>
                              <td>{data.id + 1}</td>
                              <td>{data.name}</td>
                              <td>{data.size.toFixed()}Mb</td>
                              <td>{data.type}</td>
                              <td>{data.progress.toFixed(2)}</td>
                              <td>
                                {data.progress == 0 || data.progress == 100 ? <><Button variant="danger" >Kaldır</Button></> : <><Button disabled variant="danger" >Kaldır</Button></>}
                              </td>
                            </tr>
                          )) :
                            (
                              <tr>
                                <td colSpan="4">No songs found</td>
                              </tr>
                            )}
                        </tbody>

                      </Table>

                      :
                      <><Row><Col>Bir Müzik dosyası Seçin</Col></Row></>}

                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAddGenreModal}>
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

export default Performer