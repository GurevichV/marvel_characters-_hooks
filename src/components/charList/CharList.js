import './charList.scss';
import Spinner from '../spinner/Spinner';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService'
import propTypes from 'prop-types';

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        newItemLoading: false,
        offset: 1560,
        charEnded: false
    }


    marvelService = new MarvelService();

    onRequest = (offset) => {
        this.onCharlistLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharLoaded)
    }
    onCharLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9){
            ended = true;
        }

        this.setState(({offset, chars}) => ({
            chars : [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset +9,
            charEnded: ended
        }))
    }

    onCharlistLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    componentDidMount() {
        this.onRequest()
    }


    render() {
        const { chars, loading, newItemLoading, offset, charEnded } = this.state;
        const spinner = loading ? <Spinner /> : null;
        const elements = chars.map(item => {
            const { name, thumbnail, id } = item
            return (
                <li key={id} className="char__item" onClick={() => this.props.onCharSelected(id)}>
                    <img src={thumbnail} alt="abyss" />
                    <div className="char__name">{name}</div>
                </li>
            )
        })
        return (
            <div className="char__list">
                {spinner}
                <ul className="char__grid">
                    {elements}
                </ul>
                <button className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => this.onRequest(offset)}
                style={{display: charEnded ? 'none' : 'block' }}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

}

CharList.propTypes = {
    onCharSelected : propTypes.func
}

export default CharList;