import {useEffect, useState} from "react";
import './App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function App() {
    const CLIENT_ID = "a7f41400c61b4a41a5f36a2a01f3835f"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [Shows, setShows] = useState([])

    // const getToken = () => {
    //     let urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
    //     let token = urlParams.get('access_token');
    // }

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        // getToken()


        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const searchShow = async (e) => {
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "show"
            }
        })
        console.log(data)
        setShows(data.shows.items)
        // console.log(data)
    }
    const renderEpisodes = async (e) => {
        e.preventDefault()
        const {data} = await axios.get(`https://api.spotify.com/v1/shows/${data.shows.items.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setShows(data.shows.items)
    }

    const renderShows = () => {
        return Shows.map(show => (
            <div className="artist" key={show.id}>
                {show.images.length ? <img className="imgArtist" width={"100%"} src={show.images[0].url} alt=""/> : <div>No Image</div>}
                <a href={renderEpisodes} className="name-show"> {show.name}</a>
                <p className="total-episodes">{show.total_episodes}</p>
            </div>
        ))
    }
    
    
    return (
        <div className="App">
            <header className="App-header">
                <h1>Spotify Api Project</h1>
                {!token ?
                    <a className="login" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                        to Spotify</a>
                    : <button onClick={logout}>Logout</button>}

                {token ?
                    <form onSubmit={searchShow}>
                        <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                        <button type={"submit"}>Search</button>
                    </form>
                    
                    : <FontAwesomeIcon icon="fa-solid fa-arrow-up" />
                }

                {renderShows()}

            </header>
        </div>
    );
}

export default App;