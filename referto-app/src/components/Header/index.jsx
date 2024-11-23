import logo from "../../assets/images/logo.svg";
import userprofile from "../../assets/images/user.svg";
import { Link, useNavigate } from "react-router-dom";
import LogInModal from "../Modals/LogIn";
import { useState, useEffect } from "react";
import { removeCookie } from "../../utils/cookie";
import { getUser, getAssignments } from "../../apis/api";
import { Menu } from "lucide-react";

const Header = ( props ) => {
  const { isUserLoggedIn, setIsUserLoggedIn, isSidebarOpen, setIsSidebarOpen, isDetailPage } = props;
  const [firstAssignmentId, setFirstAssignmentId] = useState('')
  const navigate = useNavigate()
  const [user, setUser] = useState("null");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      const getUserAPI = async () => {
        const currUser = await getUser();
        setUser(currUser.email);
      };
      getUserAPI();
    }
  }, [isUserLoggedIn]);

  const handleSignOut = () => {
    removeCookie("access_token");
    removeCookie("refresh_token");
    window.location.href = "/";
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      const fetchAssignments = async () => {
        try {
          const assignments = await getAssignments(user);
          setFirstAssignmentId(assignments[0]["assignment_id"]);
        } catch (error) {
          console.error("Error fetching assignments:", error);
        }
      };
      fetchAssignments();
    }
  }, [isUserLoggedIn]);

  return (
    <div className="flex w-full h-[55px] sm:h-[65px] items-center justify-between px-4 sm:px-10 py-0 relative bg-neutral-700">
      <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 relative flex-[0_0_auto]">
        {!isDetailPage && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="sm:hidden mr-1"
        >
            <Menu className="text-white w-5 h-5" />
          </button>
        )}
        <div className="flex w-[120px] sm:w-[145px] items-center gap-2 sm:gap-2.5 relative">
          <div className="relative w-[120px] sm:w-[146.54px] h-[32px] sm:h-[38px] mr-[-1.54px] cursor-pointer" 
            onClick={() => {
              if (isUserLoggedIn) {
                navigate(`/${firstAssignmentId}`);
              } else {
                navigate('/');
              }
            }}
          >
            <img
              className="absolute w-[22px] sm:w-[26px] h-6 sm:h-7 top-[5px] -left-px"
              alt="logo"
              src={logo}
            />
            <div className="absolute top-0 left-[30px] sm:left-[34px] font-[Pretendard] font-bold text-neutral-50 text-[20px] sm:text-[25px] tracking-[0] leading-[32px] sm:leading-[37.5px] whitespace-nowrap">
              REFERTO
            </div>
          </div>
        </div>
      </div>
      <div className="inline-flex items-center justify-end gap-2 sm:gap-2.5 relative self-stretch flex-[0_0_auto]">
        <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 relative self-stretch flex-[0_0_auto]">
          {isUserLoggedIn ? (
            <div className="flex flex-row items-center">
              <div className="w-fit mx-3 font-[Pretendard] font-medium text-neutral-50 text-base sm:text-lg text-center hidden sm:block">
                {user}
              </div>
              <img alt="profile" src={userprofile} className="w-5 h-5 sm:w-6 sm:h-6 mr-5 hidden sm:block" />
              <Link
                to="/"
                onClick={handleSignOut}
                className="w-fit ml-3 sm:ml-5 font-[Pretendard] font-medium text-neutral-50 text-base sm:text-lg text-center"
              >
                로그아웃
              </Link>
            </div>
          ) : (
            <div className="items-center justify-center flex">
              <div
                className="relative w-fit font-[Pretendard] font-medium text-neutral-50 text-base sm:text-lg text-center tracking-[0] leading-6 whitespace-nowrap cursor-pointer"
                onClick={handleOpenModal}
              >
                로그인
              </div>
              {isModalOpen && <LogInModal 
                onClose={handleCloseModal}
                isUserLoggedIn={isUserLoggedIn}
                setIsUserLoggedIn={setIsUserLoggedIn} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
