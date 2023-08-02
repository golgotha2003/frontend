import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import globalConfig from '../../../config';
import './CreateProduct.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const convertImageToBase64 = (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const CreateProduct = () => {
  const accountJson = sessionStorage.getItem('account');
  let account = JSON.parse(accountJson);
  const [productType, setProductType] = useState('ngoc-rong');
  const [price, setPrice] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [server, setServer] = useState(1);
  const [hanhTinh, setHanhTinh] = useState('Trai-dat');
  const [bongTai, setBongTai] = useState(false);
  const [deTu, setDeTu] = useState(false);
  const [sucManh, setSucManh] = useState('');

  const [skin, setSkin] = useState(0);
  const [tuong, setTuong] = useState(0);
  const [rank, setRank] = useState('Khong-rank');

  const [phai, setPhai] = useState('Chien-Binh');
  const [serverhso, setServerhso] = useState('Chien-Than');

  const [images, setImages] = useState([]);
  const [maxImages, setMaxImages] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (account){
        if (account.role !== 3 && account.role !== 2)
        window.location.href = '/'
    }
    else{
        window.location.href = '/login'
    }
  }, []);
  const isPositiveInteger = (value) => {
    return /^\d+$/.test(value) && parseInt(value) >= 0;
  };

  const handleProductTypeChange = (event) => {
    setProductType(event.target.value);
  };

  const handleImageChange = async (event) => {
    const fileArray = Array.from(event.target.files).slice(0, maxImages);
    const base64Images = await Promise.all(fileArray.map((image) => convertImageToBase64(image)));
    setImages((prevImages) => [...prevImages, ...base64Images]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handlePositiveIntegerChange = (event, setState) => {
    const { value } = event.target;
    if (isPositiveInteger(value)) {
      setState(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    let apiUrl = '';
    let formData = {};

    if (productType === 'ngoc-rong') {
      apiUrl = `${globalConfig.apiUrl}/ngocrong/create`;
      formData = {
        id_account: account.id,
        productType,
        amount: price,
        username,
        password,
        content,
        sever: server,
        hanh_tinh: hanhTinh,
        bong_tai: bongTai,
        de_tu: deTu,
        suc_manh: sucManh,
        images: images.join(' , '),
      };
    } else if (productType === 'lien-minh') {
      apiUrl = `${globalConfig.apiUrl}/lienminh/create`;
      formData = {
        id_account: account.id,
        productType,
        amount: price,
        username,
        password,
        content,
        skin,
        tuong,
        rank,
        images: images.join(' , '),
      };
    } else if (productType === 'hiep-si-online') {
      apiUrl = `${globalConfig.apiUrl}/hiepsi/create`;
      formData = {
        id_account: account.id,
        productType,
        amount: price,
        username,
        password,
        content,
        phai,
        sever: serverhso,
        de_tu: deTu,
        images: images.join(' , '),
      };
    }

    try {
      const response = await axios.post(apiUrl, formData);
      console.log('Response:', response.data);

      if (response.data.success) {
        // Hiển thị thông báo toast khi thành công
        toast.success('Tạo sản phẩm thành công!', {
          position: 'top-right',
          autoClose: 3000, // Thời gian hiển thị thông báo (ms)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        // Hiển thị thông báo toast khi thất bại
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
      // Hiển thị thông báo toast khi thất bại
      toast.error('Ảnh quá lớn', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false); // Tắt loading sau khi hoàn thành request
    }
  };


  return (
    <Container>
      <Paper className="Paper">

        <Typography variant="h4" className="Typography-title">
          Tạo Sản Phẩm
        </Typography>
        <form onSubmit={handleSubmit} className="form">
          <FormControl variant="outlined" className="FormControl">
            <InputLabel id="product-type-label">Loại Sản Phẩm</InputLabel>
            <Select
              labelId="product-type-label"
              id="product-type"
              value={productType}
              onChange={handleProductTypeChange}
              label="Loại Sản Phẩm"
            >
              <MenuItem value="ngoc-rong">Ngọc Rồng</MenuItem>
              <MenuItem value="lien-minh">Liên Minh</MenuItem>
              <MenuItem value="hiep-si-online">Hiệp Sĩ Online</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Giá Tiền"
            variant="outlined"
            type="number"
            value={price}
            onChange={(e) => handlePositiveIntegerChange(e, setPrice)}
            className="TextField"
          />
          <TextField
            label="Tên Tài Khoản"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="TextField"
          />
          <TextField
            label="Mật Khẩu"
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
          />
          {productType === 'ngoc-rong' && (
            <>
              <FormControl variant="outlined" className="FormControl">
                <InputLabel id="server-label">Server</InputLabel>
                <Select
                  labelId="server-label"
                  id="server"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  label="Server"
                >
                  {Array.from({ length: 11 }, (_, index) => index + 1).map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" className="FormControl">
                <InputLabel id="hanh-tinh-label">Hành Tinh</InputLabel>
                <Select
                  labelId="hanh-tinh-label"
                  id="hanh-tinh"
                  value={hanhTinh}
                  onChange={(e) => setHanhTinh(e.target.value)}
                  label="Hành Tinh"
                >
                  <MenuItem value="Trai-dat">Trái Đất</MenuItem>
                  <MenuItem value="Namec">Namec</MenuItem>
                  <MenuItem value="Xayda">Xayda</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" className="FormControl">
                <InputLabel id="bong-tai-label">Bông Tai</InputLabel>
                <Select
                  labelId="bong-tai-label"
                  id="bong-tai"
                  value={bongTai}
                  onChange={(e) => setBongTai(e.target.value)}
                  label="Bông Tai"
                >
                  <MenuItem value={false}>Không</MenuItem>
                  <MenuItem value={true}>Có</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" className="FormControl">
                <InputLabel id="de-tu-label">Đệ Tử</InputLabel>
                <Select
                  labelId="de-tu-label"
                  id="de-tu"
                  value={deTu}
                  onChange={(e) => setDeTu(e.target.value)}
                  label="Đệ Tử"
                >
                  <MenuItem value={false}>Không</MenuItem>
                  <MenuItem value={true}>Có</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Sức Mạnh"
                variant="outlined"
                value={sucManh}
                onChange={(e) => setSucManh(e.target.value)}
                className="TextField"
              />
            </>
          )}
          {productType === 'lien-minh' && (
            <>
              <TextField
                label="Skin"
                variant="outlined"
                type="number"
                value={skin}
                onChange={(e) => setSkin(e.target.value)}
                className="TextField"
              />
              <TextField
                label="Tướng"
                variant="outlined"
                type="number"
                value={tuong}
                onChange={(e) => setTuong(e.target.value)}
                className="TextField"
              />
              <FormControl variant="outlined" className="FormControl">
                <InputLabel id="rank-label">Rank</InputLabel>
                <Select
                  labelId="rank-label"
                  id="rank"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  label="Rank"
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
                </Select>
              </FormControl>
            </>
          )}
          {productType === 'hiep-si-online' && (

            <>
              <FormControl variant="outlined" className="FormControl">
                <InputLabel id="server-label">Server</InputLabel>
                <Select
                  labelId="server-label"
                  id="server"
                  value={serverhso}
                  onChange={(e) => setServerhso(e.target.value)}
                  label="Serverhso"
                >
                  <MenuItem value="Chien-Than">Chiến Thần</MenuItem>
                  <MenuItem value="Rong-Lua">Rồng Lửa</MenuItem>
                  <MenuItem value="Phuong-Hoang">Phượng Hoàng</MenuItem>
                  <MenuItem value="Nhan-Ma">Nhân Mã</MenuItem>
                  <MenuItem value="Ki Lan">Kì Lân</MenuItem>


                </Select>
              </FormControl>
              <FormControl variant="outlined" className="FormControl">
                <InputLabel id="phai-label">Phái</InputLabel>
                <Select
                  labelId="phai-label"
                  id="phai"
                  value={phai}
                  onChange={(e) => setPhai(e.target.value)}
                  label="Phai"
                >
                  <MenuItem value="Chien-Binh">Chiến Binh</MenuItem>
                  <MenuItem value="Sat-Thu">Sát Thủ</MenuItem>
                  <MenuItem value="Phap-Su">Pháp Sư</MenuItem>
                  <MenuItem value="Xa-Thu">Xạ Thủ</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" className="FormControl">
                <InputLabel id="de-tu-label">Đệ Tử</InputLabel>
                <Select
                  labelId="de-tu-label"
                  id="de-tu"
                  value={deTu}
                  onChange={(e) => setDeTu(e.target.value)}
                  label="Đệ Tử"
                >
                  <MenuItem value={false}>Không</MenuItem>
                  <MenuItem value={true}>Có</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          <div className="image-upload-container">
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<AddPhotoAlternateIcon />}
                disabled={images.length >= maxImages}
                className="image-upload-button"
              >
                Thêm Ảnh (Tối đa 5)
              </Button>
            </label>
            <div className="image-preview-container">
              {images.map((image, index) => (
                <div key={index} className="preview-image-container">
                  <img
                    src={image}
                    alt={`Image ${index}`}
                    className="preview-image"
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    className="remove-image-button"
                  >
                    <ClearIcon />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" variant="contained" color="primary" className="submit-button" disabled={isLoading}>
            {isLoading ? ( // Nếu isLoading true thì hiển thị loading spinner
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Tạo Sản Phẩm' // Nếu isLoading false thì hiển thị nút bình thường
            )}
          </Button>
        </form>
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default CreateProduct;
