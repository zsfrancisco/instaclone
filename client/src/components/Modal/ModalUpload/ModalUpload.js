import React, {useCallback, useState} from "react";
import {Button, Dimmer, Icon, Loader, Modal} from "semantic-ui-react";
import {useDropzone} from "react-dropzone";
import {PUBLISH} from "../../../gql/publication";
import {useMutation} from "@apollo/client";
import {toast} from "react-toastify";
import "./ModalUpload.scss";

export default function ModalUpload(props) {
    const {show, setShow} = props;
    const [fileUpload, setFileUpload] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [publish] = useMutation(PUBLISH);

    const onDrop = useCallback((acceptedFile) => {
        const file = acceptedFile[0];
        setFileUpload({
            type: "image",
            file,
            preview: URL.createObjectURL(file)
        });
    }, []);

    const {getRootProps, getInputProps} = useDropzone({
        accept: "image/jpeg, image/png",
        noKeyboard: true,
        multiple: false,
        onDrop
    })

    const onClose = () => {
        setIsLoading(false);
        setFileUpload(null);
        setShow(false);
    }

    const onPublish = async () => {
        try {
            setIsLoading(true);
            const result = await publish({
                variables: {
                    file: fileUpload.file
                }
            });
            if (!result.data.publish.status) {
                toast.error("Ocurrió un error al cargar la publicación");
                setIsLoading(false);
            } else {
                onClose();
            }
        } catch (error) {
            toast.error("Ocurrió un error al cargar la publicación");
            console.log("error publish - ", error);
        }
    }

    return (
        <Modal size="small" open={show} onClose={onClose} className="modal-upload">
            <div {...getRootProps()} className="dropzone" style={fileUpload && {border: 0}}>
                {!fileUpload && (
                    <>
                        <Icon name="cloud upload"/>
                        <p>Arrastra tu foto que quieras publicar</p>
                    </>
                )}
                <input {...getInputProps()}/>
            </div>
            {fileUpload?.type === "image" && (
                <div className="image" style={{backgroundImage: `url("${fileUpload.preview}")`}}/>
            )}
            {fileUpload && (
                <Button className="btn-upload btn-action" onClick={onPublish}>
                    Publicar
                </Button>
            )}
            {isLoading && (
                <Dimmer active className="publishing">
                    <Loader/>
                    <p>Publicando</p>
                </Dimmer>
            )}
        </Modal>
    )
}
