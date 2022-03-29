import React from 'react';
export const Search = ({name, BuscarDni, handleBuscarDni, handleSearchDni}) => {



    return (
        <div className="wrap">
            <div className="search">

                <input
                    name = {name}
                    autocomplete = "off"
                    className="searchTerm" 
                    placeholder="Ingrese DNI" 
                    autoFocus = "autofocus"
                    minlength = "8" 
                    maxlength = "8"
                    value = { BuscarDni }
                    onChange = { handleBuscarDni }


                />

                <button type="submit" className="searchButton" onClick={handleSearchDni}>

                    <i className="fa fa-search"></i>

                </button>

            </div>
        </div>
    )
}