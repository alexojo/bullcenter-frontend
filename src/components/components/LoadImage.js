import React from 'react'

export const LoadImage = ({ src, text, value, onChange }) => {

    //<input type="file" name="imagensubida" />
    return (
        <div className = "register-image__image">
            <img src= { value } alt="profile_picture"/>
            
            <div className = "register-image__button">
                <input 
                    type="file" 
                    className="custom-file-input" 
                    accept="image/*"
                    name= { text }
                    src = { value }
                    onChange = { onChange }
                />

            </div>
            
            

        </div>
    )
}
