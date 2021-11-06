import React from "react";
import {Grid, Modal} from "semantic-ui-react";
import Comments from "./Comments";
import CommentForm from "./CommentForm/CommentForm";
import Actions from "./Actions";
import "./ModalPublication.scss";

export default function ModalPublication(props) {
    const {show, setShow, publication} = props;

    const onClose = () => setShow(false);

    return (
        <Modal open={show} onClose={onClose} className="modal-publication">
            <Grid>
                <Grid.Column className="modal-publication__left"
                             width={10}
                             style={{backgroundImage: `url("${publication.file}")`}}/>
                <Grid.Column className="modal-publication__right" width={6}>
                    <Comments publication={publication}/>
                    <Actions publication={publication}/>
                    <CommentForm publication={publication}/>
                </Grid.Column>
            </Grid>
        </Modal>
    );
}
