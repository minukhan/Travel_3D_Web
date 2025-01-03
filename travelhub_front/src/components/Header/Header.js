import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./Header.css";
import Cookies from "js-cookie";

const apiUrl = process.env.REACT_APP_API_URL;

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allTravel, setAllTravel] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { isAuthenticated, setIsAuthenticated, setUserInfo } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = async () => {
    
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth > 680) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("jwtToken", { path: "/" });
    console.log("Logout button clicked");
    setIsAuthenticated(false);
    setUserInfo(null); // 사용자 정보 초기화
    navigate("/");
  };

  useEffect(() => {
    try {
      const dataset = async()=>{
        const response = await axios.get(apiUrl+"/travels/noname");
        setAllTravel(response.data);
      }
      dataset ();
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filteredTravels = allTravel.filter(travel => {
      const { hashtag, travel_title, travel_location_name } = travel;
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        hashtag.toLowerCase().includes(lowerCaseSearchTerm) ||
        travel_title.toLowerCase().includes(lowerCaseSearchTerm) ||
        travel_location_name.toLowerCase().includes(lowerCaseSearchTerm)
      );
  });
  return (
    <div>
      <nav className="hd">
        <div className="container menuWrap">
          <Link to="/">
            <img
              src="./images/footer-logo-removebg-preview.png"
              alt="Logo"
              className="logo"
            />{" "}
          </Link>
          {/* 로고 이미지 */}
          {windowWidth <= 680 && (
            <span className="menu-btn" onClick={toggleSidebar}>
              &#9776;
            </span>
          )}
          <nav className="gnb">
            <ul>
              {windowWidth > 680 && (
                <>
                  <li>
                    <Link to="/">이웃스토리</Link>
                  </li>
                  <li>
                    <Link to="/about">이용방법</Link>
                  </li>
                  <li>
                    <Link to="/record">기록하기</Link>
                  </li>
                  {isAuthenticated ? (
                    <>
                      <li>
                        <Link to="/mypage" className="mypage">
                          마이페이지
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="logout">
                          로그아웃
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/login" className="login">
                          로그인
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" className="register">
                          회원가입
                        </Link>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
          </nav>
          <div className="search-container">
            <input
              type="text"
              value={searchTerm}
              className="search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          {/* <ul className="sns">
            <li>
              <i className="fa-brands fa-facebook-f"></i>
            </li>
            <li>
              <i className="fa-brands fa-twitter"></i>
            </li>
          </ul> */}
        </div>
      </nav>

      <div className="sidebar" style={{ width: sidebarOpen ? "250px" : "0" }}>
        <button className="closebtn" onClick={toggleSidebar}>
          &times;
        </button>
        <Link to="/" onClick={toggleSidebar}>
          이웃스토리
        </Link>
        <Link to="/about" onClick={toggleSidebar}>
          이용방법
        </Link>
        <Link to="/record" onClick={toggleSidebar}>
          기록하기
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/mypage" onClick={toggleSidebar}>
              마이페이지
            </Link>
            <button onClick={handleLogout} className="logout">
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={toggleSidebar}>
              로그인
            </Link>
            <Link to="/register" onClick={toggleSidebar}>
              회원가입
            </Link>
          </>
        )}
      </div>
      <div className="travel-results">
      {searchTerm === '' ? ( // 검색어가 비어있을 때 아무것도 표시하지 않음
            null
        ) : (
          filteredTravels.length > 0 ? ( // 결과가 있을 때만 표시
              filteredTravels.map(travel => (
                <Link to={"/studio/"+travel.travelId}key={travel.travelId}>
                <div className="travel-card" >
                    <h2>{travel.travel_title}</h2>
                    <p>위치: {travel.travel_location_name}</p>
                    <p>해시태그: {travel.hashtag}</p>
                </div>
              </Link>
              ))
          ) : (
              searchTerm && <p>검색 결과가 없습니다.</p> // 검색어가 있을 때 결과가 없으면 메시지 표시
          )
        )}
      </div>
    </div>
  );
};

export default Header;
