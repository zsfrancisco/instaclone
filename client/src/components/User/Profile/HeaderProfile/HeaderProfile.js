import React from "react";
import {Button} from "semantic-ui-react";
import {useMutation, useQuery} from "@apollo/client";
import {toast} from "react-toastify";
import {FOLLOW, IS_FOLLOW, UNFOLLOW} from "../../../../gql/follow";
import "./HeaderProfile.scss";

export default function HeaderProfile(props) {
    const {getUser, auth, handlerModal} = props;
    const [follow] = useMutation(FOLLOW);
    const [unfollow] = useMutation(UNFOLLOW);
    const {data, loading, refetch} = useQuery(IS_FOLLOW, {
        variables: {username: getUser.username}
    });

    const onFollow = async () => {
        try {
            const userFollowed = await follow({
                variables: {username: getUser.username}
            });
            if (!userFollowed) {
                toast.error("Error al intentar seguir al usuario");
            } else {
                refetch();
            }
        } catch (error) {
            toast.error("Error al intentar seguir al usuario");
            console.log('Error following an user - ', error);
        }
    };

    const onUnfollow = async () => {
        try {
            const userUnfollowed = await unfollow({
                variables: {username: getUser.username}
            });
            if (!userUnfollowed) {
                toast.error("Error al intentar seguir al usuario");
            } else {
                refetch();
            }
        } catch (error) {
            toast.error("Error al intentar seguir al usuario");
            console.log('Error unfollowing an user - ', error);
        }
    };

    const buttonFollow = () => {
        if (data.isFollow) {
            return <Button className="btn-danger" onClick={onUnfollow}>Dejar de seguir</Button>
        } else {
            return <Button className="btn-action" onClick={onFollow}>Seguir</Button>
        }
    };

    return (
        <div className="header-profile">
            <h2>{getUser.username}</h2>
            {getUser.username === auth.username ? (
                <Button onClick={() => handlerModal("settings")}>Ajustes</Button>
            ) : (
                !loading && buttonFollow()
            )}
        </div>
    )
}
