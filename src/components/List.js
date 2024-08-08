import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Container, Button, Table, Modal, Pagination,ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Navigate } from "react-router-dom"
import { useAuth } from '../context/authContext/index.js'
import { getPlaylist } from "../firebase/firestore.js"
import { uploadSong } from '../firebase/storage.js';
import {Song} from "../Model/Song.js"
import { timestampToDate } from '../util/Time.js';
import PlaylistModal from './Modal/PlaylistModal.js';
import AddSongOnPlaylistModal from './Modal/AddSongOnPlaylistModal.js';


function List(params) {
  const { page } = useParams();
  const { currentUser, userLoggedIn } = useAuth()
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);

  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  
  const [addListModal, setAddListModal] = useState(false);
  const [platlistDetailModal, setPlatlistDetailModal] = useState({})

  const [playlist, setPlaylist] = useState([])

  const [uploadFiles, setUploadfiles] = useState([])
  const [error, setError] = useState("")

  const [pageNumber, setPageNumber] = useState()
  const [totalDataCount, setTotalDataCount] = useState(0)
  const [numberOfDataOnPage, setNumberOfDataOnPage] = useState(10)
  const [startData, setStartData] = useState(0)
  const [pageCount, setPageCount] = useState([])
  const navigate = useNavigate();
  
  const [playlistPaganitaion, setPlaylistPaganitaion] = useState([1,2,3])

  
  const openPlaylistModal = ()=> setAddListModal(true)

  useEffect(() => {
    fetchLists()
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

  const openPlaylistDetailModal = (playlistID)=>{
    setPlatlistDetailModal({id:playlistID,state:true})
  }
  const handleClosePlaylistDetailModal = ()=> {
    setPlatlistDetailModal({id:"",state:false})
  }
  const handleClosePlaylistModal= ()=>setAddListModal(false)
  
  function fetchLists() {
    setLoading(true);
    getPlaylist(currentUser.uid)
      .then((querySnapshot) => {
        const _playlist = [];
        querySnapshot.forEach((doc) => {
          console.log("doc", doc.data())
          _playlist.push({ id: doc.id, ...doc.data() });
        });
        setPlaylist(_playlist);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        console.error("Error fetching song list: ", error);
      });
  }
  const setPaginationNavigate = (pageNumber) => {
    if (pageNumber <= 1) pageNumber = 1
    navigate(`/home/song/${pageNumber}`);
    setStartData((pageNumber - 1) * numberOfDataOnPage)
    setCurrentPage(pageNumber)
  }
  const navigateToHome = ()=>{
    navigate(`/home`)
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
                  <Button variant="secondary" onClick={openPlaylistModal}>Liste Ekle</Button>
                  <Button variant="secondary" onClick={navigateToHome}>Şarkılarım</Button>
              </ButtonGroup>
              </Col>
              </Row>
            {playlist.length > 0 ?
              <Row>
                <Col>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Liste İsmi</th>
                        <th>Oluşturma Zamanı</th>
                        <th>Eylem</th>
                      </tr>
                    </thead>
                    <tbody>

                      {playlist != null && playlist.length > 0 ? playlist.map((data, index) =>
                      (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.name}</td>
                          <td>{timestampToDate(data.create_date)}</td>
                          <td>
                              <>  
                                <ButtonGroup aria-label="Basic example">
                                  <Button variant="danger" >Kaldır</Button>
                                  <Button variant="secondary" onClick={()=>openPlaylistDetailModal(data.id)} >Şarkı Ekle</Button>
                                </ButtonGroup>
                              </> 
                          </td>
                        </tr>
                      )) :
                        (
                          <tr>
                            <td colSpan="4">Liste Bulunamadı</td>
                          </tr>
                        )}
                    </tbody>
                  </Table>
                  <div>
                    {playlistPaganitaion.size >=1 ?
                    <>
                      <Row>
                      <Col>
                        <Pagination>
                          <Pagination.Item key={"onceki"} onClick={() => setPaginationNavigate(currentPage - 1)}>
                            {"Önceki"}
                          </Pagination.Item>
                          { playlistPaganitaion.map((number) => {
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
            <PlaylistModal show={addListModal} handleClose={handleClosePlaylistModal}/>
            <AddSongOnPlaylistModal show={platlistDetailModal.state} playlistID={platlistDetailModal.id} handleClose={handleClosePlaylistDetailModal}/>

          </Container>
        </>
      }
    </>
  )
}

export default List