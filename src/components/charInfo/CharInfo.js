import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './charInfo.scss';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import propTypes from 'prop-types';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const { loading, error, getCharacters } = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])


    const updateChar = () => {
        const { charId } = props;
        if (!charId) {
            return;
        }

        getCharacters(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const skeleton = char || loading || error ? null : <Skeleton />
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;
    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char
    const notImage = thumbnail.indexOf('image_not_available') > -1;
    const comicsList = comics.length > 0 ? <Comics comics={comics} /> : "This character dosn't have comics";
    return (
        <>
            <div className="char__basics">
                <img style={{ objectFit: notImage ? 'contain' : null }} src={thumbnail} alt={name} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">Homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            {comicsList}
        </>
    )
}

const Comics = ({ comics }) => {
    const sliceComics = comics.slice(0, 10);
    return (
        <>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    sliceComics.map((item, i) => {
                        const { resourceURI } = item;
                        const linkToComic = resourceURI.substring(resourceURI.indexOf("/comics/"));
                        return (<li key={i} className="char__comics-item">
                            <Link to={linkToComic}>{item.name}</Link>
                        </li>)
                    })}
            </ul>
        </>
    )
}


CharInfo.propTypes = {
    charId: propTypes.number
}

export default CharInfo;