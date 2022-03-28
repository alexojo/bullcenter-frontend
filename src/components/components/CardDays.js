
import React from 'react'
//
export const CardDays = ( { icon ,days, label, style }) => {
    return (
        <>
            <div className = "card__container" style = {style}>

                <div className = "card__sub-container">

                    <div className = "card__icon" >
                        <i className={icon}></i>
                    </div>

                    <div className = "card__label-days">
                        { days }
                    </div>

                    <div className = "card__label"> 
                        { label }
                    </div>

                </div>
            </div>
            
        </>
    )
}
