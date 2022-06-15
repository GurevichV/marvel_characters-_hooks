import './comicsList.scss';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import React, { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import propTypes from 'prop-types';


const ComicsList = (props) => {
    const [comics, setComics] = useState([]);
    const { loading, getAllComics } = useMarvelService();
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false)

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setnewItemLoading(false) : setnewItemLoading(true);
        getAllComics(offset)
            .then(onCharLoaded)
    }

    const onCharLoaded = (newComics) => {
        let ended = false;
        if (newComics.length < 8) {
            ended = true;
        }
        setComics(comics => [...comics, ...newComics]);
        setnewItemLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended)
    }

    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    const elements = comics.map((item, i) => {
        const { title, thumbnail, id, price } = item
        return (
            <li
                className="comics__item"
                tabIndex={0}
                key={i}> <Link to={`/comics/${id}`}>
                    <img src={thumbnail} alt="ultimate war" className="comics__item-img" />
                    <div className="comics__item-name">{title}</div>
                    <div className="comics__item-price">{price}</div>
                </Link>
            </li>
        )
    })

    return (
        <div className="comics__list">
            {spinner}
            <ul className="comics__grid">
                {elements}
            </ul>
            <button className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                style={{ display: comicsEnded ? 'none' : 'block' }}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

ComicsList.propTypes = {
    onCharSelected: propTypes.func.isRequired
}

export default ComicsList;