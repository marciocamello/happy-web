import React, { TextareaHTMLAttributes } from 'react';

import '../styles/components/input.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string;
    label: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, name, ...rest }) => {
    const htmlString = `${rest.required ? '*' : ''} ${label}`;
    return (
        <div className="input-block">
            <label htmlFor={name} dangerouslySetInnerHTML={{ __html: htmlString }}></label>
            <textarea id={name} {...rest}></textarea>
        </div>
    );
}

export default Textarea;