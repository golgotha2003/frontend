import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  IconButton,
  Input,
  
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdateHiepsi.css';
import globalConfig from '../../../config';
import { useNavigate } from 'react-router-dom';


const UpdateHiepsi = () => {
  const { id } = useParams();
  const [accountInfo, setAccountInfo] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [amount, setAmount] = useState('');
  const [content, setContent] = useState('');
  const [server, setServer] = useState('1');
  const [phai, setPhai] = useState('');
  const [de_tu, setDeTu] = useState(true);
  const [status, setStatus] = useState('1');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const cloudName = 'dulapxpnp';
const presetKey = 'ml_default';
const accountJson = sessionStorage.getItem('account');
  let account = JSON.parse(accountJson);
  const navigate = useNavigate();
  

  useEffect(() => {
    // Gọi API để lấy thông tin tài khoản Hiepsi
    const fetchAccountInfo = async () => {
      try {
        const response = await axios.get(`${globalConfig.apiUrl}/hiepsi/account-info/${id}`);
        setAccountInfo(response.data.accountInfo);
        
      } catch (error) {
        console.error('Error:', error);
        toast.error('Không thể tải thông tin tài khoản!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      
    };

    
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${globalConfig.apiUrl}/imageshiepsi/getByAccGameId/${id}`);
        setImages(response.data.images);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Không thể tải ảnh của tài khoản!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };

    fetchAccountInfo();
    fetchImages();
  }, [id]);

  useEffect(() => {
    // Gán các giá trị từ accountInfo vào các state
    if (accountInfo) {
      if (account === null){
        navigate('/');
      }
      else{
        if (account.id !==accountInfo.id_account){
          navigate('/');
        }
      }
      setUsername(accountInfo.username);
      setPassword(accountInfo.password);
      setAmount(accountInfo.amount);
      setContent(accountInfo.content);
      setServer(accountInfo.sever);
      setPhai(accountInfo.phai);
      setDeTu(accountInfo.de_tu);
      setStatus(accountInfo.status.toString()); // Chuyển status sang dạng chuỗi để dễ quản lý
      
    }
  }, [accountInfo]);
  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);

    // Allow only positive integers (digits greater than 0)
    if (!/^\d+$/.test(keyValue) || keyValue === '0') {
      event.preventDefault();
    }
  };
  const handleDeleteImage = async (imageId) => {
    try {
      // Gọi API DELETE để xóa ảnh với imageId truyền vào
      const response = await axios.post(`${globalConfig.apiUrl}/imageshiepsi/delete/${imageId}`);
      if (response.data.success) {
        // Remove the deleted image from the state
        setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));

        toast.success('Xóa ảnh thành công!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(response.data.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Xóa ảnh thất bại!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Gọi API POST để cập nhật thông tin tài khoản Hiepsi
      const response = await axios.post(`${globalConfig.apiUrl}/hiepsi/update`, {
        id: id,
        username,
        password,
        amount,
        content,
        sever: server,
        phai,
        de_tu,
        status,
      });

      if (response.data.success) {
        setUpdateSuccess(true);
        toast.success('Cập nhật thành công!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(response.data.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Cập nhật thất bại!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setIsLoading(false);
  };
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Create a FormData object to hold the file data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', presetKey);

    try {
      // Post the file to the Cloudinary API using axios
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
     
      if (response.data && response.data.secure_url) {
        // Add the uploaded image URL to the state
        setImages((prevImages) => [...prevImages, { id: response.data.public_id, dataImage: response.data.secure_url }]);
        const imageUrl= response.data.secure_url;
        await axios.post(`${globalConfig.apiUrl}/imageshiepsi/add`,{
          id_accgame: id,
          imageUrl

        }  );
        

        toast.success('Upload ảnh thành công!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error('Lỗi khi upload ảnh!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Lỗi khi upload ảnh!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Container>
      <Paper className="Paper">
        <Typography variant="h4" className="Typography-title">
          Cập Nhật Thông Tin Tài Khoản Hiepsi
        </Typography>
        {accountInfo ? (
          <form onSubmit={handleSubmit} className="form">
            {/* Hiển thị các trường thông tin */}
            <TextField
              label="Tài khoản"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="TextField"

            />
            <TextField
              label="Mật khẩu"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="TextField"
            />
            <TextField
              label="Nội Dung"
              variant="outlined"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="TextField"
              multiline
              rows={4}
            />
            <TextField
              label="Giá"
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="TextField"
              onKeyPress={handleKeyPress}
            />
             <FormControl className="FormControl">
              <InputLabel id="server-label">Server</InputLabel>
              <Select
                labelId="server-label"
                id="server"
                value={server}
                onChange={(e) => setServer(e.target.value)}
              >
                <MenuItem value="Chien-Than">Chiến Thần</MenuItem>
                  <MenuItem value="Rong-Lua">Rồng Lửa</MenuItem>
                  <MenuItem value="Phuong-Hoang">Phượng Hoàng</MenuItem>
                  <MenuItem value="Nhan-Ma">Nhân Mã</MenuItem>
                  <MenuItem value="Ki Lan">Kì Lân</MenuItem>
              </Select>
            </FormControl>

            

            {/* Trường chọn đệ tử */}
            <FormControl className="FormControl">
              <InputLabel id="de-tu-label">Đệ Tử</InputLabel>
              <Select
                labelId="de-tu-label"
                id="de-tu"
                value={de_tu}
                onChange={(e) => setDeTu(e.target.value)}
              >
                <MenuItem value={true}>Có</MenuItem>
                <MenuItem value={false}>Không</MenuItem>
              </Select>
            </FormControl>

            {/* Trường chọn phái */}
            <FormControl className="FormControl">
              <InputLabel id="phai-label">Phái</InputLabel>
              <Select
                labelId="phai-label"
                id="phai"
                value={phai}
                onChange={(e) => setPhai(e.target.value)}
              >
                <MenuItem value="Chien-Binh">Chiến Binh</MenuItem>
                  <MenuItem value="Sat-Thu">Sát Thủ</MenuItem>
                  <MenuItem value="Phap-Su">Pháp Sư</MenuItem>
                  <MenuItem value="Xa-Thu">Xạ Thủ</MenuItem>
              </Select>
            </FormControl>

            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />

            {/* Display images */}
            <div className="image-container">
              {images.map((imageUrl, index) => (
                <div key={index} className="image-wrapper">
                  <img src={imageUrl.dataImage} alt={`Hiepsi ${index + 1}`} className="image" />
                  <IconButton
                    className="delete-icon"
                    aria-label="delete"
                    onClick={() => handleDeleteImage(imageUrl.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
            </div>

            <Button type="submit" variant="contained" color="primary" className="submit-button" disabled={isLoading}>
              {isLoading ? ( // Nếu isLoading true thì hiển thị loading spinner
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Cập nhật' // Nếu isLoading false thì hiển thị nút bình thường
              )}
            </Button>
          </form>
        ) : (
          <Typography variant="body1">Đang tải thông tin tài khoản... </Typography>
        )}
       
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default UpdateHiepsi;
