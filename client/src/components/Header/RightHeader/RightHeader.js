import React, {useState} from "react";
import {Icon, Image} from "semantic-ui-react";
import {Link} from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import ModalUpload from "../../Modal/ModalUpload";
import ImageNotFound from "../../../assets/png/avatar.png";
import "./RightHeader.scss";
import {useQuery} from "@apollo/client";
import {GET_USER} from "../../../gql/user";

export default function RightHeader() {
    const [showModal, setShowNodal] = useState(false);
    const {auth} = useAuth();
    const {data, loading, error} = useQuery(GET_USER, {
        variables: {username: auth.username}
    });

    if (loading || error) return null;
    const {getUser} = data;

    return (
        <>
            <div className="right-header">
                <Link to="/">
                    <Icon name="home"/>
                </Link>
                <Icon name="plus" onClick={() => setShowNodal(true)}/>
                <Link to={`/${auth.username}`}>
                    <Image src={getUser.avatar ? getUser.avatar : ImageNotFound} alt="image-not-found" avatar/>
                </Link>
            </div>
            <ModalUpload show={showModal} setShow={setShowNodal}/>
        </>
    );
}
