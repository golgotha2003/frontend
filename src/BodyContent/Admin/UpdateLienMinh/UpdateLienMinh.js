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
import './UpdateLienMinh.css';
import globalConfig from '../../../config';
import { useNavigate } from 'react-router-dom';

const UpdateLienMinh = () => {
  const { id } = useParams();
  const [accountInfo, setAccountInfo] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [amount, setAmount] = useState('');
  const [content, setContent] = useState('');
  const [skin, setSkin] = useState('');
  const [tuong, setTuong] = useState('');
  const [rank, setRank] = useState('');
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
    // Gọi API để lấy thông tin tài khoản Liên Minh
    const fetchAccountInfo = async () => {
      try {
        const response = await axios.get(`${globalConfig.apiUrl}/lienminh/account-info/${id}`);
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
        const response = await axios.get(`${globalConfig.apiUrl}/imageslienminh/getByAccGameId/${id}`);
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
    fetchImages();

    fetchAccountInfo();
  }, [id]);
  

  useEffect(() => {
    // Gán các giá trị từ accountInfo vào các state
    if (accountInfo) {
      if (!account){
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
      setSkin(accountInfo.skin);
      setTuong(accountInfo.tuong);
      setRank(accountInfo.rank);
      setStatus(accountInfo.status);
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
      const response = await axios.post(`${globalConfig.apiUrl}/imageslienminh/delete/${imageId}`);
      
      if (response.data.success) {
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
      // Gọi API POST để cập nhật thông tin tài khoản Liên Minh
      const response = await axios.post(`${globalConfig.apiUrl}/lienminh/update`, {
        id: id,
        username,
        password,
        amount,
        content,
        skin,
        tuong,
        rank,
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
        await axios.post(`${globalConfig.apiUrl}/imageslienminh/add`,{
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
          Cập Nhật Thông Tin Tài Khoản Liên Minh
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
            {/* Trường chọn skin */}
            <TextField
              label="Skin"
              variant="outlined"
              value={skin}
              onChange={(e) => setSkin(e.target.value)}
              className="TextField"
              onKeyPress={handleKeyPress}
            />
            {/* Trường chọn tướng */}
            <TextField
              label="Tướng"
              variant="outlined"
              value={tuong}
              onChange={(e) => setTuong(e.target.value)}
              className="TextField"
              onKeyPress={handleKeyPress}
            />
            {/* Trường chọn rank */}
            <FormControl className="FormControl">
              <InputLabel id="rank-label">Rank</InputLabel>
              <Select
                labelId="rank-label"
                id="rank"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
              >
                <MenuItem value="Khong-rank">Không Rank</MenuItem>
                  <MenuItem value="Rank-sat">Rank Sắt</MenuItem>
                  <MenuItem value="Rank-dong">Rank Đồng</MenuItem>
                  <MenuItem value="Rank-bac">Rank Bạc</MenuItem>
                  <MenuItem value="Rank-vang">Rank Vàng</MenuItem>
                  <MenuItem value="Rank-bach-kim">Rank Bạch Kim</MenuItem>
                  <MenuItem value="Rank-kim-cuong">Rank Kim Cương</MenuItem>
                  <MenuItem value="Rank-cao-thu">Rank Cao Thủ</MenuItem>
                  <MenuItem value="Rank-dai-cao-thu">Rank Đại Cao Thủ</MenuItem>
                  <MenuItem value="Rank-thach-dau">Rank Thách Đấu</MenuItem>
                {/* Thêm các MenuItem khác cho giá trị rank */}
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
                  <img src={imageUrl.dataImage} alt={`Ngocrong ${index + 1}`} className="image" />
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

export default UpdateLienMinh;
