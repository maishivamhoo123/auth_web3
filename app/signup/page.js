"use client";

import { useState } from "react";
import styles from '../styles/signup.module.css';

function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Name:", name);
        console.log("Email:", email);
        // You can handle form submission logic here
        const response = await fetch('/api/signUp' ,{
            method :'POST',
            headers :{
                'Content-Type' : 'application/json'
            },
            body :JSON.stringify({name ,email})
        } );
        const data = await response.json();
        console.log(data);
    };

    return (
        <div className={styles.container}>
            <h1>Sign Up</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label>
                    <span className={styles.label}>Name</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <label>
                    <span className={styles.label}>Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                    />
                </label>
                <button className={styles.btn} type="submit">Submit</button>
            </form>
        </div>
    );
}

export default SignUpPage;
