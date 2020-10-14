import React, { InputHTMLAttributes } from 'react';

import '../styles/components/input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
}

const Input: React.FC<InputProps> = ({ label, name, ...rest }) => {
    const htmlString = `${rest.required ? '*' : ''} ${label}`;
    return (
        <div className="input-block">
            <label htmlFor={name} dangerouslySetInnerHTML={{ __html: htmlString }}></label>
            <input type="text" id={name} {...rest} />
        </div>
    );
}

export default Input;