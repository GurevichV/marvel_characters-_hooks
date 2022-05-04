import './charList.scss';
import { Component } from 'react';
import abyss from '../../resources/img/abyss.jpg';
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

    componentDidMount(){
        this.updateChar()
    }


    render(){
        const {chars} = this.state
        const elements = chars.map(item => {
            const {name, thumbnail, id} = item
            return (
                <li key={id} className="char__item">
                    <img src={thumbnail} alt="abyss"/>
                    <div className="char__name">{name}</div>
                </li>
            )
        })
        return (
                <div className="char__list">
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