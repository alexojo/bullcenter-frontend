import React from 'react'

export const InputModal = ({ autocomplete,
                        text, 
                        placeholder, 
                        style, 
                        disabled,
                        minlength,
                        maxlength,
                        type,
                        autofocus,
                        name,
                        value,
                        onChange
                        }) => {

    text = text.charAt(0).toUpperCase() +  text.slice(1) + ":";
  

    return (
        <>
            <div className = "input__container-modal">

                <div className = "input__label-modal">
                    { text }
                </div>

                <div className = "input__input-modal" >

                    <input
                        autoComplete = { autocomplete }
                        type = { type }
                        placeholder = { placeholder }
                        name= { name }
                        disabled = { disabled }
                        minlength = { minlength }
                        maxlength = { maxlength }
                        autoFocus = { autofocus }
                        value = { value }
                        onChange = { onChange }
                    />

                </div>

            </div> 
        </>
    )
}
