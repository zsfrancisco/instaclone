import React, {useEffect, useState} from "react";
import {Image, Search as SearchSU} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {size} from "lodash";
import {useQuery} from "@apollo/client";
import {SEARCH} from "../../../gql/user";
import ImageNoFound from "../../../assets/png/avatar.png";

import "./Search.scss"

export default function Search() {
    const [search, setSearch] = useState(null);
    const [results, setResults] = useState([]);
    const {data, loading} = useQuery(SEARCH, {
        variables: {
            search
        }
    });

    useEffect(() => {
        if (size(data?.search) > 0) {
            const users = [];
            data.search.forEach((user, index) => {
                const {name, username, avatar} = user;
                users.push({
                    key: index,
                    title: name,
                    username: username,
                    avatar: avatar
                });
                setResults(users);
            });
        } else {
            setResults([]);
        }
    }, [data]);

    const onChange = (e) => {
        if (e.target.value) {
            setSearch(e.target.value);
        } else {
            setSearch(null);
        }
    };

    const handleResultSelect = () => {
        setSearch(null);
        setResults([]);
    };

    return (
        <SearchSU className="search-users"
                  fluid
                  input={{icon: "search", iconPosition: "left"}}
                  loading={loading}
                  value={search || ""}
                  onSearchChange={onChange}
                  results={results}
                  onResultSelect={handleResultSelect}
                  resultRenderer={(e) => <ResultSearch data={e}/>}
        />
    );
}

function ResultSearch(props) {
    const {data} = props;

    return (
        <Link className="search-users__item" to={`/${data.username}`}>
            <Image src={data.avatar || ImageNoFound}/>
            <div>
                <p>{data.title}</p>
                <p>{data.username}</p>
            </div>
        </Link>
    );
}
