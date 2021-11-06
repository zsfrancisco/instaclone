import React, {useEffect} from "react";
import {Image} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {map} from "lodash";
import {useQuery} from "@apollo/client";
import {GET_NOT_FOLLOWED} from "../../../gql/follow";
import ImageNotFound from "../../../assets/png/avatar.png";
import "./UsersNotFollowed.scss";

export default function UsersNotFollowed() {
    const {data, loading, startPolling, stopPolling} = useQuery(GET_NOT_FOLLOWED);

    useEffect(() => {
        startPolling(1000);
        return () => stopPolling();
    }, [startPolling, stopPolling]);

    if (loading) return null;
    const {getNotFollowed} = data;

    return (
        <div className="users-not-followed">
            <h3>Usuarios que no sigues</h3>
            {map(getNotFollowed, (user, index) => (
                <Link key={index} to={`/${user.username}`} className="users-not-followed__user">
                    <Image src={user.avatar || ImageNotFound} avatar/>
                    <span>{user.name}</span>
                </Link>
            ))}
        </div>
    );
}
