import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import Profile from "../components/User/Profile";
import {useQuery} from "@apollo/client";
import {GET_PUBLICATIONS} from "../gql/publication";
import {size} from "lodash";
import Publications from "../components/Publications";

export default function User() {
    const {username} = useParams();
    const {data, loading, startPolling, stopPolling} = useQuery(GET_PUBLICATIONS, {
        variables: {username}
    });

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling])


    if (loading) {
        return null;
    }
    const {getPublications} = data;

    return (
        <>
            <Profile username={username} totalPublications={size(getPublications)}/>
            <Publications getPublications={getPublications}/>
        </>
    );
}
