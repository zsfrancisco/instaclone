import React, {useEffect, useState} from "react";
import {map} from "lodash";
import {Link} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {GET_PUBLICATIONS_FOLLOWED} from "../../../gql/publication";
import Actions from "../../Modal/ModalPublication/Actions/Actions";
import CommentForm from "../../Modal/ModalPublication/CommentForm/CommentForm";
import ImageNotFound from "../../../assets/png/avatar.png";
import ModalPublication from "../../Modal/ModalPublication";
import "./Feed.scss";
import {Image} from "semantic-ui-react";

export default function Feed() {
    const [showModal, setShowModal] = useState(false);
    const [publicationSelected, setPublicationSelected] = useState(null);
    const {data, loading, startPolling, stopPolling} = useQuery(GET_PUBLICATIONS_FOLLOWED);

    useEffect(() => {
        startPolling(1000);
        return () => stopPolling();
    }, [startPolling, stopPolling]);

    if (loading) return null;
    const {getPublicationsFollowed} = data;

    const onOpenPublication = (publication) => {
        setPublicationSelected(publication);
        setShowModal(true);
    }

    return (
        <>
            <div className="feed">
                {map(getPublicationsFollowed, (publication, index) => (
                    <div key={index} className="feed__box">
                        <Link to={`/${publication.idUser.username}`}>
                            <div className="feed__box-user">
                                <Image src={publication.idUser.avatar || ImageNotFound} avatar/>
                                <span>{publication.idUser.name}</span>
                            </div>
                        </Link>
                        <div className="feed__box-photo"
                             style={{backgroundImage: `url("${publication.file}")`}}
                             onClick={() => onOpenPublication(publication)}
                        />
                        <div className="feed__box-actions">
                            <Actions publication={publication}/>
                        </div>
                        <div className="feed__box-form">
                            <CommentForm publication={publication}/>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && (
                <ModalPublication show={showModal} setShow={setShowModal} publication={publicationSelected}/>
            )}
        </>
    );
}
