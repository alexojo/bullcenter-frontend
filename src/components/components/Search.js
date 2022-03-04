import React from 'react';
import { useForm } from '../../hooks/useForm';

export const Search = ({name, BuscarDni, handleBuscarDni, handleSearchDni}) => {



    return (
        <div class="wrap">
            <div class="search">

                <input
                    name = {name}
                    autocomplete = "off"
                    class="searchTerm" 
                    placeholder="Ingrese DNI" 
                    autoFocus = "autofocus"
                    minlength = "8" 
                    maxlength = "8"
                    value = { BuscarDni }
                    onChange = { handleBuscarDni }


                />

                <button type="submit" class="searchButton" onClick={handleSearchDni}>

                    <i class="fa fa-search"></i>

                </button>

            </div>
        </div>
    )
}