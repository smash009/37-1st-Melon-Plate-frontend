import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FoodMenu from './FoodMenu';
import { CLOSED_DAY, CATEGORIES } from './adminEditData';
import API from '../../config';
import './AdminEdit.scss';

const AdminEdit = () => {
  const accessToken = localStorage.getItem('TOKEN');
  const [store, setStore] = useState({});
  const [menuData, setMenuData] = useState([]);
  const storeId = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API.adminEdit}/${storeId.id}`, {
      method: 'GET',
      headers: {
        authorization: accessToken,
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then(res => res.json())
      .then(
        result => (
          console.log(result), setInput(result), setMenus(result.food_menu)
        )
      );
  }, []);

  const [input, setInput] = useState({
    name: store.name,
    description: store.description,
    address: store.address,
    tel: store.tel,
    open_time: store.open_time,
    closed_time: store.closed_time,
    closed_day_id: '',
    price_range: store.price_range,
    category_id: store.category_id,
  });

  const [imageInput, setImageInput] = useState();
  const [dayNum, setDayNum] = useState(0);
  const [menuId, setMenuId] = useState(1);
  const [menus, setMenus] = useState(menuData);
  const [menuInput, setMenuInput] = useState({
    id: menuId,
    name: '',
    price: '',
  });

  const saveInput = e => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const saveImage = e => {
    setImageInput(e.target.files[0]);
  };

  const saveDayInput = e => {
    const dayValue = Number(e.target.value);
    if (e.target.checked) {
      setDayNum(prev => prev + dayValue);
    } else {
      setDayNum(prev => prev - dayValue);
    }
  };

  const saveMenuInput = e => {
    const { name, value } = e.target;
    setMenuInput({ ...menuInput, [name]: value });
  };

  const menuAddBtnClick = () => {
    setMenuId(prev => prev + 1);
    setMenus([...menus, menuInput]);
    setMenuInput({ id: menuId + 1, name: '', price: '' });
  };

  const menuDeleteBtnClick = e => {
    let newArr = [...menus];
    const resultArr = newArr.filter(list => list.id !== Number(e.target.title));
    setMenus(resultArr);
  };

  const adminEditForm = new FormData();

  const {
    name,
    address,
    tel,
    open_time,
    closed_time,
    description,
    price_range,
    category_id,
  } = input;

  adminEditForm.append('name', name);
  adminEditForm.append('address', address);
  adminEditForm.append('tel', tel);
  // adminEditForm.append('open_time', open_time);
  // adminEditForm.append('closed_time', closed_time);
  adminEditForm.append('image', imageInput);
  adminEditForm.append('closed_day_id', dayNum);
  adminEditForm.append('description', description);
  adminEditForm.append('price_range', price_range);
  adminEditForm.append('category_id', category_id);
  adminEditForm.append('food_menu', JSON.stringify(menus));

  const editSaveClick = () => {
    fetch(`${API.adminEdit}/${storeId.id}`, {
      method: 'PATCH',
      headers: {
        enctype: 'multipart/form-data',
        authorization: accessToken,
      },
      body: adminEditForm,
    })
      .then(res => res.json())
      .then(result => console.log(result));
    navigate('/adminpage');
    window.location.reload();
  };

  return (
    <div className="adminEdit">
      <div className="adminEditBox">
        <div className="adminEditTitle">내 가게 수정하기</div>
        <div className="adminImageInputSet">
          <div className="inputTitle">대표 사진</div>
          <input type="file" accept="image/*" onChange={saveImage} />
        </div>
        <div className="adminEditInputSet">
          <div className="inputTitle">상호명</div>
          <input
            className="inputText"
            type="text"
            name="name"
            onChange={saveInput}
            value={input.name}
          />
        </div>
        <div className="adminEditInputSet">
          <div className="inputTitle">주소</div>
          <input
            className="inputText"
            type="text"
            name="address"
            onChange={saveInput}
            value={input.address}
          />
        </div>
        <div className="adminEditInputSet">
          <div className="inputTitle">전화번호</div>
          <input
            className="inputText"
            type="tel"
            name="tel"
            onChange={saveInput}
            value={input.tel}
          />
        </div>
        <div className="adminEditInputSet">
          <div className="inputTitle">오픈 시간</div>
          <input
            className="inputText"
            type="time"
            name="open_time"
            onChange={saveInput}
            value={input.open_time}
          />
        </div>
        <div className="adminEditInputSet">
          <div className="inputTitle">마감 시간</div>
          <input
            className="inputText"
            type="time"
            name="closed_time"
            onChange={saveInput}
            value={input.closed_time}
          />
        </div>
        <div className="storeCategories">
          <div className="inputTitle">식당 카테고리</div>
          <select className="inputText" onChange={saveInput} name="category_id">
            {CATEGORIES.map(e => (
              <option value={e.value} key={e.value} name="category_id">
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="closedDay">
          <div className="inputTitle">휴일</div>
          {CLOSED_DAY.map(day => (
            <div key={day.id}>
              <input
                type="checkbox"
                value={day.value}
                name="closed_day_id"
                onChange={saveDayInput}
              />
              {day.text}
            </div>
          ))}
        </div>
        <div className="descriptionInput">
          <div className="inputTitle">가게 설명</div>
          <textarea
            onChange={saveInput}
            name="description"
            placeholder="가게에 대해 설명해주세요 (최대 1,000자)"
            maxLength="1000"
            value={input.description}
          />
        </div>
        <div className="adminEditInputSet">
          <div className="inputTitle">1인당 가격대</div>
          <input
            className="inputText2"
            name="price_range"
            type="number"
            placeholder="1인당 가격대"
            onChange={saveInput}
            value={input.price_range}
          />
          <span>만원</span>
        </div>
        <FoodMenu
          saveMenuInput={saveMenuInput}
          menuAddBtnClick={menuAddBtnClick}
          menus={menus}
          menuInput={menuInput}
          menuDeleteBtnClick={menuDeleteBtnClick}
        />
        <button className="adminEditSave" onClick={editSaveClick}>
          저장하기
        </button>
      </div>
    </div>
  );
};

export default AdminEdit;
