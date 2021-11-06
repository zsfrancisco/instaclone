import React, {useEffect, useState} from "react";
import {size} from "lodash";
import {useQuery} from "@apollo/client";
import {GET_FOLLOWED, GET_FOLLOWERS} from "../../../../gql/follow";
import ModalBasic from "../../../Modal/ModalBasic";
import ListUsers from "../../ListUsers";
import "./Followers.scss";

export default function Followers(props) {
    const {username, totalPublications} = props;
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [childrenModal, setChildrenModal] = useState(null);

    const {
        data: dataFollowers,
        loading: loadingFollowers,
        startPolling: startPollingFollowers,
        stopPolling: stopPollingFollowers
    } = useQuery(GET_FOLLOWERS, {variables: {username}});

    const {
        data: dataFollowed,
        loading: loadingFollowed,
        startPolling: startPollingFollowed,
        stopPolling: stopPollingFollowed
    } = useQuery(GET_FOLLOWED, {variables: {username}});

    useEffect(() => {
        startPollingFollowers(1000);
        return () => {
            stopPollingFollowers();
        }
    }, [startPollingFollowers, stopPollingFollowers]);

    useEffect(() => {
        startPollingFollowed(1000);
        return () => {
            stopPollingFollowed();
        }
    }, [startPollingFollowed, stopPollingFollowed]);

    const openFollowers = () => {
        setTitleModal("Seguidores");
        setChildrenModal(
            <ListUsers users={getFollowers} setShowModal={setShowModal}/>
        );
        setShowModal(true);
    };

    const openFollowed = () => {
        setTitleModal("Usuarios seguidos");
        setChildrenModal(
            <ListUsers users={getFollowed} setShowModal={setShowModal}/>
        );
        setShowModal(true);
    };

    if (loadingFollowers) return null;
    const {getFollowers} = dataFollowers;

    if (loadingFollowed) return null;
    const {getFollowed} = dataFollowed;

    return (
        <>
            <div className="followers">
                <p>
                    <span>{totalPublications}</span> publicaciones
                </p>
                <p className="link" onClick={openFollowers}>
                    <span>{size(getFollowers)}</span> seguidores
                </p>
                <p className="link" onClick={openFollowed}>
                    <span>{size(getFollowed)}</span> seguidos
                </p>
            </div>
            <ModalBasic show={showModal} setShow={setShowModal} title={titleModal}>
                {childrenModal}
            </ModalBasic></>
    )
}
