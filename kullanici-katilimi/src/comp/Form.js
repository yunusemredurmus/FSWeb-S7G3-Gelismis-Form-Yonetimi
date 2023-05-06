import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Yup from 'yup';

import './form.css';

const Form = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        password: '',
        terms: '',
    });

    const formSchema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string()
            .email('Email adresinizi girmelisiniz!')
            .required('Email adresini lütfen doldurunuz!'),
        password: Yup.string().required('Şifre Gerekli !').min(6, 'Minimum 6 Karakter Gerekli'),
        terms: Yup.boolean().oneOf([true], 'Şartları kabul etmelisiniz'),
    });

    useEffect(() => {
        formSchema.isValid({ name, email, password, terms: agree }).then((valid) => setButtonDisabled(!valid));
    }, [name, email, password, agree, formSchema]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!agree) {
            alert('Please accept the terms of service');
            return;
        }
        formSchema
            .validate({ name, email, password, terms: agree }, { abortEarly: false })
            .then(() => {
                axios
                    .post('https://reqres.in/api/users', {
                        name,
                        email,
                        password,
                    })
                    .then((response) => {
                        const newUser = response.data;
                        setUsers([...users, newUser]);
                        setName('');
                        setEmail('');
                        setPassword('');
                        setFormErrors({
                            name: '',
                            email: '',
                            password: '',
                            terms: '',
                        });
                        console.log(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                const newErrors = error.inner.reduce((acc, currentError) => {
                    acc[currentError.path] = currentError.message;
                    return acc;
                }, {});
                setFormErrors(newErrors);
            });
    };

    return (
        <>
            <div id="en-dıs">
                <div className="ortalama">
                    <form onSubmit={handleSubmit} className="form">
                        <div>
                            <label htmlFor="name">Name and Surname:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="agree"
                                name="agree"
                                checked={agree}
                                onChange={(event) => setAgree(event.target.checked)}
                            />
                            <label htmlFor="agree">I accept the terms of service</label>
                        </div>
                        <div className="buttton">
                            <button type="submit" disabled={!agree || buttonDisabled}>
                                Gönder
                            </button>
                        </div>
                    </form>
                    {users.length > 0 && (
                        <div className="user-tablosu">
                            <h2>
                                Users:
                            </h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{index + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Form;