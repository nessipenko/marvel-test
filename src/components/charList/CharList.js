import { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import MarvelService from '../../services/MarvelService';
import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';


class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest()
    }

    onRequest = (offset) => {
        this.onCharListLoading()
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true
        })
    }

    onCharListLoaded = (newcharList) => {
        let ended = false;
        if (newcharList.length < 9) {
            ended = true
        }

        this.setState(({ offset, charList }) => ({
            charList: [...charList, ...newcharList],
            loading: false,
            newItemsLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    itemRefs = []

    setRef = (ref) => {
        this.itemRefs.push(ref)
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'))
        this.itemRefs[id].classList.add('char__item_selected')
        this.itemRefs[id].focus()
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                <li
                    className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id)
                        this.focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === '' || e.key === 'Enter') {
                            this.props.onCharSelected(item.id)
                            this.focusOnItem(i)
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const { charList, loading, error, offset, newItemsLoading, charEnded } = this.state;

        const items = this.renderItems(charList);

        const errorM = error ? <Error /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorM}
                {spinner}
                {content}
                <button
                    disabled={newItemsLoading}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    onClick={() => this.onRequest(offset)}
                    className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div >
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;