import React, {useState} from "react";

const Slider = (props) => {
    const [slide, setSlide] = useState(0)

    const next = () => {
        let newSlide = slide + 1

        if(newSlide > (props.slides.length-1)) {
            newSlide = 0
        }

        setSlide(newSlide)
    }

    const prev = () => {
        let newSlide = slide - 1

        if(newSlide < 0) {
            newSlide = props.slides.length-1
        }

        setSlide(newSlide)
    }

    return (
        <>
            <div className="slide"><img src={props.slides[slide].img} alt=""/></div>
            <div className="desc">({slide+1}/{props.slides.length}) {props.slides[slide].desc}</div>
            <div className="btns">
                <div className="btn" onClick={prev}>prev</div>
                <div className="btn" onClick={next}>next</div>
            </div>
        </>
    )
}

export default Slider