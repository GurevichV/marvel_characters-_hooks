import './charList.scss';
import Spinner from '../spinner/Spinner';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService'

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
    }

    onCharLoaded = (chars) => {
        this.setState({
            chars,
            loading: false,
        })
    }
    marvelService = new MarvelService();
    updateChar = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharLoaded)
    }

    componentDidMount() {
        this.updateChar()
    }


    render() {
        const { chars, loading } = this.state
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
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

}

export default CharList;