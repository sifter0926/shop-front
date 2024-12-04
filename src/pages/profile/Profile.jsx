import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import purchaseService from "../../services/purchase.service";
import { Role } from "../../models/Role";
import UserService from "../../services/user.service";
import { clearCurrentUser } from "../../store/actions/user";

const Profile =() =>{
    const [purchaseList, setPurchaseList]=useState([]);
    const [errorMessage, setErrorMessage]=useState('');
    const currentUser=useSelector((state)=>state.user)
    const dispatch=useDispatch();

    useEffect(()=>{
        purchaseService.getAllPerchases().then((response)=>{
            setPurchaseList(response.data);
        });
    },[]);

    const changeRole=()=>{
        const newRole=currentUser.role==Role.ADMIN? Role.USER : Role.ADMIN;

        UserService.changeRole(newRole).then(()=>{
            dispatch(clearCurrentUser());
            window.location.href='/login';
        })
        .catch((err)=>{
            setErrorMessage('예기치 않은 에러가 발생했습니다.');
            console.log(err)
        });
    }

    return ( 
    <div className="mt-5">
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <div className="card">
            <div className="card-header">
                <div className="row">
                    <h3>구매한 상품들</h3>
                </div>
                <div className="col-6 text-end">
                    현재 유저의 권한은 <strong>{currentUser?.role}</strong>입니다.
                    <button onClick={changeRole} className="btn btn-primary ms-3">권한변경</button>
                </div>
            </div>
            <div className="card-board">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">상품명</th>
                            <th scope="col">수량</th>
                            <th scope="col">구매일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseList.map((item, ind)=>(
                            <tr key={ind}>
                                <td scope="row">{ind +1}</td>
                                <td>{item.name}</td>
                                <td>{`${item.quantity}개`}</td>
                                <td>{new Date(item.purchaseTime).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>

    </div>
    )
}
export default Profile;