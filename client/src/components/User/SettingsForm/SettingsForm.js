import React from "react";
import {Button} from "semantic-ui-react";
import {useHistory} from "react-router-dom";
import {useApolloClient} from "@apollo/client";
import useAuth from "../../../hooks/useAuth";
import PasswordForm from "../PasswordForm";
import EmailForm from "../EmailForm";
import DescriptionForm from "../DescriptionForm";
import WebSiteForm from "../WebSiteForm";
import "./SettingsForm.scss";

export default function SettingsForm(props) {
    const {setShowModal, setTitleModal, setChildrenModal, getUser, refetch} = props;
    const history = useHistory();
    const client = useApolloClient();
    const {logout} = useAuth();

    const onChangePassword = () => {
        setTitleModal('Cambiar tu contraseña');
        setChildrenModal(<PasswordForm logout={onLogout}/>)
    };

    const onChangeEmail = () => {
        setTitleModal('Cambiar tu correo electrónico');
        setChildrenModal(<EmailForm setShowModal={setShowModal} currentEmail={getUser.email} refetch={refetch}/>);
    }

    const onChangeDescription = () => {
        setTitleModal("Actualizar tu biografía");
        setChildrenModal(
            <DescriptionForm setShowModal={setShowModal}
                             currentDescription={getUser.description}
                             refetch={refetch}
            />
        );
    };

    const onChangeWebSite = () => {
        setTitleModal("Actualizar tu sitio web");
        setChildrenModal(
            <WebSiteForm setShowModal={setShowModal}
                         currentWebsite={getUser.website}
                         refetch={refetch}
            />
        )
    };

    const onLogout = () => {
        client.clearStore();
        logout();
        history.push('/');
    };

    return (
        <div className="settings-form">
            <Button onClick={onChangePassword}>Cambiar contraseña</Button>
            <Button onClick={onChangeEmail}>Cambiar correo electrónico</Button>
            <Button onClick={onChangeDescription}>Descripción</Button>
            <Button onClick={onChangeWebSite}>Sitio web</Button>
            <Button onClick={onLogout}>Cerrar sesión</Button>
            <Button onClick={() => setShowModal(false)}>Cancelar</Button>
        </div>
    )
}
