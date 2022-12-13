import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { ERROR_MESSAGES, TOAST } from "../../../utils/constants";
import "../styles/Banner.scss";

// ASSETS

// STYLES

const Banner = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('')

  // const [email, setEmail] = useState('')
  // const handleWatchNowClick = () => {
  //   navigate("/signup");
  // };

  const [isPlaying, SetIsPlaying] = useState(true);

  const initAuth = () => {
    if (mobileNumber.length < 10) {
      TOAST.error(ERROR_MESSAGES.AUTH.invalidEmail)
      return
    }

    window.localStorage.setItem('afri_mobile_number', mobileNumber)
    navigate('/signup')
  }

  const handleMobileNumberInput = e => {
    const text = e.target.value
    const limit = 10;
    if (isNaN(Number(text))) return
    setMobileNumber(text.slice(0, limit));
  }

  useEffect(() => {
    const handleScroll = (event) => {
      if (window.scrollY > 350) {
        SetIsPlaying(!SetIsPlaying);
      }

      if (window.scrollY < 350) {
        SetIsPlaying(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="banner">
      <wc-toast></wc-toast>
      <div className="landing-player">
        <ReactPlayer
          // url="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
          url="https://glonigeria.tvanywhereafrica.com:28182/auth-streaming/2,9d152f7a4aa2b4ff6d23e14d5c55b4cf3bdebfd2,1670946840,afpgh0550202871,0-asit_demo_la_mama_del_10_doblado_ingles_upd-hls-NONE,8,8,8,8,8,8,DESKTOP,141499,all,none,afriplayghana,172.20.1.31/hls/vod/0-asit_demo_la_mama_del_10_doblado_ingles_upd-hls-NONE/playlist.m3u8"
          width="100%"
          height="100%"
          muted={true}
          autoPlay={true}
          playing={isPlaying}
          volume={1}
        />
      </div>
      <div className="container">
        <div className="inside-banner">
          <div className="banner-text">
            <h1>Get endless <span className="yellow-span">entertainment</span>, <span className="yellow-span">series</span>, <span className="yellow-span">live events</span>, TV Shows and the <span className="yellow-span">movies</span> you love.</h1>
            <p>Sign Up To Enjoy Must-See TV</p>
            <div className="input-wrapper">
              <input placeholder="eg. 0541234567"
                value={mobileNumber}
                onChange={handleMobileNumberInput}
              />
              <button onClick={initAuth}>SIGN UP</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
