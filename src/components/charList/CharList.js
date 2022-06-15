import './charList.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Spinner from '../spinner/Spinner';
import { useState, useEffect, useRef } from 'react';
import useMarvelService from '../../services/MarvelService'
import PropTypes from 'prop-types';


const CharList = (props) => {

    const [chars, setChars] = useState([]);
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false)

    const { loading, getAllCharacters } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setnewItemLoading(false) : setnewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded)
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

    const spinner = loading && !newItemLoading ? <Spinner /> : null;
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
    return (
        <div className="char__list">
            {spinner}
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {elements}
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