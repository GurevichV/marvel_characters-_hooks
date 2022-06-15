import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import useMarvelService from '../../services/MarvelService';
import './searchForm.scss';
import ErrorMessage from '../errorMessage/ErrorMessage';

const SearchForm = () => {
    const [charName, setCharName] = useState(null);

    const { loading, error, getCharactersByName, clearError } = useMarvelService();

    const getInput = (data) => {
        clearError();
        getCharactersByName(data.name)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setCharName(char);
    }

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;
    const notFoundMessage = <div className="char__search-error">The character was not found. Check the name and try again.</div>
    const buttonToPage = !charName ? null : charName.length > 0 ? <div className="char__search-wrapper">
        <div className="char__search-success">There is! Visit {charName[0].name} page?</div>
        <Link to={`/characters/${charName[0].id}`} className="button button__secondary">
            <div className="inner">To page</div>
        </Link>
    </div> :
        notFoundMessage
    return (
        <div className="char__search-form">
            <Formik
                initialValues={{ name: '' }}
                validationSchema={Yup.object({
                    name: Yup.string().min(2, 'Min. 2 letters').required('Fieald is required')
                })}
                onSubmit={values => getInput(values)}
            >
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter name"
                        />
                        <button className='button button__main' type="submit"><div className="inner" disabled={loading}>Find</div></button>
                    </div>
                    <FormikErrorMessage className="char__search-error" name="name" component="div" />
                    {buttonToPage}
                    {errorMessage}
                </Form>
            </Formik>
        </div>
    )
}

export default SearchForm;