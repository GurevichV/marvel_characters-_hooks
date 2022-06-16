import './charList.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { useState, useEffect, useRef, useMemo } from 'react';
import useMarvelService from '../../services/MarvelService'
import PropTypes from 'prop-types';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />
        case 'loading':
            return newItemLoading ? <Component /> : <Spinner />;
        case 'confirmed':
            return <Component />;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected process state');
    }
}


const CharList = (props) => {

    const [chars, setChars] = useState([]);
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false)

    const { getAllCharacters, process, setProcesss } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setnewItemLoading(false) : setnewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded)
            .then(() => setProcesss('confirmed'))
    }
    const onCharLoaded = async (newChars) => {

        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }
        setChars([...chars, ...newChars]);
        setnewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended)

    }

    const focusRef = useRef([]);

    const focusOnItem = (id) => {
        focusRef.current.forEach(item => item.classList.remove('char__item_selected'));
        focusRef.current[id].classList.add('char__item_selected');
        focusRef.current[id].focus();
    }


    const elements = chars.map((item, i) => {
        const { name, thumbnail, id } = item
        return (
            <CSSTransition key={id} timeout={500} className="char__item">
                <li
                    className="char__item"
                    tabIndex={0}
                    ref={el => focusRef.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(id);
                        focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(id);
                            focusOnItem(i);
                        }
                    }}>
                    <img src={thumbnail} alt="abyss" />
                    <div className="char__name">{name}</div>
                </li>
            </CSSTransition>

        )
    })

    const displayElements = useMemo(() => {
        return setContent(process, () => elements, newItemLoading)
    }, [process])


    return (
        <div className="char__list">
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {displayElements}
                </TransitionGroup>
            </ul>
            <button className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                style={{ display: charEnded ? 'none' : 'block' }}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;